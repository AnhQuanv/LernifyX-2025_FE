"use client";

import Image from "next/image";
import { Clock, Users, Star } from "lucide-react";
import { Course } from "@/types/course/course";
import { formatTimeRounded } from "@/lib/utils";

interface CourseProgressCardProps {
  course: Course;
  role: string;
}

export const CourseProgressCard = ({
  course,
  role,
}: CourseProgressCardProps) => {
  return (
    <div className="group relative flex flex-col sm:flex-row gap-5 p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all duration-300">
      <div className="relative shrink-0 w-full sm:w-40 h-28 rounded-lg overflow-hidden bg-gray-100 shadow-sm">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="w-full mb-2">
          <h3 className="font-bold text-gray-900 text-lg leading-tight ">
            {course.title}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-3">
          <p className="text-xs text-gray-500">
            Bởi:{" "}
            <span className="font-medium text-gray-700">
              {course.instructor}
            </span>
          </p>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1  px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border ">
              {course.level}
            </span>
            <span className="bg-violet-100  px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase">
              {course.category}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
          {course.students != null && (
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gray-400" />
              <span>{course.students.toLocaleString()}</span>
            </div>
          )}
          {course.rating != null && (
            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 text-gray-400" />
              <span>
                {course.rating} ({course.ratingCount})
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-gray-400" />
            <span>{formatTimeRounded(Number(course.duration))}</span>
          </div>
        </div>

        <div className="mt-auto">
          {role === "teacher" ? (
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Tổng doanh thu
                </span>
                <div className="flex items-center gap-1  font-bold">
                  <span>{course.revenue?.toLocaleString()}đ</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase">
                  Thực nhận (Sau 10% phí)
                </span>
                <div className="flex items-center gap-1  font-bold">
                  <span>{course.netRevenue?.toLocaleString()}đ</span>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Tiến độ học tập
                </span>
                <span className="text-xs font-bold text-violet-600">
                  {course.progress ?? 0}%
                </span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-violet-600 to-purple-500 rounded-full transition-all duration-700"
                  style={{ width: `${course.progress ?? 0}%` }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
