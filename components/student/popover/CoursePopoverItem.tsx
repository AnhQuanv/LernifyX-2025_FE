"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Course } from "@/types/course/course";

interface CoursePopoverItemProps {
  course: Course;
  isLast: boolean;
  onRemove: (id: string) => void;
}

export const CoursePopoverItem = ({
  course,
  isLast,
  onRemove,
}: CoursePopoverItemProps) => {
  const hasDiscount =
    course.discountExpiresAt &&
    course.originalPrice &&
    new Date(course.discountExpiresAt).getTime() > Date.now();

  return (
    <div className="px-4 py-3 relative hover:bg-gray-50 transition-colors group">
      {/* Divider */}
      {!isLast && (
        <div className="absolute left-4 right-4 bottom-0 h-px bg-gray-200" />
      )}

      <div className="flex gap-3 items-start">
        {/* Image Container */}
        <div className="w-14 h-14 shrink-0 rounded-md overflow-hidden bg-gray-100 border border-gray-100">
          <Image
            src={course.image}
            alt={course.title}
            width={56}
            height={56}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug group-hover:text-violet-700 transition-colors">
            {course.title}
          </h4>

          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {course.instructor}
          </p>

          <div className="flex items-baseline gap-1 mt-1">
            {hasDiscount ? (
              <>
                <span className="text-base font-bold text-gray-900">
                  {(course.price ?? 0).toLocaleString()}₫
                </span>
                <span className="text-xs text-gray-400  line-through ">
                  {course.originalPrice.toLocaleString()}₫
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-gray-900">
                {(course.originalPrice ?? 0).toLocaleString()}₫
              </span>
            )}
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={() => onRemove(course.id)}
          className="bg-red-50 text-red-600 hover:bg-red-100 transition-colors shrink-0 pt-0.5 cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
