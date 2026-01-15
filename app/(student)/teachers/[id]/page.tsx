"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import CourseCard from "@/components/ui/courseCard";
import { useWishlistCart } from "@/hooks/commonHooks";
import { handleGetTeacherDetail } from "@/services/courseService";
import { ChevronRight, Loader } from "lucide-react";
import { Course } from "@/types/course/course";
import { UserAvatar } from "@/components/ui/avatar-cop";
import toast from "react-hot-toast";

interface TeacherDetail {
  id: string;
  name: string;
  bio: string;
  description: string;
  students: number;
  courses: number;
  email: string;
  courses_list: Course[];
  image: string;
}

export default function TeacherDetailPage() {
  const params = useParams<{ id: string }>();
  const teacherId = params.id;

  const [teacher, setTeacher] = useState<TeacherDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [currentSlide, setCurrentSlide] = useState(0);
  const coursesPerPage = 4;

  const { handleWishlistToggle, handleCartToggle } = useWishlistCart();

  const fecthData = useCallback(async (id: string) => {
    if (!id) return;

    setIsLoading(true);
    try {
      const res = await handleGetTeacherDetail(id);

      setTeacher(res);
    } catch {
      toast.error("Lỗi khi tải chi tiết giảng viên. Vui lòng thử lại!");
      setTeacher(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (teacherId) {
      fecthData(teacherId);
    }
  }, [teacherId, fecthData]);

  const allCourses: Course[] = teacher?.courses_list || [];
  const totalSlides = Math.ceil(allCourses.length / coursesPerPage);

  const nextSlide = () => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  };
  const handleCartToggleWithLocalUpdate = async (course: Course) => {
    await handleCartToggle(course);
    setTeacher((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        courses_list: prev.courses_list.map((c) =>
          c.id === course.id ? { ...c, isInCart: !c.isInCart } : c
        ),
      };
    });
  };

  const handleWishlistToggleWithLocalUpdate = async (course: Course) => {
    await handleWishlistToggle(course);

    setTeacher((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        courses_list: prev.courses_list.map((c) =>
          c.id === course.id ? { ...c, isInWishlist: !c.isInWishlist } : c
        ),
      };
    });
  };

  if (isLoading && !teacher) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4" />
          <p className="text-black-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            Không tìm thấy giảng viên
          </h1>
          <Link
            href="/teachers"
            className="text-violet-600 hover:text-violet-700 font-semibold"
          >
            ← Quay lại danh sách giảng viên
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-10">
      <div className="container mx-auto px-4 md:px-6 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="md:flex">
            <div className="md:w-1/3 bg-linear-to-br from-violet-700 to-purple-600 p-8 flex flex-col items-center justify-center">
              <UserAvatar
                fullName={teacher.name || "User"}
                avatarUrl={teacher.image}
                size={128}
              />
              <h1 className="text-3xl font-bold text-white text-center mb-2">
                {teacher.name}
              </h1>
              <p className="text-violet-100 text-center mb-6">
                {teacher.bio && teacher.bio.trim() !== ""
                  ? teacher.bio
                  : "Tiểu sử đang được cập nhật."}
              </p>
            </div>

            <div className="md:w-2/3 p-8">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-linear-to-br from-violet-50 to-purple-50 p-4 rounded-xl border border-violet-100">
                  <div className="flex items-center gap-2 text-violet-600 mb-2">
                    <span className="text-sm font-medium">Học viên</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {teacher.students.toLocaleString()}
                  </p>
                </div>

                <div className="bg-linear-to-br from-indigo-50 to-blue-50 p-4 rounded-xl border border-indigo-100">
                  <div className="flex items-center gap-2 text-indigo-600 mb-2">
                    <span className="text-sm font-medium">
                      Khóa học của giảng viên
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-800">
                    {teacher.courses}
                  </p>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  Giới thiệu
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {teacher.description && teacher.description.trim() !== ""
                    ? teacher.description
                    : "Thông tin giới thiệu đang được cập nhật."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            Khóa học của giảng viên
          </h2>

          {allCourses.length > 0 ? (
            <div className="relative">
              <button
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="absolute -left-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all duration-300 shadow-xl z-10 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-6 h-6 rotate-180 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={nextSlide}
                disabled={currentSlide === totalSlides - 1 || totalSlides === 0}
                className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-violet-600 hover:text-white hover:border-violet-600 transition-all duration-300 shadow-xl z-10 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <ChevronRight className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>

              <div className="overflow-hidden rounded-2xl">
                <div
                  className="flex transition-transform duration-700 ease-out"
                  style={{
                    width: `${totalSlides * 100}%`,
                    transform: `translateX(-${
                      currentSlide * (100 / totalSlides)
                    }%)`,
                  }}
                >
                  {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                    <div
                      key={slideIndex}
                      className="shrink-0"
                      style={{ width: `${100 / totalSlides}%` }}
                    >
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 p-1">
                        {" "}
                        {allCourses
                          .slice(
                            slideIndex * coursesPerPage,
                            (slideIndex + 1) * coursesPerPage
                          )
                          .map((course) => (
                            <CourseCard
                              key={course.id}
                              course={course}
                              onWishlistToggle={
                                handleWishlistToggleWithLocalUpdate
                              }
                              onCartToggle={handleCartToggleWithLocalUpdate}
                            />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <p className="text-lg text-gray-500">
                Giảng viên này chưa có khóa học nào được xuất bản.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
