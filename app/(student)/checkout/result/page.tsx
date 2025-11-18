"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import {
  CheckCircle,
  XCircle,
  ArrowRight,
  Download,
  Mail,
  Home,
  Package,
  RefreshCw,
  HelpCircle,
  AlertCircle,
  Phone,
  ArrowLeft,
} from "lucide-react";
import { useEffect } from "react";
import { findByPayment } from "@/redux/thunk/paymentThunk";
import { resetPayment } from "@/redux/features/payment/paymentSlice";
import { getHomeCourses } from "@/redux/thunk/courseThunk";
import { getUserAllWishlist } from "@/redux/thunk/wishlistThunk";
import { getUserAllCart } from "@/redux/thunk/cartThunk";

export default function PaymentResultPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { payment, status } = useSelector((state: RootState) => state.payment);
  const { user } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("id");
  const statusParam = searchParams.get("status");
  const totalValue =
    payment?.items?.reduce((sum, item) => sum + Number(item.price), 0) || 0;
  const tax = totalValue * 0.1;
  const total = totalValue + tax;
  const isSuccess = statusParam === "success";

  const handleDownloadReceipt = () => {
    console.log("Downloading receipt...");
  };

  const handleRetryPayment = () => {
    router.push("/checkout");
  };

  const handleContactSupport = () => {
    console.log("Contacting support...");
  };

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
  }, [dispatch, paymentId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-10 pb-20">
      <div className="container mx-auto px-4 md:px-6 max-w-2xl">
        {isSuccess ? (
          <>
            {/* SUCCESS STATE */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 rounded-full p-6 shadow-2xl">
                    <CheckCircle className="w-20 h-20 text-white animate-bounce" />
                  </div>
                </div>
              </div>

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
                  <Package className="w-5 h-5 text-green-600" />
                  Chi tiết đơn hàng
                </h3>
                <div className="space-y-3 pl-7">
                  <div className="flex justify-between text-gray-600">
                    <span>
                      Tổng giá trị ({payment?.items.length} khóa học):
                    </span>
                    <span className="font-semibold text-gray-800">
                      ${Number(payment?.amount || 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Thuế (VAT 10%):</span>
                    <span className="font-semibold text-gray-800">
                      ${tax.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold text-gray-800 pt-3 border-t border-dashed border-gray-200">
                    <span>Tổng cộng:</span>
                    <span className="text-green-600">${total.toFixed(2)}</span>
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
                      <span className="font-semibold text-green-600 ml-2 flex-shrink-0">
                        ${course.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email Notification */}
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 flex items-start gap-3 mb-8">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Email xác nhận đã được gửi
                  </p>
                  <p className="text-sm text-blue-700">
                    Chúng tôi đã gửi xác nhận đơn hàng đến{" "}
                    <span className="font-semibold">{user?.email}</span>
                  </p>
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
                onClick={handleDownloadReceipt}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 px-6 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Tải xuống Hóa đơn
              </button>

              <button
                onClick={() => router.push("/my-learning")}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <Package className="w-5 h-5" />
                Xem khóa học của tôi
              </button>

              <button
                onClick={() => router.push("/homepage")}
                className="w-full border-2 border-violet-600 text-violet-600 px-6 py-3 rounded-xl font-semibold hover:bg-violet-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" />
                Quay lại trang chủ
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Package className="w-6 h-6 text-violet-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Truy cập Ngay
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Bắt đầu học ngay lập tức
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Truy cập Suốt đời
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Học mà không giới hạn thời gian
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100 shadow-sm">
                <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ArrowRight className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-700">
                  Hỗ trợ 30 ngày
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Hoàn tiền nếu không hài lòng
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* FAILURE STATE */}
            <div className="text-center mb-12">
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-pink-500 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                  <div className="relative bg-gradient-to-br from-red-400 to-pink-500 rounded-full p-6 shadow-2xl">
                    <XCircle className="w-20 h-20 text-white" />
                  </div>
                </div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Thanh toán thất bại
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Xin lỗi, chúng tôi không thể xử lý đơn hàng của bạn
              </p>
              <p className="text-sm text-gray-500">
                Vui lòng kiểm tra chi tiết thanh toán và thử lại
              </p>
            </div>

            {/* Error Details Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-8">
              {/* Error Alert */}
              <div className="bg-red-50 rounded-xl border border-red-200 p-4 mb-8 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
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

              {/* Troubleshooting Section */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-4">
                  <HelpCircle className="w-5 h-5 text-orange-600" />
                  Những gì bạn có thể thử:
                </h3>
                <div className="space-y-3 pl-7">
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-orange-600">
                        1
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        Kiểm tra lại thông tin thẻ
                      </p>
                      <p className="text-sm text-gray-600">
                        Đảm bảo số thẻ, ngày hết hạn và CVV đã được nhập chính
                        xác
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-orange-600">
                        2
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        Kiểm tra số dư tài khoản
                      </p>
                      <p className="text-sm text-gray-600">
                        Đảm bảo bạn có đủ tiền để thanh toán đơn hàng
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-orange-600">
                        3
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        Thử phương thức thanh toán khác
                      </p>
                      <p className="text-sm text-gray-600">
                        Sử dụng Momo, VNPay, ZaloPay hoặc các phương thức khác
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-orange-600">
                        4
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">
                        Xóa bộ nhớ cache
                      </p>
                      <p className="text-sm text-gray-600">
                        Xóa dữ liệu trình duyệt và thử lại
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reassurance Section */}
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                <p className="text-sm font-medium text-blue-900">
                  💳 An toàn & Bảo mật
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Giao dịch của bạn được bảo vệ bởi các tiêu chuẩn bảo mật cao
                  nhất. Không có khoản tiền nào đã bị trừ từ tài khoản của bạn.
                </p>
              </div>
            </div>

            {/* Action Buttons - Failure */}
            <div className="space-y-3">
              <button
                onClick={handleRetryPayment}
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-5 h-5" />
                Thử thanh toán lại
              </button>

              <button
                onClick={handleContactSupport}
                className="w-full bg-white border-2 border-blue-600 text-blue-600 px-6 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" />
                Liên hệ Hỗ trợ
              </button>

              <button
                onClick={() => router.push("/cart")}
                className="w-full border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Quay lại giỏ hàng
              </button>
            </div>

            {/* Contact Support */}
            <div className="mt-12 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h3 className="font-bold text-lg text-gray-800 mb-6 text-center">
                Cần trợ giúp?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="mailto:support@learnifyx.com"
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors"
                >
                  <p className="text-sm font-medium text-gray-700">
                    Email hỗ trợ
                  </p>
                  <p className="text-sm text-violet-600 font-semibold mt-1">
                    support@learnifyx.com
                  </p>
                </a>
                <a
                  href="tel:+84123456789"
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center hover:bg-gray-100 transition-colors"
                >
                  <p className="text-sm font-medium text-gray-700">
                    Hotline hỗ trợ
                  </p>
                  <p className="text-sm text-violet-600 font-semibold mt-1">
                    +84 (123) 456-789
                  </p>
                </a>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
              <h3 className="font-bold text-lg text-gray-800 mb-4">
                Câu hỏi thường gặp
              </h3>
              <div className="space-y-4">
                <div className="pb-4 border-b border-gray-200">
                  <p className="font-medium text-gray-700">
                    Tại sao thanh toán của tôi bị từ chối?
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Có thể là do thông tin thẻ không đúng, số dư không đủ, hoặc
                    vấn đề bảo mật từ ngân hàng.
                  </p>
                </div>
                <div className="pb-4 border-b border-gray-200">
                  <p className="font-medium text-gray-700">
                    Tiền của tôi có bị trừ không?
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Không. Chỉ các giao dịch thành công mới được trừ từ tài
                    khoản của bạn.
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">
                    Tôi nên làm gì tiếp theo?
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Kiểm tra lại thông tin thanh toán và nhấn &quot;Thử thanh
                    toán lại&quot;, hoặc liên hệ với chúng tôi để được hỗ trợ.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
