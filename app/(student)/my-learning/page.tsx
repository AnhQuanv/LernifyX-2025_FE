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
  Award,
  ChevronLeft,
  ChevronRight,
  Loader,
  PlayCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { handleGetMyLearningCourses } from "@/services/courseService";
import { Course } from "@/types/course/course";
import { formatTimeRounded, getPaginationRange } from "@/lib/utils";
import toast from "react-hot-toast";

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

  const statusOptions = [
    { value: "all" as StatusFilter, label: "Tất cả khóa học", icon: BookOpen },
    {
      value: "in-progress" as StatusFilter,
      label: "Đang học",
      icon: PlayCircle,
    },
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
        const res = await handleGetMyLearningCourses({
          progressStatus: selectedStatus,
          page: currentPage,
          limit,
        });
        setCourses(res.data || []);
        setPagination(res.pagination);
      } catch {
        toast.error("Đã xảy ra lỗi khi tải khóa học của bạn.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedStatus, currentPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white text-gray-900 py-8 shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <h1 className="text-3xl font-bold">Khóa học của tôi</h1>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {statusOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => handleStatusChange(option.value)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 cursor-pointer ${
                    selectedStatus === option.value
                      ? "bg-violet-600 text-white shadow-md"
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
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24">
              <Loader className="w-12 h-12 animate-spin text-violet-600 mb-4" />
              <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-sm p-16 text-center border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Chưa có khóa học
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                {selectedStatus === "all"
                  ? "Bạn chưa sở hữu khóa học nào."
                  : `Bạn chưa có khóa học nào ở trạng thái này.`}
              </p>
              <button
                onClick={() => router.push("/courses")}
                className="bg-linear-to-r from-violet-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-all shadow-lg cursor-pointer"
              >
                Khám phá khóa học
              </button>
            </div>
          ) : (
            <div>
              {/* Courses Grid - Đồng bộ gap-8 và số cột để card không bị bè ra */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {courses.map((course: Course) => (
                  <div
                    key={course.id}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group border border-gray-100 hover:border-violet-200 transform hover:-translate-y-2 flex flex-col h-full"
                  >
                    <Link
                      href={`/courses/${course.id}`}
                      className="block flex-1"
                    >
                      {/* Course Image - Đồng bộ h-52 */}
                      <div className="relative h-52 overflow-hidden bg-gray-200">
                        <Image
                          src={course.image}
                          alt={course.title}
                          width={400}
                          height={250}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300"></div>
                        <PlayCircle className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 z-10" />

                        {/* Level Badge */}
                        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-violet-600 px-3 py-1 rounded-full text-sm font-semibold">
                          {course.level}
                        </div>

                        {/* Status Badge */}
                        {course.progress === 100 && (
                          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                            <Award className="w-4 h-4" />
                            Hoàn thành
                          </div>
                        )}
                      </div>

                      {/* Course Info - Đồng bộ p-6 và space-y-4 */}
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium">
                            {course.category}
                          </span>
                          {course.rating != null && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-semibold text-gray-700">
                                {course.rating} ({course.ratingCount})
                              </span>
                            </div>
                          )}
                        </div>

                        <h3 className="font-bold text-gray-800 text-lg group-hover:text-violet-600 transition-colors duration-300 line-clamp-2 h-13">
                          {course.title}
                        </h3>

                        <p className="text-gray-600 font-medium text-sm">
                          Giảng viên: {course.instructor}
                        </p>

                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>
                              {course.students?.toLocaleString()} học viên
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>
                              {formatTimeRounded(Number(course.duration))}
                            </span>
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs font-bold text-gray-700">
                              <span>Tiến độ học tập</span>
                              <span>{course.progress ?? 0}%</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-50">
                              <div
                                className="h-full bg-linear-to-r from-violet-500 to-purple-600 transition-all duration-500"
                                style={{ width: `${course.progress ?? 0}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
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
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex gap-1">
                    {getPaginationRange(
                      pagination.page,
                      pagination.totalPages
                    ).map((page, index) => {
                      if (page === "...") {
                        return (
                          <span
                            key={`dots-${index}`}
                            className="w-10 h-10 flex items-center justify-center text-gray-400"
                          >
                            ...
                          </span>
                        );
                      }

                      return (
                        <button
                          key={index}
                          onClick={() => setCurrentPage(Number(page))}
                          className={`w-10 h-10 rounded-lg font-semibold transition-all cursor-pointer 
                              ${
                                pagination.page === page
                                  ? "bg-violet-600 text-white shadow-lg"
                                  : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                              }`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() =>
                      setCurrentPage(
                        Math.min(pagination.totalPages, pagination.page + 1)
                      )
                    }
                    disabled={currentPage === pagination.totalPages}
                    className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-white hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
