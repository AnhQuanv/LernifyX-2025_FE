"use client";

import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, Lock, CreditCard } from "lucide-react";
import { getCartTotal } from "@/lib/utils";
import { createPayment } from "@/redux/thunk/paymentThunk";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const cartItems = useSelector((state: RootState) => state.cart.allCourses);
  const totalValue = getCartTotal(cartItems);

  const taxRate = 0.1;
  const tax = totalValue * taxRate;
  const total = totalValue + tax;

  const [isLoading, setIsLoading] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-10 bg-white shadow-xl rounded-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Giỏ hàng của bạn đang trống!
          </h2>
          <button
            onClick={() => router.push("/homepage")}
            className="text-violet-600 hover:text-violet-800 font-medium"
          >
            Quay lại mua hàng
          </button>
        </div>
      </div>
    );
  }

  const finalTotal = total * (1 - discount);
  const savings = total * discount;

  const handlePlaceOrder = async () => {
    if (!selectedPaymentMethod) {
      toast.error("Vui lòng chọn phương thức thanh toán.", { duration: 4000 });
      return;
    }

    setIsLoading(true);
    try {
      const action = await dispatch(
        createPayment({
          courseId: cartItems.map((c) => c.id),
          gateway: selectedPaymentMethod,
        })
      );

      if (createPayment.fulfilled.match(action)) {
        window.location.href = action.payload;
      } else {
        toast.error("Không thể tạo thanh toán. Vui lòng thử lại!", {
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      toast.error("Đã xảy ra lỗi khi thanh toán.. Vui lòng thử lại!", {
        duration: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-20">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow hover:bg-gray-100 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h1 className="text-3xl font-bold text-gray-800">
            Thanh Toán Khóa Học
          </h1>
        </div>
        <hr className="mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Phương thức Thanh toán */}
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-violet-600" />
                Chọn Phương thức Thanh toán
              </h2>

              <div className="space-y-3">
                {/* 2. Momo */}
                <label className="flex items-center space-x-3 bg-red-50 p-4 rounded-lg border border-red-200 cursor-pointer hover:border-red-400 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="MoMo"
                    checked={selectedPaymentMethod === "MoMo"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-red-600 border-red-300 focus:ring-red-500"
                  />
                  <span className="text-gray-700 font-medium">
                    Ví điện tử **Momo**
                  </span>
                </label>

                {/* 3. VNPay */}
                <label className="flex items-center space-x-3 bg-blue-50 p-4 rounded-lg border border-blue-200 cursor-pointer hover:border-blue-400 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="VNPay"
                    checked={selectedPaymentMethod === "VNPay"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="h-4 w-4 text-blue-600 border-blue-300 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">
                    Thanh toán qua **VNPay**
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* 2. Tóm tắt Đơn hàng & Nút Đặt hàng */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-100 sticky lg:top-10">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Tóm tắt Đơn hàng
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-600">
                  <span>Tổng giá trị khóa học ({cartItems.length} items):</span>
                  <span className="font-semibold text-gray-800">
                    {totalValue.toLocaleString()}₫
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Thuế (VAT {taxRate * 100}%):</span>
                  <span className="font-semibold text-gray-800">
                    {Math.round(totalValue * 0.1).toLocaleString()}₫
                  </span>
                </div>
                <div
                  className="flex justify-between text-lg font-bold text-red-600 pt-3 border-t border-dashed border-gray-200"
                  style={{ display: discount > 0 ? "flex" : "none" }}
                >
                  <span>Giảm giá Mã Coupon:</span>
                  <span className="text-red-600">-${savings.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-2xl font-bold text-gray-800 mb-6">
                <span>Tổng cộng:</span>
                <span className="text-violet-600">
                  {finalTotal.toLocaleString()}₫
                </span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isLoading}
                className="w-full bg-linear-to-r from-violet-600 to-purple-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    Đặt Hàng và Thanh Toán
                  </>
                )}
              </button>

              <p className="mt-4 text-center text-xs text-gray-500">
                Bằng cách đặt hàng, bạn đồng ý với Điều khoản Dịch vụ của chúng
                tôi.
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-gray-700 mb-4">
                Các khóa học bạn đang mua:
              </h3>
              <ul className="space-y-3">
                {cartItems.map((course) => (
                  <li
                    key={course.id}
                    className="flex justify-between items-center text-sm bg-white p-3 rounded-lg shadow-sm"
                  >
                    <span className="line-clamp-1">{course.title}</span>

                    {course.originalPrice &&
                    course.discountExpiresAt &&
                    new Date(course.discountExpiresAt) > new Date() ? (
                      <>
                        <span className="font-semibold text-violet-600">
                          {(course.price ?? 0).toLocaleString()}₫
                        </span>

                        <span className="text-gray-400 line-through">
                          {course.originalPrice.toLocaleString()}₫
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="font-semibold text-violet-600">
                          {course.originalPrice?.toLocaleString()}₫
                        </span>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
