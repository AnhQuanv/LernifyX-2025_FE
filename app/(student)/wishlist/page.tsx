"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  ArrowLeft,
  Trash2,
  Star,
  Users,
  Clock,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useWishlistCart } from "@/hooks/commonHooks";
import { formatTimeRounded, getCartTotal, roundVND } from "@/lib/utils";

export default function WishlistPage() {
  const router = useRouter();
  const { handleWishlistToggle, handleCartToggle } = useWishlistCart();
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist.allCourses
  );
  const cartItems = useSelector((state: RootState) => state.cart.allCourses);

  const totalValue = getCartTotal(wishlistItems);
  const isInCart = (courseId: string) =>
    cartItems.some((item) => item.id === courseId);
  const allInCart = wishlistItems.every((course) => isInCart(course.id));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white text-gray-900 py-8 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Danh sách yêu thích</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        {wishlistItems.length === 0 ? (
          // Empty State
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="w-20 h-20 bg-gradient-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-violet-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Danh sách yêu thích trống
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Bắt đầu thêm khóa học vào danh sách yêu thích để lưu xem sau.
                Bạn có thể thêm các khóa học từ danh mục khóa học.
              </p>
              <button
                onClick={() => router.push("/homepage")}
                className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                Xem Khóa Học
              </button>
            </div>
          </div>
        ) : (
          // Wishlist Items
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {wishlistItems.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group"
                >
                  <div className="flex flex-col sm:flex-row gap-6 p-6">
                    {/* Course Image */}
                    <Link
                      href={`/courses/${course.id}`}
                      className="flex-shrink-0"
                    >
                      <div className="relative w-full sm:w-40 h-40 rounded-xl overflow-hidden bg-gray-200 group-hover:shadow-lg transition-all duration-300">
                        <Image
                          src={
                            course.image ||
                            "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg"
                          }
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

                    {/* Course Info */}
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
                          {course.rating != null &&
                            course.ratingCount != null && (
                              <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                <span className="text-sm font-semibold text-gray-700">
                                  {course.rating} ({course.ratingCount} đánh
                                  giá)
                                </span>
                              </div>
                            )}
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
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
                          <span className="bg-violet-100 text-violet-700 px-2 py-1 rounded-full text-xs font-medium">
                            {course.category}
                          </span>
                        </div>

                        <p className="text-gray-600 text-sm line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      {/* Price and Actions */}
                      <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-100">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-violet-600">
                            {course.price.toLocaleString()}₫
                          </span>
                          {course.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              {course.originalPrice.toLocaleString()}₫
                            </span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() => handleCartToggle(course)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300 cursor-pointer ${
                              isInCart(course.id)
                                ? "bg-gray-300 text-gray-700 hover:bg-gray-400"
                                : "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700"
                            }`}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span className="hidden sm:inline">
                              {isInCart(course.id)
                                ? "Đã thêm vào giỏ"
                                : "Thêm vào giỏ"}
                            </span>
                          </button>

                          <button
                            onClick={() => handleWishlistToggle(course)}
                            className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
                            aria-label={
                              course.isInWishlist
                                ? "Xóa khỏi danh sách yêu thích"
                                : "Thêm vào danh sách yêu thích"
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-24">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Tóm tắt danh sách
                </h3>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Tổng số khóa học:</span>
                    <span className="font-semibold text-gray-800">
                      {wishlistItems.length}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tổng giá trị:</span>
                    <span className="font-semibold text-gray-800">
                      {totalValue.toLocaleString()}₫
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Giá trung bình:</span>
                    <span className="font-semibold text-gray-800">
                      {roundVND(
                        totalValue / wishlistItems.length
                      ).toLocaleString()}
                      ₫
                    </span>
                  </div>
                </div>

                <button
                  disabled={allInCart}
                  onClick={() => {
                    wishlistItems.forEach((course) => {
                      if (!isInCart(course.id)) handleCartToggle(course);
                    });
                  }}
                  className={`w-full px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg mb-3 cursor-pointer ${
                    allInCart
                      ? "bg-gray-300 text-gray-700 cursor-not-allowed"
                      : "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700"
                  }`}
                >
                  {allInCart
                    ? "Tất cả khóa học đã trong giỏ"
                    : "Thêm tất cả vào giỏ"}
                </button>

                <button
                  onClick={() => router.push("/courses")}
                  className="w-full border-2 border-violet-600 text-violet-600 px-6 py-3 rounded-xl font-semibold hover:bg-violet-50 transition-all duration-300 cursor-pointer"
                >
                  Tiếp tục mua sắm
                </button>

                <div className="mt-6 p-4 bg-violet-50 rounded-lg border border-violet-200">
                  <p className="text-xs text-violet-700 font-medium">
                    💡 Lưu ý: Các khóa học trong danh sách yêu thích được lưu
                    trong 30 ngày. Hãy thêm chúng vào giỏ trước khi hết hạn!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
