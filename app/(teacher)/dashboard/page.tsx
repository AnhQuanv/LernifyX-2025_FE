"use client";

import { RevenueChart } from "@/components/teacher/revenue-chart";
import { CoursePerformance } from "@/components/teacher/course-performance";
import { StatCard } from "@/components/teacher/stat-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RootState } from "@/redux/store";
import Link from "next/link";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { handleGetTeacherCoursesRevenue } from "@/services/courseService";
import { handelGetTeacherPayments } from "@/services/paymentService";
import { Loader } from "lucide-react";

export interface RevenueDataItem {
  name: string;
  revenue: number;
}
export interface CourseRevenueDetail {
  id: string;
  name: string;
  value: number;
  netRevenue: number;
}

export default function TeacherDashboard() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [revenueData, setRevenueData] = useState<RevenueDataItem[]>([]);
  const [courseData, setCourseData] = useState<CourseRevenueDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCourse, setTotalCourse] = useState<number>(0);
  const [student, setStudent] = useState<number>(0);
  const [totalRevenue, setTotalRevenue] = useState<number>(0);
  const [revenue, setRevenue] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await handleGetTeacherCoursesRevenue();
        let revenueDetails: RevenueDataItem[] = [];
        const totalPublishedCourses = res.totalPublishedCourses || 0;
        let hasRevenueData = false;

        if (totalPublishedCourses > 0) {
          const revenueResponse = await handelGetTeacherPayments();
          revenueDetails = revenueResponse;
          hasRevenueData = true;
        }

        setRevenueData(revenueDetails);
        setCourseData(res.courseRevenueDetails);
        setTotalCourse(totalPublishedCourses);
        setStudent(res.totalStudents);
        setTotalRevenue(res.totalNetRevenue);
        setRevenue(hasRevenueData);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu dashboard:", error);
        setRevenue(false);
      } finally {
        setIsLoading(false);
      }
    };

    if (!user?.isNewTeacher) {
      fetchData();
    } else {
      setIsLoading(false);
    }
  }, [user?.isNewTeacher]);

  if (isLoading) {
    return (
      <>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Loader className="w-12 h-12  animate-spin mx-auto mb-4" />
            <p className="text-black-600">Đang tải dữ liệu...</p>
          </div>
        </div>
        ;
      </>
    );
  }

  if (user?.isNewTeacher || !revenue) {
    return (
      <main className="flex-1 overflow-auto bg-background">
        <div className="p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>

            <p className="text-muted-foreground mt-2">
              Xin chào lại! Bắt đầu tạo khóa học đầu tiên của bạn
            </p>
          </div>

          <Card className="border-2 border-dashed">
            <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="space-y-2 max-w-md">
                <h2 className="text-2xl font-bold text-foreground">
                  Bạn chưa có khóa học nào
                </h2>

                <p className="text-muted-foreground">
                  Tạo khóa học đầu tiên của bạn ngay bây giờ và bắt đầu giảng
                  dạy hàng ngàn học sinh trên toàn thế giới
                </p>
              </div>

              <Link href="/course/create">
                <Button size="lg" className="gap-2 cursor-pointer">
                  Tạo Khóa Học Đầu Tiên
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Getting Started Steps */}

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Các bước để bắt đầu
              </h3>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-bold">
                      1
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">
                      Tạo khóa học
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Đặt tên, mô tả và giá cả cho khóa học của bạn
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-bold">
                      2
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">
                      Thêm chương và bài học
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Tổ chức nội dung thành các chương có ý nghĩa
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-bold">
                      3
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">
                      Upload video
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Thêm video giảng dạy
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-bold">
                      4
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold text-foreground">
                      Gửi để duyệt
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Chúng tôi sẽ xem xét và xuất bản khóa học của bạn
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-auto ">
      <div className="p-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>

          <p className="text-muted-foreground mt-2">
            Xin chào lại! Đây là tổng quan của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Tổng Khóa Học" value={totalCourse} />

          <StatCard title="Học Sinh" value={student} />

          <StatCard
            title="Tổng Doanh Thu"
            value={totalRevenue.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-background">
          <RevenueChart data={revenueData} />

          <CoursePerformance data={courseData} />
        </div>
      </div>
    </main>
  );
}
