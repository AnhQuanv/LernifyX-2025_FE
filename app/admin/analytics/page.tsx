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
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { handleGetSpecificPayments } from "@/services/paymentService";
import { handleGetTeacherCourseTree } from "@/services/courseService";

interface CourseDetail {
  id: string;
  title: string;
  status: string;
}

interface TeacherHierarchy {
  id: string;
  name: string;
  courses: CourseDetail[];
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
    className="border p-2 rounded-md bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
    placeholder={placeholder}
  />
);

export default function AnalyticsPage() {
  const [hierarchyData, setHierarchyData] = useState<TeacherHierarchy[]>([]);
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [startDate, setStartDate] = useState("2026-01-12");
  const [endDate, setEndDate] = useState("2026-01-18");

  const [data, setData] = useState<ChartDataItem[]>([]);
  const [currentRawData, setCurrentRawData] = useState<ChartDataPoint[]>([]);

  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true);
  const [isLoadingChartData, setIsLoadingChartData] = useState(false);
  const hasFetched = useRef(false);
  const renderCount = useRef(0);
  renderCount.current++;

  const filteredCourses = useMemo(() => {
    if (hierarchyData.length === 0 || !selectedTeacherId) return [];

    const teacher = hierarchyData.find((t) => t.id === selectedTeacherId);
    return teacher ? teacher.courses : [];
  }, [selectedTeacherId, hierarchyData]);

  useEffect(() => {
    if (isLoadingInitialData || hierarchyData.length === 0) return;

    if (filteredCourses.length > 0) {
      const isCurrentCourseValid = filteredCourses.some(
        (c) => c.id === selectedCourseId
      );

      if (!isCurrentCourseValid) {
        setSelectedCourseId(filteredCourses[0].id);
      }
    } else {
      setSelectedCourseId("");
    }
  }, [
    filteredCourses,
    selectedCourseId,
    isLoadingInitialData,
    hierarchyData.length,
  ]);

  useEffect(() => {
    if (filteredCourses.length > 0) {
      const isCurrentCourseValid = filteredCourses.some(
        (c) => c.id === selectedCourseId
      );
      if (!isCurrentCourseValid) {
        setSelectedCourseId(filteredCourses[0].id);
      }
    } else {
      setSelectedCourseId("");
    }
  }, [filteredCourses, selectedCourseId]);

  const fetchChartData = useCallback(
    async (courseId: string, start: string, end: string, teacherId: string) => {
      setIsLoadingChartData(true);
      try {
        const dataChart = await handleGetSpecificPayments(
          courseId,
          start,
          end,
          teacherId
        );
        setCurrentRawData(dataChart || []);
      } catch {
        toast.error("Đã xảy ra lỗi khi tải dữ liệu biểu đồ!");
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
      const res = await handleGetTeacherCourseTree();

      if (res && res.length > 0) {
        setHierarchyData(res);

        const firstTeacher = res[0];
        const firstCourse = firstTeacher.courses?.[0];

        if (firstTeacher && firstCourse) {
          setSelectedTeacherId(firstTeacher.id);
          setSelectedCourseId(firstCourse.id);

          await fetchChartData(
            firstCourse.id,
            startDate,
            endDate,
            firstTeacher.id
          );
        }
      }
    } catch {
      toast.error("Không thể tải cấu trúc dữ liệu giảng viên");
    } finally {
      setIsLoadingInitialData(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchChartData]);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchInitialData();
      hasFetched.current = true;
    }
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
    if (selectedTeacherId) {
      fetchChartData(selectedCourseId, startDate, endDate, selectedTeacherId);
      toast.success("Đã cập nhật dữ liệu!");
    }
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
        1000000
      ),
    [data]
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
        <h1 className="text-3xl font-bold">Thống Kê Hệ Thống</h1>
        <p className="text-muted-foreground mt-2">
          Phân tích doanh thu theo giảng viên và khóa học
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
              <div className="flex flex-wrap items-center gap-4 border p-4 rounded-lg bg-muted/20">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
                    Giảng viên
                  </span>
                  <Select
                    value={selectedTeacherId}
                    onValueChange={(val) => setSelectedTeacherId(val)}
                  >
                    <SelectTrigger className="w-56 bg-background">
                      <SelectValue placeholder="Chọn Giảng Viên" />
                    </SelectTrigger>
                    <SelectContent>
                      {hierarchyData.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
                    Khóa học
                  </span>
                  <Select
                    value={selectedCourseId}
                    onValueChange={setSelectedCourseId}
                    disabled={filteredCourses.length === 0}
                  >
                    <SelectTrigger className="w-64 bg-background">
                      <SelectValue
                        placeholder={
                          filteredCourses.length > 0
                            ? "Chọn Khóa Học"
                            : "Không có khóa học"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCourses.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Từ:</span>
                  <DatePicker date={startDate} setDate={setStartDate} />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Đến:</span>
                  <DatePicker date={endDate} setDate={setEndDate} />
                </div>
                <Button
                  onClick={handleUpdateFilter}
                  disabled={isLoadingChartData || !selectedCourseId}
                  className="cursor-pointer min-w-30"
                >
                  {isLoadingChartData ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Cập nhật"
                  )}
                </Button>
              </div>

              <div className="relative min-h-112.5 border rounded-xl p-2 bg-card ">
                {isLoadingChartData ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-card/50 z-10">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                    <p className="text-muted-foreground animate-pulse">
                      Đang truy xuất dữ liệu...
                    </p>
                  </div>
                ) : isAllZero ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                    <p className="text-sm">
                      Chưa có doanh thu trong khoảng thời gian này
                    </p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-foreground  flex items-center gap-2">
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
                          strokeOpacity={0.3}
                        />
                        <XAxis
                          dataKey="name"
                          axisLine={true}
                          tickLine={true}
                          tick={{ fontSize: 12, fill: "#64748b" }}
                          dy={10}
                        />
                        <YAxis
                          tickFormatter={formatYAxis}
                          domain={[0, domainMax]}
                          ticks={customTicks}
                          axisLine={true}
                          tickLine={true}
                          tick={{ fontSize: 12, fill: "#64748b" }}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(59, 130, 246, 0.05)" }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const item = payload[0].payload;
                              const gmv = item.gmv || 0;
                              const revenue = item.revenue || 0;
                              const platformProfit = gmv * 0.2;
                              return (
                                <div className="bg-white border border-border p-4 rounded-xl shadow-2xl min-w-64">
                                  <p className="text-sm font-bold mb-3 border-b border-slate-200 pb-2 text-black">
                                    {item.name} ({formatDateDisplay(item.date)})
                                  </p>
                                  <div className="flex flex-col gap-2.5">
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
                                        Giáo viên nhận:
                                      </span>
                                      <span className="font-bold text-black">
                                        {revenue.toLocaleString("vi-VN")} đ
                                      </span>
                                    </div>
                                    <div className="pt-2 border-t border-dashed border-slate-200 mt-1">
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-black font-medium">
                                          Lợi nhuận sàn:
                                        </span>
                                        <span className="font-bold text-black">
                                          {platformProfit.toLocaleString(
                                            "vi-VN"
                                          )}{" "}
                                          đ
                                        </span>
                                      </div>
                                    </div>
                                    <div className="pt-2 border-t border-slate-100 mt-1">
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="font-bold text-black">
                                          Học viên mới:
                                        </span>
                                        <span className="font-black text-blue-700">
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
