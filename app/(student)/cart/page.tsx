"use client";

import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useWishlistCart } from "@/hooks/commonHooks";
import { getCartTotal } from "@/lib/utils";
import { CourseHorizontalCard } from "@/components/student/popover/CourseHorizontalCard";

export default function CartPage() {
  const router = useRouter();
  const cartItems = useSelector((state: RootState) => state.cart.allCourses);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const { handleCartToggle } = useWishlistCart();
  const totalValue = getCartTotal(cartItems);

  const tax = totalValue * 0.1;
  const total = totalValue + tax;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsCheckingOut(false);
    router.push("/checkout");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white text-gray-900 py-8 z-50 shadow-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Giỏ Hàng</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        {cartItems.length === 0 ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Giỏ hàng trống
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Hãy thêm khóa học vào giỏ để bắt đầu hành trình học tập của bạn.
                Duyệt bộ sưu tập khóa học của chúng tôi để tìm kiếm các khóa học
                chất lượng.
              </p>
              <button
                onClick={() => router.push("/courses")}
                className="bg-linear-to-r from-violet-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2 cursor-pointer"
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((course) => (
                <CourseHorizontalCard
                  key={course.id}
                  course={course}
                  type="cart"
                  onAction={handleCartToggle}
                />
              ))}
            </div>

            {/* Sidebar - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-24">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Tóm tắt đơn hàng
                </h3>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính:</span>
                    <span className="font-semibold text-gray-800">
                      {totalValue.toLocaleString()}₫
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Thuế (10%):</span>
                    <span className="font-semibold text-gray-800">
                      {tax.toLocaleString()}₫
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800 pt-2">
                    <span>Tổng cộng:</span>
                    <span className="text-violet-600">
                      {total.toLocaleString()}₫
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="cursor-pointer w-full bg-linear-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-3"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    <>Tiến hành thanh toán</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
