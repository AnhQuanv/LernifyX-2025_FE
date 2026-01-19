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
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Video,
} from "lucide-react";
import Image from "next/image";
import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { getDetailCourse } from "@/redux/thunk/courseThunk";
import { getCommentsByCourse } from "@/redux/thunk/commentThunk";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import DiscountCountdown from "@/components/ui/discountCountDown";
import { useStartLesson } from "@/hooks/useStartLesson";
import { useParams, useRouter } from "next/navigation";
import {
  formatDurationVi,
  formatTimeRounded,
  getPaginationRange,
} from "@/lib/utils";
import { UserAvatar } from "@/components/ui/avatar-cop";
import { useWishlistCart } from "@/hooks/commonHooks";
import { handlePostComment } from "@/services/commentService";
import { Badge } from "@/components/ui/badge";

export default function LessonPage() {
  const params = useParams<{ id: string }>();
  const courseId = params.id;
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { selectedCourse: course, status: courseStatus } = useSelector(
    (state: RootState) => state.course,
  );
  const { comments, pagination } = useSelector(
    (state: RootState) => state.comment,
  );
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedSections, setExpandedSections] = useState<number[]>([]);
  const [reviewContent, setReviewContent] = useState("");
  const [hasReviewed, setHasReviewed] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const cart = useSelector((state: RootState) => state.cart.items);
  const { startLesson, goToLesson } = useStartLesson(course);

  const toggleSection = (index: number) => {
    setExpandedSections((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };
  const isLessonLocked = (chapterIndex: number, lessonIndex: number) => {
    if (!course) return true;

    const chapters = course.chapters;

    if (chapterIndex === 0 && lessonIndex === 0) {
      return false;
    }

    let prevChapterIndex = chapterIndex;
    let prevLessonIndex = lessonIndex - 1;

    if (lessonIndex === 0) {
      prevChapterIndex = chapterIndex - 1;
      const prevChapter = chapters[prevChapterIndex];
      if (!prevChapter) return true;

      prevLessonIndex = prevChapter.lessons.length - 1;
    }

    const prevLesson = chapters[prevChapterIndex]?.lessons[prevLessonIndex];

    const prevCompleted = prevLesson?.progress?.completed === true;

    return !prevCompleted;
  };

  const getCourseProgress = () => {
    let totalLessons = 0;
    let completedLessons = 0;
    if (!course) return true;
    course.chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        totalLessons++;
        if (lesson.progress?.completed) completedLessons++;
      });
    });

    return Math.round((completedLessons / totalLessons) * 100);
  };

  const { handleWishlistToggle, handleCartToggle } = useWishlistCart();

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewContent.trim()) {
      await handlePostComment({
        content: reviewContent,
        type: "course",
        targetId: courseId,
        rating: reviewRating,
      });
      setHasReviewed(true);
      setReviewContent("");
      setReviewRating(5);
      await dispatch(getCommentsByCourse({ courseId, page: 1, limit: 6 }));
      setCurrentPage(1);
    }
  };
  useEffect(() => {
    if (courseId) {
      dispatch(getDetailCourse(courseId));
    }
  }, [courseId, dispatch]);

  useEffect(() => {
    if (courseId) {
      dispatch(
        getCommentsByCourse({
          courseId: courseId,
          page: currentPage,
          limit: 6,
        }),
      );
    }
  }, [courseId, dispatch, currentPage]);

  useEffect(() => {
    if (course) {
      const inWishlist = wishlist.some((item) => item.id === course.id);
      const inCart = cart.some((item) => item.id === course.id);
      setIsWishlisted(inWishlist);
      setIsInCart(inCart);
    }
  }, [wishlist, cart, course]);

  if (courseStatus === "loading" || courseStatus === "idle") {
    return <LoadingSkeleton />;
  }
  if (!course) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-violet-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Không tìm thấy khóa học
          </h1>
          <p className="text-gray-600 mb-8">
            Khóa học bạn đang tìm kiếm không tồn tại.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 bg-violet-600 text-white px-6 py-3 rounded-xl hover:bg-violet-700 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Quay lại danh sách khóa học
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-violet-50">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-violet-950 via-purple-900 to-indigo-950 text-white py-16">
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
                  <span className="font-semibold">
                    {course.rating} Đánh giá
                  </span>
                </div>
                {course.students != null && (
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold">
                      {course.students.toLocaleString()} Học viên
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  <span className="font-semibold">
                    {formatTimeRounded(Number(course.duration))}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <span className="font-semibold">{course.level}</span>
                </div>
              </div>

              <p className="text-violet-100 mt-6">
                <span className="font-semibold">Giảng viên:</span>{" "}
                {course.instructor}
              </p>
            </div>

            {/* Image Course */}
            <div className="space-y-6">
              {/* Course Image */}
              <div className="rounded-xl overflow-hidden shadow-xl -mx-8 -mt-8 mb-6 relative group">
                <div className="absolute inset-0 bg-linear-to-t from-violet-900/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Image
                  src={course.image}
                  alt={course.title}
                  width={400}
                  height={250}
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
            <div className="md:col-span-2 space-y-12">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  Những gì bạn sẽ học
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {course.learnings?.map((learning, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                      <span className="text-gray-700">{learning}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Requirements */}
              {course.requirements && course.requirements.length > 0 && (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Yêu cầu
                  </h2>
                  <ul className="space-y-3">
                    {course.requirements.map((requirement, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 text-gray-700"
                      >
                        <div className="w-2 h-2 bg-violet-600 rounded-full mt-2 shrink-0"></div>
                        {requirement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  Nội dung khóa học
                </h2>
                <div className="space-y-3">
                  {course.chapters?.map((section, chapterIndex) => (
                    <div key={chapterIndex}>
                      {/* Section Header - Clickable */}
                      <button
                        onClick={() => toggleSection(chapterIndex)}
                        className="w-full border border-gray-200 rounded-xl p-4 hover:border-violet-300 hover:bg-violet-50 transition-all text-left cursor-pointer"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1">
                            <ChevronDown
                              className={`w-5 h-5 text-violet-600 transition-transform duration-300 ${
                                expandedSections.includes(chapterIndex)
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                            <h3 className="font-semibold text-gray-800">
                              {section.title}
                            </h3>
                          </div>
                          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap ml-4">
                            {section.lessons.length} bài học
                          </span>
                        </div>
                      </button>

                      {/* Lessons List - Expandable */}
                      {expandedSections.includes(chapterIndex) && (
                        <div className="border border-t-0 border-gray-200 rounded-b-xl bg-gray-50 overflow-hidden cursor-pointer">
                          <div className="space-y-2 p-4">
                            {section.lessons.map((lesson, lessonIndex) => {
                              const isLocked =
                                !course.isPurchased ||
                                isLessonLocked(chapterIndex, lessonIndex);
                              const isCompleted =
                                lesson.progress?.completed === true;
                              const lessonLink = `/courses/${course.id}/lessons/${lesson.id}`;

                              return (
                                <div
                                  key={lesson.id}
                                  onClick={() => {
                                    if (!isLocked) {
                                      router.push(lessonLink);
                                    }
                                  }}
                                  className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
                                    isLocked
                                      ? "bg-gray-100 border-gray-200 opacity-60 cursor-not-allowed"
                                      : "bg-white border-gray-100 hover:bg-violet-50"
                                  }`}
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    {!isLocked && isCompleted && (
                                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                                    )}

                                    {/* Lesson Title */}
                                    <span
                                      className={
                                        isLocked
                                          ? "text-gray-500"
                                          : "text-gray-700"
                                      }
                                    >
                                      {lesson.title}
                                    </span>
                                  </div>

                                  {/* Thời lượng */}
                                  <div className="text-right flex items-center justify-end gap-2">
                                    {lesson.canViewVideo && (
                                      <Badge
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                      >
                                        <Video className="h-3 w-3" />
                                      </Badge>
                                    )}

                                    {lesson.hasQuiz && (
                                      <Badge variant="secondary">Quiz</Badge>
                                    )}

                                    <span
                                      className={`text-xs whitespace-nowrap flex items-center ${
                                        isLocked
                                          ? "text-gray-400"
                                          : "text-gray-500"
                                      }`}
                                    >
                                      <Clock className="h-3 w-3 mr-1" />
                                      {formatDurationVi(lesson.duration)}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Reviews */}
              {course.isPurchased && !hasReviewed && (
                <div className="bg-linear-to-r from-violet-50 to-purple-50 rounded-2xl p-8 shadow-lg border-2 border-violet-200 mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">
                    Chia sẻ trải nghiệm của bạn
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Bạn đã mua khóa học này! Hãy giúp các học viên khác bằng
                    cách chia sẻ phản hồi của bạn.
                  </p>

                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    {/* Rating Stars */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Đánh giá của bạn
                      </label>
                      <div className="flex items-center gap-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setReviewRating(i + 1)}
                            className="transform hover:scale-125 transition-transform"
                          >
                            <Star
                              className={`w-8 h-8 cursor-pointer ${
                                i < reviewRating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-sm text-gray-600 ml-2">
                          {reviewRating} trên thang điểm 5
                        </span>
                      </div>
                    </div>

                    {/* Review Text */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nhận xét của bạn
                      </label>
                      <textarea
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        placeholder="Chia sẻ suy nghĩ của bạn về khóa học này..."
                        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 resize-none"
                        rows={4}
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-linear-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
                    >
                      Gửi đánh giá
                    </button>
                  </form>
                </div>
              )}

              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  Đánh giá của học viên
                </h2>
                <div className="space-y-6">
                  {comments && comments.length > 0 ? (
                    comments.map((review) => (
                      <div
                        key={review.id}
                        className="border border-gray-200 rounded-xl p-6 hover:border-violet-300 transition-colors"
                      >
                        <div className="flex items-start gap-4 mb-4">
                          <UserAvatar
                            fullName={review.user.fullName || "User"}
                            avatarUrl={review.user.avatarUrl}
                            size={64}
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
                                    i < (review.rating ?? 0)
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
                      Chưa có đánh giá. Hãy đánh giá khóa học đầu tiên!
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
                      {getPaginationRange(
                        pagination.page,
                        pagination.totalPages,
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
                currentPage === page
                  ? "bg-violet-600 text-white shadow-lg hover:scale-105 hover:shadow-xl"
                  : "border border-gray-300 text-gray-600 hover:bg-gray-100 hover:scale-105 hover:shadow-md"
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
                          Math.min(pagination.totalPages, pagination.page + 1),
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
                  {course.isPurchased ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-gray-700">
                            Tiến độ khóa học
                          </span>
                          <span className="text-sm font-bold text-violet-600">
                            {getCourseProgress()}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-linear-to-r from-violet-600 to-purple-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${getCourseProgress()}%` }}
                          />
                        </div>
                      </div>

                      <button
                        className="w-full bg-linear-to-r from-violet-600 to-violet-800 text-white px-6 py-3 rounded-xl hover:from-violet-700 hover:to-violet-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer flex items-center justify-center gap-2"
                        onClick={goToLesson}
                        disabled={!startLesson}
                      >
                        <PlayCircle className="w-5 h-5" />
                        Đi đến khóa học
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Pricing Section */}
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="flex-1">
                            <div className="flex items-baseline gap-3">
                              <span className="text-5xl font-extrabold bg-linear-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                                {course.discount &&
                                course.discountExpiresAt &&
                                new Date(course.discountExpiresAt) > new Date()
                                  ? (course.price ?? 0).toLocaleString() + "₫"
                                  : course.originalPrice.toLocaleString() + "₫"}
                              </span>

                              {course.discount &&
                                course.discountExpiresAt &&
                                new Date(course.discountExpiresAt) >
                                  new Date() && (
                                  <span className="text-xl text-gray-400 line-through font-medium">
                                    {course.originalPrice.toLocaleString()}₫
                                  </span>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Countdown */}
                      <div className="h-15 flex items-center">
                        {course.discount &&
                        course.discountExpiresAt &&
                        new Date(course.discountExpiresAt) > new Date() ? (
                          <DiscountCountdown
                            discount={course.discount}
                            discountExpiresAt={course.discountExpiresAt}
                          />
                        ) : (
                          <div className="h-full"></div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <button
                          onClick={() => handleCartToggle(course)}
                          className={`w-full px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer ${
                            isInCart
                              ? "bg-green-500 text-white hover:bg-green-600"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          <ShoppingCart className="w-5 h-5" />
                          {isInCart ? "Đã thêm vào giỏ" : "Thêm vào giỏ hàng"}
                        </button>
                        <button
                          onClick={() => handleWishlistToggle(course)}
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
                          {isWishlisted
                            ? "Đã thêm vào yêu thích"
                            : "Thêm vào yêu thích"}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Quick Info */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <span className="text-gray-600">Trình độ</span>
                    <span className="font-semibold text-gray-800">
                      {course.level}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                    <span className="text-gray-600">Thời lượng</span>
                    <span className="font-semibold text-gray-800">
                      {formatTimeRounded(Number(course.duration))}
                    </span>
                  </div>
                  {course.students != null && (
                    <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                      <span className="text-gray-600">Học viên</span>
                      <span className="font-semibold text-gray-800">
                        {course.students.toLocaleString()}
                      </span>
                    </div>
                  )}
                  {course.rating != null && course.ratingCount != null && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Đánh giá</span>
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-gray-800">
                          {course.rating} ( {course.ratingCount})
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
