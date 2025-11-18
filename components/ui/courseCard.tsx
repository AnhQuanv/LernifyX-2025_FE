"use client";
import Image from "next/image";
import type React from "react";

import Link from "next/link";
import {
  Star,
  Users,
  Clock,
  PlayCircle,
  Heart,
  ShoppingCart,
} from "lucide-react";
import DiscountCountdown from "./discountCountDown";
import type { Course } from "@/types/course/course";

interface CourseCardProps {
  course: Course;
  onWishlistToggle: (course: Course) => void;
  onCartToggle: (course: Course) => void;
}

const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onWishlistToggle,
  onCartToggle,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 group border border-gray-100 hover:border-violet-200 transform hover:-translate-y-2">
      <Link href={`/courses/${course.id}`} className="block">
        {/* Image & Badge */}
        <div className="relative h-52 overflow-hidden bg-gray-200 cursor-pointer">
          <Image
            src={
              "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg"
            }
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

          {/* Wishlist Button */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 ">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onWishlistToggle(course);
              }}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer ${
                course.isInWishlist
                  ? "bg-red-500 text-white"
                  : "bg-white/95 backdrop-blur-sm text-gray-600 hover:bg-white"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${
                  course.isInWishlist ? "fill-current" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium">
              {course.category}
            </span>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-semibold text-gray-700">
                {course.rating}
              </span>
            </div>
          </div>

          <h3 className="font-bold text-gray-800 text-lg group-hover:text-violet-600 transition-colors duration-300 line-clamp-2 h-[52px]">
            {course.title}
          </h3>

          <p className="text-gray-600 font-medium">by {course.instructor}</p>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{course.students.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{course.duration}</span>
            </div>
          </div>

          <div className="h-[60px]">
            {course.discount != null && course.discountExpiresAt ? (
              <DiscountCountdown
                discount={course.discount}
                discountExpiresAt={course.discountExpiresAt}
              />
            ) : (
              <div className="h-full"></div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-violet-600">
                  ${course.price}
                </span>
                {course.originalPrice && (
                  <span className="text-gray-400 line-through">
                    ${course.originalPrice}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>

      <div className="px-6 pb-6 flex gap-2">
        <button className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2.5 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer">
          Enroll Now
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onCartToggle(course);
          }}
          className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-2 cursor-pointer ${
            course.isInCart
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
