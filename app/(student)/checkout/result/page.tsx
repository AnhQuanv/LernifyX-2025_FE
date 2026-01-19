"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { findByPayment } from "@/redux/thunk/paymentThunk";
import { resetPayment } from "@/redux/features/payment/paymentSlice";
import { getHomeCourses } from "@/redux/thunk/courseThunk";
import { getUserAllWishlist } from "@/redux/thunk/wishlistThunk";
import { getUserAllCart } from "@/redux/thunk/cartThunk";

export default function PaymentResultPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { payment } = useSelector((state: RootState) => state.payment);
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("id");
  const statusParam = searchParams.get("status");
  const totalValue =
    payment?.items?.reduce((sum, item) => sum + Number(item.price), 0) || 0;
  const tax = totalValue * 0.1;
  const total = totalValue + tax;
  const isSuccess = statusParam === "success";

  useEffect(() => {
    if (isSuccess) {
      dispatch(getHomeCourses());
      dispatch(getUserAllWishlist({ page: 1, limit: 100 }));
      dispatch(getUserAllCart({ page: 1, limit: 100 }));
    }
    if (paymentId) {
      dispatch(findByPayment(paymentId));
    }
    return () => {
      dispatch(resetPayment());
    };
  }, [dispatch, paymentId, isSuccess]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 pt-10 pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl">
        {isSuccess ? (
          <>
            {/* SUCCESS STATE */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Thanh toán thành công!
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Cảm ơn bạn đã mua khóa học
              </p>
              <p className="text-sm text-gray-500">
                Khóa học đã được thêm vào tài khoản của bạn
              </p>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
              {/* Order ID and Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b border-gray-200">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2">
                    Mã đơn hàng
                  </p>
                  <p className="text-2xl font-bold text-gray-800">
                    {payment?.transaction_ref}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2">Ngày</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {payment?.paid_at
                      ? new Date(payment.paid_at).toLocaleString("vi-VN")
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-4 mb-8 pb-8 border-b border-gray-200">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  Chi tiết đơn hàng
                </h3>
                <div className="space-y-3 pl-7">
                  <div className="flex justify-between text-gray-600">
                    <span>
                      Tổng giá trị ({payment?.items.length} khóa học):
                    </span>
                    <span className="font-semibold text-gray-800">
                      {Number(totalValue || 0).toLocaleString()}₫
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Thuế (VAT 10%):</span>
                    <span className="font-semibold text-gray-800">
                      {/* ${tax.toFixed(2)} */}
                      {Number(tax || 0).toLocaleString()}₫
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800 pt-3 border-t border-dashed border-gray-200">
                    <span>Tổng cộng:</span>
                    <span className="text-green-600">
                      {/* ${total.toFixed(2)} */}
                      {Number(total || 0).toLocaleString()}₫
                    </span>
                  </div>
                </div>
              </div>

              {/* Course List */}
              <div className="mb-8">
                <h3 className="font-bold text-lg text-gray-800 mb-4">
                  Khóa học đã mua:
                </h3>
                <div className="space-y-2">
                  {payment?.items?.map((course) => (
                    <div
                      key={course.id}
                      className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100"
                    >
                      <span className="text-gray-700 line-clamp-1">
                        {course.course.title}
                      </span>
                      <span className="font-semibold text-green-600 ml-2 shrink-0">
                        {Math.round(course.price).toLocaleString()}₫
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Success Message Box */}
              <div className="bg-green-50 rounded-xl border border-green-200 p-4 mb-8">
                <p className="text-green-800 font-medium">
                  ✓ Thanh toán của bạn đã được xử lý thành công
                </p>
                <p className="text-green-700 text-sm mt-1">
                  Bạn có thể bắt đầu học các khóa học ngay bây giờ
                </p>
              </div>
            </div>

            {/* Action Buttons - Success */}
            <div className="space-y-3">
              <button
                onClick={() => router.push("/my-learning")}
                className="w-full bg-linear-to-r from-violet-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                Xem khóa học của tôi
              </button>

              <button
                onClick={() => router.push("/homepage")}
                className="w-full border-2 border-violet-600 text-violet-600 px-6 py-3 rounded-xl font-semibold hover:bg-violet-50 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                Quay lại trang chủ
              </button>
            </div>
          </>
        ) : (
          <>
            {/* FAILURE STATE */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Thanh toán thất bại
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Xin lỗi, chúng tôi không thể xử lý đơn hàng của bạn
              </p>
            </div>

            {/* Error Details Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
              {/* Error Alert */}
              <div className="bg-red-50 rounded-xl border border-red-200 p-4 mb-8 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900">
                    Giao dịch không thành công
                  </p>
                  <p className="text-sm text-red-700 mt-1">Có thể là do:</p>
                  <ul className="text-sm text-red-700 mt-2 space-y-1 list-disc list-inside">
                    <li>Thông tin thẻ không đúng</li>
                    <li>Số dư tài khoản không đủ</li>
                    <li>Thẻ đã hết hạn</li>
                    <li>Kết nối mạng bị gián đoạn</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons - Failure */}
            <div className="space-y-3">
              <button
                onClick={() => router.push("/cart")}
                className="w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
                Quay lại giỏ hàng
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
