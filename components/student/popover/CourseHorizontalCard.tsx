"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Users, Clock, Trash2, ShoppingCart } from "lucide-react";
import { formatTimeRounded } from "@/lib/utils"; // Giả định helper của bạn
import { Course } from "@/types/course/course";
import DiscountCountdown from "@/components/ui/discountCountDown";

interface CourseHorizontalCardProps {
  course: Course;
  onAction: (course: Course) => void;
  isInCart?: (courseId: string) => boolean;
  handleCartToggle?: (course: Course) => void;
  type: "cart" | "wishlist";
}

export const CourseHorizontalCard = ({
  course,
  onAction,
  isInCart,
  handleCartToggle,
  type,
}: CourseHorizontalCardProps) => {
  const isDiscountActive =
    course.discount != null &&
    course.discountExpiresAt &&
    new Date(course.discountExpiresAt).getTime() > Date.now();

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group">
      <div className="flex flex-col sm:flex-row gap-6 p-6">
        {/* Thumbnail Section */}
        <Link href={`/courses/${course.id}`} className="shrink-0">
          <div className="relative w-full sm:w-40 h-40 rounded-xl overflow-hidden bg-gray-200 group-hover:shadow-lg transition-all duration-300">
            <Image
              src={course.image}
              alt={course.title}
              fill
              sizes="(max-width: 640px) 100vw, 160px"
              priority
              className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-violet-600 px-3 py-1 rounded-full text-xs font-semibold">
              {course.level}
            </div>
          </div>
        </Link>

        {/* Course Info Section */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <Link href={`/courses/${course.id}`}>
                  <h3 className="text-lg font-bold text-gray-800 hover:text-violet-600 transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-600 mt-1">
                  bởi {course.instructor}
                </p>
              </div>

              {course.rating != null && (
                <div className="flex items-center gap-1 ml-4 shrink-0">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-semibold text-gray-700">
                    {course.rating} ({course.ratingCount})
                  </span>
                </div>
              )}
            </div>

            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
              {course.students != null && (
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{course.students.toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatTimeRounded(Number(course.duration))}</span>
              </div>
              <span className="bg-violet-100 text-violet-700 px-2 py-1 rounded-full text-xs font-medium">
                {course.category}
              </span>
            </div>
          </div>

          {/* Discount Countdown Placeholder */}
          <div className="h-5">
            {isDiscountActive && (
              <DiscountCountdown
                discount={course.discount!}
                discountExpiresAt={course.discountExpiresAt!}
              />
            )}
          </div>

          {/* Price and Actions Section */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center gap-3">
              {isDiscountActive ? (
                <>
                  <span className="text-2xl font-bold text-violet-600">
                    {(course.price ?? 0).toLocaleString()}₫
                  </span>
                  <span className="text-gray-400 line-through">
                    {(course.originalPrice ?? 0).toLocaleString()}₫
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-violet-600">
                  {(course.originalPrice ?? 0).toLocaleString()}₫
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {type === "wishlist" && (
                <button
                  onClick={() => handleCartToggle?.(course)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300 cursor-pointer ${
                    isInCart?.(course.id)
                      ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
                      : "bg-linear-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700"
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">
                    {isInCart?.(course.id) ? "Đã thêm vào giỏ" : "Thêm vào giỏ"}
                  </span>
                </button>
              )}

              <button
                onClick={() => onAction(course)}
                className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer shadow-sm"
                title={
                  type === "cart" ? "Xóa khỏi giỏ hàng" : "Xóa khỏi yêu thích"
                }
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
