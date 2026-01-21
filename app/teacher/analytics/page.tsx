"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader, Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
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
import toast from "react-hot-toast";

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
  totalGmv: number;
  newStudents: number;
}

interface ChartDataItem {
  name: string;
  date: string;
  revenue: number;
  gmv: number;
  newStudents: number;
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
  const [startDate, setStartDate] = useState("2026-01-12");
  const [endDate, setEndDate] = useState("2026-01-18");

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
        setCurrentRawData(raw || []);
      } catch {
        toast.error("Đã xảy ra lỗi khi tải dữ liệu biểu đồ!");
        setCurrentRawData([]);
      } finally {
        setIsLoadingChartData(false);
      }
    },
    [],
  );

  const fetchInitialData = useCallback(async () => {
    setIsLoadingInitialData(true);
    try {
      const courseData = await handleGetTeacherCoursesRevenuePage();
      setCourseStats(courseData || []);

      if (courseData && courseData.length > 0) {
        const defaultCourseId = courseData[0].id;
        setSelectedCourseId(defaultCourseId);

        const now = new Date();
        const dayOfWeek = now.getDay();
        const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        const monday = new Date(now);
        monday.setDate(now.getDate() - diffToMonday);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);

        const startDateStr = monday.toLocaleDateString("en-CA");
        const endDateStr = sunday.toLocaleDateString("en-CA");

        setStartDate(startDateStr);
        setEndDate(endDateStr);
        fetchChartData(defaultCourseId, startDateStr, endDateStr);
      }
    } catch {
      toast.error("Không thể tải cấu trúc dữ liệu giảng viên");
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
      gmv: item.totalGmv,
      newStudents: item.newStudents,
    }));
    setData(formattedData);
  }, [currentRawData]);

  const handleUpdateFilter = () => {
    fetchChartData(selectedCourseId, startDate, endDate);
  };

  const isAllZero = useMemo(() => {
    return (
      data.length === 0 ||
      data.every((item) => item.revenue === 0 && item.gmv === 0)
    );
  }, [data]);

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
    if (value >= 1000000) return `${value / 1000000}M`;
    return `${value / 1000}K`;
  }, []);

  const maxVal = useMemo(
    () =>
      Math.max(
        ...data.map((item) => Math.max(item.revenue, item.gmv)),
        1000000,
      ),
    [data],
  );
  const step = 500000;
  const domainMax = Math.ceil(maxVal / step) * step;
  const customTicks = useMemo(() => {
    const ticks = [];
    for (let i = 0; i <= domainMax; i += step) ticks.push(i);
    return ticks;
  }, [domainMax]);

  if (isLoadingInitialData) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-black-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-1 overflow-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Thống Kê</h1>
        <p className="text-muted-foreground mt-2">
          Phân tích doanh thu và học viên mới
        </p>
      </div>

      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Báo Cáo Chi Tiết</CardTitle>
              <CardDescription>
                Dữ liệu từ {formatDateDisplay(startDate)} đến{" "}
                {formatDateDisplay(endDate)}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Bộ lọc */}
              <div className="flex flex-wrap items-center gap-4 border p-4 rounded-lg bg-muted/20">
                <Select
                  value={selectedCourseId}
                  onValueChange={setSelectedCourseId}
                >
                  <SelectTrigger className="w-60">
                    <SelectValue placeholder="Chọn Khóa Học" />
                  </SelectTrigger>
                  <SelectContent>
                    {courseStats.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Từ:</span>
                  <DatePicker date={startDate} setDate={setStartDate} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">Đến:</span>
                  <DatePicker date={endDate} setDate={setEndDate} />
                </div>
                <Button
                  onClick={handleUpdateFilter}
                  disabled={isLoadingChartData}
                  className="cursor-pointer"
                >
                  {isLoadingChartData ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Cập nhật"
                  )}
                </Button>
              </div>

              <div className="relative min-h-112.5 border rounded-xl p-6 bg-card">
                {isLoadingChartData ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                    <p className="text-muted-foreground">
                      Đang cập nhật biểu đồ...
                    </p>
                  </div>
                ) : isAllZero ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <p>Chưa có doanh thu trong khoảng thời gian này</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
                      Doanh Thu Trong Tuần (Đơn vị: VNĐ)
                    </h3>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart
                        data={data}
                        margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          vertical={false}
                          strokeOpacity={0.5}
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={true}
                          tickLine={true}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          tickFormatter={formatYAxis}
                          domain={[0, domainMax]}
                          ticks={customTicks}
                          axisLine={true}
                          tickLine={true}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(0,0,0,0.02)" }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const item = payload[0].payload;
                              const gmv = item.gmv || 0;
                              const revenue = item.revenue || 0;
                              const platformProfit = gmv * 0.2;

                              return (
                                <div className="bg-white border border-border p-4 rounded-xl shadow-xl min-w-60">
                                  <p className="text-sm font-bold mb-3 border-b border-slate-200 pb-2 text-black">
                                    {item.name} ({formatDateDisplay(item.date)})
                                  </p>

                                  <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-center text-xs">
                                      <span className="text-black font-medium">
                                        Tổng doanh thu:
                                      </span>
                                      <span className="font-bold text-black">
                                        {gmv.toLocaleString("vi-VN")} đ
                                      </span>
                                    </div>

                                    <div className="flex justify-between items-center text-xs">
                                      <span className="text-black font-medium">
                                        Giảng viên nhận:
                                      </span>
                                      <span className="font-bold text-black">
                                        {revenue.toLocaleString("vi-VN")} đ
                                      </span>
                                    </div>

                                    <div className="pt-2 border-t border-dashed border-slate-300 mt-1">
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-black font-medium">
                                          Lợi nhuận sàn:
                                        </span>
                                        <span className="font-bold text-black">
                                          {platformProfit.toLocaleString(
                                            "vi-VN",
                                          )}{" "}
                                          đ
                                        </span>
                                      </div>
                                    </div>

                                    <div className="pt-2 border-t border-slate-200 mt-1">
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-black font-bold flex items-center gap-1">
                                          Học viên mới:
                                        </span>
                                        <span className="font-bold text-black">
                                          {item.newStudents}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend
                          verticalAlign="top"
                          align="right"
                          iconType="circle"
                          wrapperStyle={{
                            paddingBottom: 30,
                            fontSize: "12px",
                            fontWeight: "bold",
                          }}
                        />
                        <Bar
                          dataKey="revenue"
                          name="Tổng doanh thu"
                          fill="#3b82f6"
                          radius={[6, 6, 0, 0]}
                          barSize={45}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
