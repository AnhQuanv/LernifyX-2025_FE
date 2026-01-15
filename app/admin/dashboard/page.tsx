"use client";

import { StatCard } from "@/components/teacher/stat-card";
import { useState, useEffect, useCallback } from "react";
import { TopCoursesChart } from "@/components/admin/top-course-chart";
import { TopCategoriesChart } from "@/components/admin/top-category-chart";
import {
  handleGetMainStatsDashboard,
  handleGetTop10CategoriesRevenue,
  handleGetTop10CoursesRevenue,
} from "@/services/paymentService";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("all");
  const [customDate, setCustomDate] = useState({ start: "", end: "" });

  const [mainStats, setMainStats] = useState({
    courses: 0,
    newStudents: 0,
    gmv: 0,
    net: 0,
    label: "all",
  });
  const [topCourses, setTopCourses] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    if (timeRange === "custom" && (!customDate.start || !customDate.end)) {
      toast.error("Vui lòng chọn đầy đủ ngày bắt đầu và ngày kết thúc!", {
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const [stats, courses, categories] = await Promise.all([
        handleGetMainStatsDashboard(
          timeRange,
          customDate.start,
          customDate.end
        ),
        handleGetTop10CoursesRevenue(
          timeRange,
          customDate.start,
          customDate.end
        ),
        handleGetTop10CategoriesRevenue(
          timeRange,
          customDate.start,
          customDate.end
        ),
      ]);

      setMainStats(stats);
      setTopCourses(courses);
      setTopCategories(categories);
    } catch {
      toast.error("Cập nhật dữ liệu thất bại. Vui lòng kiểm tra kết nối!", {
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  }, [timeRange, customDate]);

  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRangeChange = (val: string) => {
    setTimeRange(val);
    if (val !== "custom") {
      setCustomDate({ start: "", end: "" });
    }
  };

  const formatCurrency = (val: number) =>
    val.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <main className="flex-1 overflow-auto bg-background">
      <div className="p-8 space-y-8 max-w-400 mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Theo dõi hiệu suất và doanh thu
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-xl border shadow-sm">
            <span className="text-xs font-semibold text-muted-foreground px-2 uppercase tracking-wider">
              Bộ lọc:
            </span>

            <select
              value={timeRange}
              onChange={(e) => handleRangeChange(e.target.value)}
              className="bg-secondary/50 border-none h-9 px-4 rounded-lg text-sm font-bold focus:ring-2 focus:ring-primary outline-none cursor-pointer hover:bg-secondary transition-all"
            >
              <option value="today">Hôm nay</option>
              <option value="7d">7 ngày qua</option>
              <option value="30d">30 ngày qua</option>
              <option value="this_month">Tháng này</option>
              <option value="year">Năm nay</option>
              <option value="all">Tất cả thời gian</option>
              <option value="custom">Tùy chỉnh ngày</option>
            </select>

            <div className="flex items-center gap-2 px-2 border-l ml-2">
              <input
                type="date"
                disabled={timeRange !== "custom"}
                className={`text-xs font-medium border rounded px-2 py-1 outline-none transition-all 
                  ${
                    timeRange === "custom"
                      ? "border-primary bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-400"
                  }`}
                value={customDate.start}
                onChange={(e) =>
                  setCustomDate({ ...customDate, start: e.target.value })
                }
              />
              <span className="text-gray-300">-</span>
              <input
                type="date"
                disabled={timeRange !== "custom"}
                className={`text-xs font-medium border rounded px-2 py-1 outline-none transition-all 
                  ${
                    timeRange === "custom"
                      ? "border-primary bg-white"
                      : "border-gray-200 bg-gray-50 text-gray-400"
                  }`}
                value={customDate.end}
                onChange={(e) =>
                  setCustomDate({ ...customDate, end: e.target.value })
                }
              />
            </div>

            <button
              onClick={fetchAllData}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-95 min-w-30 cursor-pointer"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>Cập nhật</span>
            </button>
          </div>
        </div>

        {/* STAT CARDS */}
        <div
          className={`grid grid-cols-1 md:grid-cols-4 gap-6 transition-opacity ${
            loading ? "opacity-50" : "opacity-100"
          }`}
        >
          <StatCard title="Tổng Khóa Học" value={mainStats.courses} />
          <StatCard
            title="Học Viên Mới"
            value={mainStats.newStudents.toLocaleString()}
          />
          <StatCard
            title="Tổng Doanh Thu"
            value={formatCurrency(mainStats.gmv)}
          />
          <StatCard
            title="Lợi Nhuận Thực"
            value={formatCurrency(mainStats.net)}
          />
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TopCoursesChart data={topCourses} />
          <TopCategoriesChart data={topCategories} />
        </div>
      </div>
    </main>
  );
}
