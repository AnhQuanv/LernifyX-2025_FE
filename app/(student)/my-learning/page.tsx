"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  ArrowLeft,
  Star,
  Users,
  Clock,
  Play,
  Award,
  ChevronLeft,
  ChevronRight,
  Loader,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { handleGetMyLearningCourses } from "@/services/courseService";
import { Course } from "@/types/course/course";
import { formatTimeRounded } from "@/lib/utils";

type StatusFilter = "all" | "in-progress" | "completed" | "not-started";

export default function MyLearningPage() {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;

  const [courses, setCourses] = useState<Course[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statusOptions = [
    { value: "all" as StatusFilter, label: "Tất cả khóa học", icon: BookOpen },
    { value: "in-progress" as StatusFilter, label: "Đang học", icon: Play },
    { value: "completed" as StatusFilter, label: "Hoàn thành", icon: Award },
    {
      value: "not-started" as StatusFilter,
      label: "Chưa bắt đầu",
      icon: BookOpen,
    },
  ];

  const handleStatusChange = (status: StatusFilter) => {
    setSelectedStatus(status);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await handleGetMyLearningCourses({
          progressStatus: selectedStatus,
          page: currentPage,
          limit,
        });

        setCourses(res.data || []);
        setPagination(res.pagination);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.log(err);
        setError(err?.message || "Đã xảy ra lỗi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedStatus, currentPage]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white text-gray-900 py-8 shadow-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Khóa học của tôi</h1>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {statusOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                    selectedStatus === option.value
                      ? "bg-violet-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        {isLoading ? (
          // Loading State
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader className="w-12 h-12  animate-spin mx-auto mb-4" />
              <p className="text-black-600">Đang tải dữ liệu...</p>
            </div>
          </div>
        ) : error ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-red-50 rounded-2xl shadow-lg p-12 text-center border border-red-200">
              <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-red-800 mb-3">
                Đã xảy ra lỗi
              </h2>
              <p className="text-red-600 mb-8 text-lg">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg"
              >
                Thử lại
              </button>
            </div>
          </div>
        ) : courses.length === 0 ? (
          // Empty State
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="w-20 h-20 bg-linear-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-violet-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Chưa có khóa học
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                {selectedStatus === "all"
                  ? "Bạn chưa mua khóa học nào."
                  : `Bạn chưa có khóa học "${selectedStatus.replace(
                      "-",
                      " "
                    )}".`}
              </p>
              <button
                onClick={() => router.push("/homepage")}
                className="bg-linear-to-r from-violet-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                Xem khóa học
              </button>
            </div>
          </div>
        ) : (
          // Courses Grid
          <div>
            <div className="mb-8 flex justify-between items-center">
              <p className="text-gray-600 text-lg">
                Hiển thị {courses.length} khóa học
              </p>
              <p className="text-gray-600 text-sm">
                Trang {pagination.page} / {pagination.totalPages}
              </p>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {courses.map((course: Course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group border border-gray-100 hover:border-violet-200 transform hover:-translate-y-2"
                >
                  <Link
                    href={`/courses/${course.id}`}
                    className="block relative"
                  >
                    {/* Course Image */}
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      <Image
                        src={
                          course.image ||
                          "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg"
                        }
                        alt={course.title}
                        width={400}
                        height={250}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>

                      {/* Level Badge */}
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-violet-600 px-3 py-1 rounded-full text-sm font-semibold">
                        {course.level}
                      </div>

                      {/* Status Badge */}
                      {course.progress === 100 && (
                        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          Hoàn thành
                        </div>
                      )}
                    </div>

                    {/* Course Info */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium">
                          {course.category}
                        </span>
                        {course.rating != null &&
                          course.ratingCount != null && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-semibold text-gray-700">
                                {course.rating}({course.ratingCount} đánh giá)
                              </span>
                            </div>
                          )}
                      </div>

                      <h3 className="font-bold text-gray-800 text-lg group-hover:text-violet-600 transition-colors line-clamp-2 mb-2 h-[52px]">
                        {course.title}
                      </h3>

                      <p className="text-gray-600 font-medium text-sm mb-4">
                        Giảng viên {course.instructor}
                      </p>

                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4 pb-4 border-b border-gray-100">
                        {course.students != null && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{course.students.toLocaleString()}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {formatTimeRounded(Number(course.duration))}
                          </span>
                        </div>
                      </div>

                      {/* Progress Info */}
                      {(course.progress ?? 0) > 0 && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs font-medium text-gray-700">
                            <span>Tiến độ</span>
                            <span>{course.progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-linear-to-r from-blue-600 to-purple-600"
                              style={{ width: `${course.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() =>
                    setCurrentPage(Math.max(1, pagination.page - 1))
                  }
                  disabled={pagination.page === 1}
                  className="p-2 rounded-lg border border-gray-300 text-gray-600 
                             hover:bg-gray-100 hover:scale-105 hover:shadow-md 
                             cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed 
                             transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-1">
                  {Array.from(
                    { length: pagination.totalPages },
                    (_, i) => i + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg font-semibold transition-all cursor-pointer 
                                 ${
                                   currentPage === page
                                     ? "bg-violet-600 text-white shadow-lg hover:scale-105 hover:shadow-xl"
                                     : "border border-gray-300 text-gray-600 hover:bg-gray-100 hover:scale-105 hover:shadow-md"
                                 }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage(
                      Math.min(pagination.totalPages, pagination.page + 1)
                    )
                  }
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 rounded-lg border border-gray-300 text-gray-600 
                             hover:bg-gray-100 hover:scale-105 hover:shadow-md 
                             cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed 
                             transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
