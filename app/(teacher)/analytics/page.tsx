"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader2, Database } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { handleGetTeacherCoursesRevenuePage } from "@/services/courseService";
import { handleGetSpecificPayments } from "@/services/paymentService";

interface CourseRevenueDetail {
  id: string;
  name: string;
  rating: string;
  students: number;
  netRevenue: number;
}

interface ChartDataPoint {
  dayOfWeek: string;
  date: string;
  totalNetRevenue: number;
}

interface ChartDataItem {
  name: string;
  date: string;
  revenue: number;
}

interface DatePickerProps {
  date: string | null;
  setDate: (value: string) => void;
  placeholder?: string;
}

const DatePicker = ({ date, setDate, placeholder }: DatePickerProps) => (
  <input
    type="date"
    value={date || ""}
    onChange={(e) => setDate(e.target.value)}
    className="border p-2 rounded-md bg-background text-sm"
    placeholder={placeholder}
  />
);

export default function AnalyticsPage() {
  const [courseStats, setCourseStats] = useState<CourseRevenueDetail[]>([]);

  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [startDate, setStartDate] = useState("2025-12-08");
  const [endDate, setEndDate] = useState("2025-12-14");

  const [data, setData] = useState<ChartDataItem[]>([]);
  const [currentRawData, setCurrentRawData] = useState<ChartDataPoint[]>([]);

  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
  const [isLoadingChartData, setIsLoadingChartData] = useState(false);

  const fetchChartData = useCallback(
    async (courseId: string, start: string, end: string) => {
      if (!courseId) return;

      setIsLoadingChartData(true);
      try {
        const raw = await handleGetSpecificPayments(courseId, start, end);
        console.log(raw);
        setCurrentRawData(raw || []);
      } catch (error) {
        console.error("Error fetching chart data:", error);
        setCurrentRawData([]);
      } finally {
        setIsLoadingChartData(false);
      }
    },
    []
  );

  const fetchInitialData = useCallback(async () => {
    setIsLoadingInitialData(true);
    try {
      const courseData = await handleGetTeacherCoursesRevenuePage();
      console.log("course: ", courseData);
      setCourseStats(courseData || []);

      if (courseData && courseData.length > 0) {
        const defaultCourseId = courseData[0].id;
        setSelectedCourseId(defaultCourseId);

        const today = new Date().toISOString().split("T")[0];
        const lastWeek = new Date(new Date().setDate(new Date().getDate() - 7))
          .toISOString()
          .split("T")[0];
        setStartDate(lastWeek);
        setEndDate(today);
        fetchChartData(defaultCourseId, lastWeek, today);
      } else {
        setIsLoadingChartData(false);
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setCourseStats([]);
    } finally {
      setIsLoadingInitialData(false);
    }
  }, [fetchChartData]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    const formattedData = currentRawData.map((item) => ({
      name: item.dayOfWeek,
      date: item.date,
      revenue: item.totalNetRevenue,
    }));
    setData(formattedData);
  }, [currentRawData]);

  const handleUpdateFilter = () => {
    fetchChartData(selectedCourseId, startDate, endDate);
  };

  const hasAnalyticsData = courseStats.length > 0;

  const hasRevenue = useMemo(() => {
    if (isLoadingChartData || data.length === 0) return false;
    return data.some((item) => item.revenue > 0);
  }, [isLoadingChartData, data]);

  const formatDateDisplay = useCallback((dateString: string) => {
    try {
      const [year, month, day] = dateString.split("-");
      return `${day}-${month}-${year}`;
    } catch {
      return dateString;
    }
  }, []);

  const formatYAxis = useCallback((value: number) => {
    if (value === 0) return "0";
    if (value >= 1000000) {
      return `${value / 1000000}M`;
    }
    return `${value / 1000}K`;
  }, []);

  const maxRevenue = useMemo(
    () => Math.max(0, ...currentRawData.map((item) => item.totalNetRevenue)),
    [currentRawData]
  );
  const tickStep = 500000;
  const domainMax = useMemo(
    () => Math.ceil(maxRevenue / tickStep) * tickStep,
    [maxRevenue, tickStep]
  );

  const customTicks = useMemo(() => {
    const ticks = [];
    for (let i = 0; i <= domainMax; i += tickStep) {
      ticks.push(i);
    }
    return ticks;
  }, [domainMax, tickStep]);

  const LoadingState = ({ message = "Đang tải dữ liệu..." }) => (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background text-muted-foreground">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="ml-3 text-lg text-muted-foreground">{message}</p>
    </div>
  );

  const NoDataState = () => (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background text-muted-foreground p-10 border border-dashed rounded-lg">
      <Database className="h-10 w-10 mb-3" />
      <p className="font-semibold">Không tìm thấy doanh thu.</p>
      <p className="text-sm text-center">
        Khóa học này chưa có doanh thu trong khoảng thời gian đã chọn.
      </p>
    </div>
  );

  if (isLoadingInitialData) {
    return (
      <main className="flex-1 overflow-auto p-8 relative">
        <div className="h-125 flex items-center justify-center">
          <LoadingState message="Đang tải dữ liệu thống kê ban đầu..." />
        </div>
      </main>
    );
  }

  if (!hasAnalyticsData) {
    return (
      <main className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold text-foreground">Thống Kê</h1>
        <Card className="border-2 border-dashed mt-8">
          <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="space-y-2 max-w-md">
              <h2 className="text-2xl font-bold text-foreground">
                Không có dữ liệu thống kê
              </h2>
              <p className="text-muted-foreground">
                Tạo khóa học đầu tiên của bạn để bắt đầu xem thống kê chi tiết
              </p>
            </div>
            <Link href="/courses/create">
              <Button size="lg" className="gap-2 cursor-pointer">
                Tạo Khóa Học Đầu Tiên
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Thống Kê</h1>
          <p className="text-muted-foreground mt-2">
            Phân tích chi tiết về khóa học và doanh thu của bạn
          </p>
        </div>

        {/* Charts Tabs */}
        <Tabs defaultValue="revenue" className="space-y-4">
          <TabsList>
            <TabsTrigger value="revenue">Doanh Thu</TabsTrigger>
            <TabsTrigger value="courses">Khóa Học</TabsTrigger>
          </TabsList>

          {/* Revenue Chart */}
          <TabsContent value="revenue" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Doanh Thu Hàng Tuần</CardTitle>
                <CardDescription>
                  Khóa học:{" "}
                  {courseStats.find((c) => c.id === selectedCourseId)?.name ||
                    "N/A"}{" "}
                  (Từ {formatDateDisplay(startDate)} đến{" "}
                  {formatDateDisplay(endDate)})
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row items-center gap-4 border p-4 rounded-lg bg-muted/20">
                  <h3 className="font-semibold text-foreground mr-2 text-sm">
                    Bộ Lọc:
                  </h3>

                  <Select
                    value={selectedCourseId}
                    onValueChange={setSelectedCourseId}
                  >
                    <SelectTrigger className="w-45">
                      <SelectValue placeholder="Chọn Khóa Học" />
                    </SelectTrigger>
                    <SelectContent>
                      {courseStats
                        .filter((course) => course.id)
                        .map((course) => (
                          <SelectItem key={course.id} value={course.id}>
                            {course.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Từ:</span>
                    <DatePicker
                      date={startDate}
                      setDate={setStartDate}
                      placeholder="Ngày Bắt Đầu"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">Đến:</span>
                    <DatePicker
                      date={endDate}
                      setDate={setEndDate}
                      placeholder="Ngày Kết Thúc"
                    />
                  </div>

                  <Button
                    className="ml-auto"
                    onClick={handleUpdateFilter}
                    disabled={isLoadingChartData}
                  >
                    {isLoadingChartData ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      "Cập nhật"
                    )}
                  </Button>
                </div>
                {/* --- KẾT THÚC BỘ LỌC --- */}

                {/* BIỂU ĐỒ DOANH THU - HIỂN THỊ TRẠNG THÁI */}
                <div className="relative">
                  <ResponsiveContainer width="100%" height={400}>
                    {isLoadingChartData ? (
                      <LoadingState message="Đang tải dữ liệu biểu đồ..." />
                    ) : !hasRevenue ? (
                      <NoDataState />
                    ) : (
                      <LineChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="var(--color-border)"
                        />
                        <XAxis
                          dataKey="name"
                          stroke="var(--color-muted-foreground)"
                          interval={0}
                          padding={{ left: 15, right: 15 }}
                        />
                        <YAxis
                          stroke="var(--color-muted-foreground)"
                          tickFormatter={formatYAxis}
                          domain={[0, domainMax]}
                          ticks={customTicks}
                          interval={0}
                        />
                        <Tooltip
                          labelFormatter={(label, payload) => {
                            if (payload && payload.length > 0) {
                              const dataPoint = payload[0].payload;
                              const fullDateString = dataPoint.date;
                              const formattedDate =
                                formatDateDisplay(fullDateString);
                              return `${label}, ${formattedDate}`;
                            }
                            return label;
                          }}
                          formatter={(value) => [
                            `${value.toLocaleString("vi-VN")} đ`,
                            "Doanh thu",
                          ]}
                          contentStyle={{
                            backgroundColor: "var(--color-card)",
                            border: `1px solid var(--color-border)`,
                            borderRadius: "8px",
                            color: "var(--color-foreground)",
                          }}
                        />
                        <Legend wrapperStyle={{ paddingTop: 10 }} />
                        <Line
                          type="monotone"
                          dataKey="revenue"
                          name="Doanh Thu"
                          stroke="var(--color-primary)"
                          strokeWidth={2}
                          dot={{ fill: "var(--color-primary)", r: 4 }}
                        />
                      </LineChart>
                    )}
                  </ResponsiveContainer>
                  {/*  */}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thống Kê Khóa Học</CardTitle>
                <CardDescription>Hiệu suất của từng khóa học</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 💡 SỬ DỤNG DỮ LIỆU THỰC TẾ (courseStats) */}
                  {courseStats.map((course) => (
                    <div
                      key={course.id} // SỬ DỤNG ID
                      className="p-4 rounded-lg border space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-foreground">
                          {course.name}
                        </h4>
                        <span className="text-sm text-muted-foreground">
                          {(course.students ?? 0) > 0
                            ? `${course.students} học sinh`
                            : "Chưa có dữ liệu học sinh"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Đánh giá trung bình
                        </span>
                        <span className="text-foreground font-semibold">
                          {/* Chuyển đổi rating từ string sang float */}
                          {parseFloat(course.rating) > 0
                            ? `${parseFloat(course.rating).toFixed(2)}★`
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Doanh thu</span>
                        <span className="text-foreground font-semibold">
                          {(course.netRevenue ?? 0).toLocaleString("vi-VN")} đ
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
