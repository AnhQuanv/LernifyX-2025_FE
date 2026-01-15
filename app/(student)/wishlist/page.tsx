"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useWishlistCart } from "@/hooks/commonHooks";
import { getCartTotal, roundVND } from "@/lib/utils";
import { CourseHorizontalCard } from "@/components/student/popover/CourseHorizontalCard";

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
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white text-gray-900 py-8 z-50 shadow-md">
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
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Danh sách yêu thích trống
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Bắt đầu thêm khóa học vào danh sách yêu thích để lưu xem sau.
                Bạn có thể thêm các khóa học từ danh mục khóa học.
              </p>
              <button
                onClick={() => router.push("/homepage")}
                className="bg-linear-to-r from-violet-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2 cursor-pointer"
              >
                Xem Khóa Học
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {wishlistItems.map((course) => (
                <CourseHorizontalCard
                  key={course.id}
                  course={course}
                  onAction={handleWishlistToggle}
                  type="wishlist"
                  isInCart={isInCart}
                  handleCartToggle={handleCartToggle}
                />
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
                      : "bg-linear-to-r from-violet-600 to-purple-600 text-white hover:from-violet-700 hover:to-purple-700"
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
