"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

import { RevenueChart } from "@/components/teacher/revenue-chart";
import { CoursePerformance } from "@/components/teacher/course-performance";
import { StatCard } from "@/components/teacher/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { handleGetTeacherCoursesRevenue } from "@/services/courseService";
import {
  handelGetTeacherPayments,
  handleGetMainStatsDashboardTeacher,
} from "@/services/paymentService";

export interface RevenueDataItem {
  name: string;
  revenue: number;
  gmv: number;
}

export interface CourseRevenueDetail {
  id: string;
  name: string;
  value: number;
  netRevenue: number;
}

export default function TeacherDashboard() {
  const [revenueData, setRevenueData] = useState<RevenueDataItem[]>([]);
  const [courseData, setCourseData] = useState<CourseRevenueDetail[]>([]);
  const [mainStats, setMainStats] = useState({
    courses: 0,
    students: 0,
    gmv: 0,
    net: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString()
  );
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fetchRevenueByYear = async (year: string) => {
    try {
      setIsChartLoading(true);
      const data = await handelGetTeacherPayments(year);
      setRevenueData(data || []);
    } catch (error) {
      console.error("Error fetching revenue:", error);
      toast.error(`Không thể tải dữ liệu năm ${year}`);
    } finally {
      setIsChartLoading(false);
    }
  };

  useEffect(() => {
    if (!isMounted) return;

    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const [stats, coursesRes] = await Promise.all([
          handleGetMainStatsDashboardTeacher(),
          handleGetTeacherCoursesRevenue(),
        ]);

        setMainStats(stats);
        setCourseData(coursesRes.courseRevenueDetails || []);

        if (stats.courses > 0) {
          await fetchRevenueByYear(selectedYear);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
        toast.error("Lỗi khi tải dữ liệu tổng quan.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [isMounted, selectedYear]);

  if (!isMounted) return null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-black-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // Trạng thái khi giáo viên chưa có khóa học nào
  if (mainStats.courses === 0) {
    return (
      <main className="flex-1 p-8 space-y-8 bg-background">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Card className="border-2 border-dashed">
          <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="space-y-2 max-w-md">
              <h2 className="text-2xl font-bold">Chào mừng giảng viên mới!</h2>
              <p className="text-muted-foreground">
                Bạn chưa có khóa học nào. Hãy bắt đầu hành trình chia sẻ kiến
                thức ngay hôm nay.
              </p>
            </div>
            <Link href="/course/create">
              <Button size="lg" className="gap-2 font-semibold">
                Tạo Khóa Học Đầu Tiên
              </Button>
            </Link>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-auto bg-background/50">
      <div className="p-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Theo dõi hiệu suất và doanh thu của bạn
            </p>
          </div>

          <div className="flex items-center gap-3 bg-card p-2 rounded-xl border shadow-sm">
            <span className="text-sm font-semibold px-2">Năm báo cáo:</span>
            <Select
              value={selectedYear}
              onValueChange={(value) => setSelectedYear(value)}
              disabled={isChartLoading}
            >
              <SelectTrigger className="w-30 focus:ring-primary">
                <SelectValue placeholder="Chọn năm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2025">2025</SelectItem>
                <SelectItem value="2026">2026</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Tổng Khóa Học" value={mainStats.courses} />
          <StatCard title="Tổng Học Sinh" value={mainStats.students} />
          <StatCard
            title="Tổng Doanh Thu (GMV)"
            value={mainStats.gmv.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          />
          <StatCard
            title="Lợi Nhuận Thực"
            value={mainStats.net.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="relative min-h-100">
            <RevenueChart data={revenueData} isLoading={isChartLoading} />
          </div>

          <div className="bg-card rounded-lg border shadow-sm">
            <CoursePerformance data={courseData} />
          </div>
        </div>
      </div>
    </main>
  );
}
