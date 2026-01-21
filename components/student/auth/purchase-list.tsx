"use client";

import { useState } from "react";
import { ChevronDown, Eye, CheckCircle, Clock, XCircle } from "lucide-react";
import PurchaseDetailModal from "./purchase-detail-history";
import Image from "next/image";
import { Purchase } from "@/types/payment/payment";

interface PurchaseListProps {
  purchases: Purchase[];
  isAdminView?: boolean;
}

export default function PurchaseList({
  purchases,
  isAdminView,
}: PurchaseListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(
    null,
  );

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
          icon: <CheckCircle className="w-5 h-5" />,
          label: "Đã hoàn thành",
        };
      case "pending":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          text: "text-yellow-700",
          icon: <Clock className="w-5 h-5" />,
          label: "Đang chờ",
        };
      case "failed":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          text: "text-red-700",
          icon: <XCircle className="w-5 h-5" />,
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

  return (
    <div className="space-y-4">
      {purchases.map((purchase) => {
        const statusStyle = getStatusStyle(purchase.status);
        const isExpanded = expandedId === purchase.id;

        return (
          <div
            key={purchase.id}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            {/* Purchase Header */}
            <button
              onClick={() => setExpandedId(isExpanded ? null : purchase.id)}
              className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 text-left">
                <div className="flex flex-wrap items-center gap-4 mb-3">
                  <h3 className="text-lg font-bold text-gray-800">
                    Đơn #{purchase.transactionRef}
                  </h3>
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full border ${statusStyle.bg} ${statusStyle.border} ${statusStyle.text}`}
                  >
                    {statusStyle.icon}
                    <span className="text-sm font-semibold">
                      {statusStyle.label}
                    </span>
                  </div>
                </div>

                {isAdminView && purchase.customer && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 mb-3 bg-violet-50/50 p-3 rounded-xl border border-violet-100/50">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      Họ tên:
                      <span className="font-bold">
                        {purchase.customer.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      Email:
                      <span>{purchase.customer.email}</span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>
                    {formatDate(purchase.paidAt || purchase.createdAt)}
                  </span>
                  <span className="hidden sm:inline">
                    {purchase.items.length} khóa học
                  </span>
                  <span className="text-violet-600 font-bold text-base">
                    {purchase.amount.toLocaleString()}₫
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPurchase(purchase);
                  }}
                  className="flex items-center justify-center w-10 h-10 rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors"
                  title="Xem chi tiết"
                >
                  <Eye className="w-5 h-5" />
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {/* Purchase Items - Expanded Content */}
            {isExpanded && (
              <div className="border-t border-gray-100 bg-gray-50 p-6">
                <h4 className="text-sm font-semibold text-gray-700 mb-4">
                  Danh sách sản phẩm:
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {purchase.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="min-w-12 min-h-12 w-12 h-12 relative rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                          <Image
                            src={
                              item.image ||
                              "https://images.pexels.com/photos/1181676/pexels-photo-1181676.jpeg"
                            }
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 line-clamp-1">
                            {item.title}
                          </p>
                          {item.instructor && (
                            <p className="text-xs text-gray-500">
                              Giảng viên: {item.instructor}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-700 whitespace-nowrap">
                        {item.price.toLocaleString()}₫
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {selectedPurchase && (
        <PurchaseDetailModal
          purchase={selectedPurchase}
          isOpen={!!selectedPurchase}
          onClose={() => setSelectedPurchase(null)}
        />
      )}
    </div>
  );
}
