"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Star, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { User } from "@/types/user/user";

interface Review {
  id: string;
  user: User;
  rating: number;
  content: string;
  createdAt: string;
}

interface Pagination {
  page: number;
  totalPages: number;
}

interface CourseReviewsProps {
  isPurchased: boolean;
  hasReviewed: boolean;
  comments: Review[];
  pagination: Pagination;
  onSubmitReview: (rating: number, content: string) => void;
}

const CourseReviews: React.FC<CourseReviewsProps> = ({
  isPurchased,
  hasReviewed,
  comments,
  pagination,
  onSubmitReview,
}) => {
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [currentPage, setCurrentPage] = useState(pagination.page);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReview(reviewRating, reviewContent);
    setReviewContent("");
    setReviewRating(0);
  };

  return (
    <div className="space-y-8">
      {/* Form đánh giá */}
      {isPurchased && !hasReviewed && (
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-8 shadow-lg border-2 border-violet-200">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            Chia sẻ trải nghiệm của bạn
          </h3>
          <p className="text-gray-600 mb-6">
            Bạn đã mua khóa học này! Hãy giúp các học viên khác bằng cách chia
            sẻ đánh giá của bạn.
          </p>
          <form onSubmit={handleSubmitReview} className="space-y-4">
            {/* Chọn số sao */}
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
                  {reviewRating} / 5 sao
                </span>
              </div>
            </div>

            {/* Nội dung đánh giá */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nội dung đánh giá
              </label>
              <textarea
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn về khóa học này..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-600 resize-none"
                rows={4}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-violet-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer"
            >
              Gửi đánh giá
            </button>
          </form>
        </div>
      )}

      {/* Thông báo cảm ơn */}
      {isPurchased && hasReviewed && (
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">
                Cảm ơn bạn đã đánh giá!
              </p>
              <p className="text-sm text-green-700">
                Đánh giá của bạn giúp các học viên khác đưa ra quyết định đúng
                đắn.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Danh sách đánh giá */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
          <Star className="w-8 h-8 text-violet-600" />
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
                  <Image
                    src={
                      review.user.avatarUrl ||
                      "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg"
                    }
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
              Chưa có đánh giá nào. Hãy là người đầu tiên đánh giá khóa học này!
            </p>
          )}
        </div>

        {/* Phân trang */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 hover:scale-105 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                  className={`w-10 h-10 rounded-lg font-semibold transition-all cursor-pointer ${
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
                setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))
              }
              disabled={currentPage === pagination.totalPages}
              className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 hover:scale-105 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseReviews;
