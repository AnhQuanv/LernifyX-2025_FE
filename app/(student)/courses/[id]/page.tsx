"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
  Star,
  Users,
  Clock,
  ArrowLeft,
  Heart,
  ShoppingCart,
  CheckCircle,
  PlayCircle,
  Award,
  BookOpen,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getDetailCourse } from "@/redux/thunk/courseThunk";
import { getCommentsByCourse } from "@/redux/thunk/commentThunk";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import DiscountCountdown from "@/components/ui/discountCountDown";

export default function CourseDetailPageWrapper({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = React.use(params);

  return <CourseDetailPage params={unwrappedParams} />;
}

function CourseDetailPage({ params }: { params: { id: string } }) {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCourse: course, status: courseStatus } = useSelector(
    (state: RootState) => state.course
  );
  const {
    comments,
    status: commentStatus,
    pagination,
  } = useSelector((state: RootState) => state.comment);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [showSpinner, setShowSpinner] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const cart = useSelector((state: RootState) => state.cart.items);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleToggleWishlist = () => {};

  const handleToggleCart = () => {};
  useEffect(() => {
    if (params.id) {
      dispatch(getDetailCourse(params.id));
    }
  }, [params.id, dispatch]);

  useEffect(() => {
    if (params.id) {
      dispatch(
        getCommentsByCourse({
          courseId: params.id,
          page: currentPage,
          limit: 6,
        })
      );
    }
  }, [params.id, dispatch, currentPage]);

  useEffect(() => {
    if (commentStatus === "loading") {
      setShowSpinner(true);
      const timer = setTimeout(() => setShowSpinner(false), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowSpinner(false);
    }
  }, [commentStatus]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    if (course) {
      const inWishlist = wishlist.some((item) => item.id === course.id);
      const inCart = cart.some((item) => item.id === course.id);
      setIsWishlisted(inWishlist);
      setIsInCart(inCart);
    }
  }, [wishlist, cart, course]);

  if (isLoading || courseStatus === "loading" || courseStatus === "idle") {
    return <LoadingSkeleton />;
  }
  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Course Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The course you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl hover:bg-violet-700 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-violet-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-violet-600 hover:text-violet-700 font-semibold transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Courses
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-violet-700 via-purple-600 to-indigo-700 text-white py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2">
              <div className="inline-block bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                {course.category}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 leading-tight">
                {course.title}
              </h1>
              <p className="text-xl text-violet-100 mb-6">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-300 fill-current" />
                  <span className="font-semibold">{course.rating} Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  <span className="font-semibold">
                    {course.students.toLocaleString()} Students
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">{course.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">{course.level}</span>
                </div>
              </div>

              <p className="text-violet-100 mt-6">
                <span className="font-semibold">Instructor:</span>{" "}
                {course.instructor}
              </p>
            </div>

            {/* Image Course */}
            <div className="space-y-6">
              {/* Course Image */}
              <div className="rounded-xl overflow-hidden shadow-xl -mx-8 -mt-8 mb-6 relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-violet-900/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Image
                  src={
                    "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg"
                  }
                  alt={course.title}
                  width={400} // width bắt buộc phải là number
                  height={250} // height bắt buộc phải là number
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {/* Left Column */}
            <div className="md:col-span-2 space-y-12">
              {/* What You'll Learn */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <BookOpen className="w-8 h-8 text-violet-600" />
                  What You&apos;ll Learn
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.learnings?.map((learning, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                      <span className="text-gray-700">{learning}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Course Sections */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <PlayCircle className="w-8 h-8 text-violet-600" />
                  Course Sections
                </h2>
                <div className="space-y-3">
                  {course.chapters?.map((section, index) => (
                    <div key={index}>
                      {/* Section Header - Clickable */}
                      <button
                        onClick={() => toggleSection(index)}
                        className="w-full border border-gray-200 rounded-xl p-4 hover:border-violet-300 hover:bg-violet-50 transition-all text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <ChevronDown
                              className={`w-5 h-5 text-violet-600 transition-transform duration-300 ${
                                expandedSections.includes(index)
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                            <h3 className="font-semibold text-gray-800">
                              {section.title}
                            </h3>
                          </div>
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap ml-4">
                            {section.lessons.length} lessons
                          </span>
                        </div>
                      </button>

                      {/* Lessons List - Expandable */}
                      {expandedSections.includes(index) && (
                        <div className="border border-t-0 border-gray-200 rounded-b-xl bg-gray-50 overflow-hidden">
                          <div className="space-y-2 p-4">
                            {section.lessons.map((lesson, lessonIndex) => (
                              <div
                                key={lesson.id}
                                className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-violet-50 transition-colors border border-gray-100"
                              >
                                <div className="flex items-center gap-3 flex-1">
                                  <span className="text-sm font-medium text-gray-500 w-6">
                                    {lessonIndex + 1}
                                  </span>
                                  <span className="text-gray-700">
                                    {lesson.title}
                                  </span>
                                </div>
                                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                                  {lesson.duration}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {/* Requirements */}
              {course.requirements && course.requirements.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Requirements
                  </h2>
                  <ul className="space-y-3">
                    {course.requirements.map((requirement, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-gray-700"
                      >
                        <div className="w-2 h-2 bg-violet-600 rounded-full mt-2 flex-shrink-0"></div>
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {/* Student Reviews */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <Star className="w-8 h-8 text-violet-600" />
                  Student Reviews
                </h2>
                <div className="space-y-6">
                  {showSpinner ? (
                    <div className="flex justify-center items-center py-12">
                      <LoadingSpinner />
                    </div>
                  ) : comments && comments.length > 0 ? (
                    comments.map((review) => (
                      <div
                        key={review.id}
                        className="border border-gray-200 rounded-xl p-6 hover:border-violet-300 transition-colors"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <Image
                            src="https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg"
                            alt={review.user.fullName}
                            width={100}
                            height={100}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-800">
                                {review.user.fullName}
                              </h3>
                              <span className="text-sm text-gray-500">
                                {review.createdAt.slice(0, 10)}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mb-3">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < review.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-gray-700">{review.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">
                      No reviews yet. Be the first to review this course!
                    </p>
                  )}
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
            </div>

            {/* Right Column - Sticky Info */}
            <div className="md:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Price Info */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-4">
                  {/* Pricing Section */}
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-3">
                          <span className="text-5xl font-extrabold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                            ${course.price}
                          </span>
                          {course.originalPrice && (
                            <div className="flex flex-col">
                              <span className="text-xl text-gray-400 line-through font-medium">
                                ${course.originalPrice}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Discount & Countdown Row */}
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

                  <div className="space-y-3">
                    <button className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer">
                      Enroll Now
                    </button>
                    <button
                      onClick={() => handleToggleCart()}
                      className={`w-full px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer ${
                        isInCart
                          ? "bg-green-500 text-white hover:bg-green-600"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {isInCart ? "In Cart" : "Add to Cart"}
                    </button>
                    <button
                      onClick={() => handleToggleWishlist()}
                      className={`w-full px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer ${
                        isWishlisted
                          ? "bg-red-500 text-white hover:bg-red-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isWishlisted ? "fill-current" : ""
                        }`}
                      />
                      {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                    </button>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <span className="text-gray-600">Level</span>
                    <span className="font-semibold text-gray-800">
                      {course.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-semibold text-gray-800">
                      {course.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <span className="text-gray-600">Students</span>
                    <span className="font-semibold text-gray-800">
                      {course.students.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-semibold text-gray-800">
                        {course.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Instructor Info */}
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border border-violet-200">
                  <h3 className="font-bold text-gray-800 mb-2">Instructor</h3>
                  <p className="text-gray-700 font-semibold">
                    {course.instructor}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Expert instructor with years of industry experience
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
