"use client";

import { Purchase } from "@/types/payment/payment";
import { X, CheckCircle, Clock, XCircle, Download } from "lucide-react";
import Image from "next/image";

interface PurchaseDetailModalProps {
  purchase: Purchase;
  isOpen: boolean;
  onClose: () => void;
}

export default function PurchaseDetailModal({
  purchase,
  isOpen,
  onClose,
}: PurchaseDetailModalProps) {
  if (!isOpen) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          text: "text-green-700",
          icon: <CheckCircle className="w-6 h-6" />,
          label: "Đã hoàn thành",
        };
      case "pending":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-700",
          icon: <Clock className="w-6 h-6" />,
          label: "Đang chờ",
        };
      case "failed":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700",
          icon: <XCircle className="w-6 h-6" />,
          label: "Thất bại",
        };
      default:
        return {
          bg: "bg-gray-50",
          border: "border-gray-200",
          text: "text-gray-700",
          icon: null,
          label: "Không xác định",
        };
    }
  };

  const statusStyle = getStatusStyle(purchase.status);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Chi tiết đơn hàng
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                Mã giao dịch
              </p>
              <p className="text-lg font-bold text-gray-800">
                {purchase.transactionRef}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                Phương thức thanh toán
              </p>
              <p className="text-lg font-bold text-gray-800">
                {purchase.gateway}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">Ngày tạo</p>
              <p className="text-lg font-bold text-gray-800">
                {formatDate(purchase.createdAt)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">
                Trạng thái
              </p>
              <div
                className={`flex items-center gap-2 w-fit px-3 py-2 rounded-full border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}
              >
                {statusStyle.icon}
                <span className="font-semibold">{statusStyle.label}</span>
              </div>
            </div>
          </div>

          {purchase.paidAt && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">
                <span className="font-semibold">Thanh toán vào:</span>{" "}
                {formatDate(purchase.paidAt)}
              </p>
            </div>
          )}

          {/* Items */}
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Khóa học đã mua
            </h3>
            <div className="space-y-3">
              {purchase.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                >
                  {/* Course Info Left */}
                  <div className="flex items-center gap-4">
                    {/* Course Image */}
                    <div className="min-w-12 min-h-12 w-12 h-12 relative rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      <Image
                        src="https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg"
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>

                    {/* Title + Teacher */}
                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        by {item.instructor}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <span className="text-lg font-bold text-violet-600">
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-800">
                Tổng cộng:
              </span>
              <span className="text-2xl font-bold text-violet-600">
                {purchase.amount.toLocaleString()} {purchase.currency || "VND"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-violet-600 text-white rounded-lg font-semibold hover:bg-violet-700 transition-colors">
              <Download className="w-5 h-5" />
              Tải Hóa đơn
            </button>
            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
