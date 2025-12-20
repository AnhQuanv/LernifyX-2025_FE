"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight, Package } from "lucide-react";
import PurchaseFilter from "@/components/student/auth/purchase-filter";
import PurchaseList from "@/components/student/auth/purchase-list";
import { handleGetPurchaseHistory } from "@/services/paymentService";
import { Pagination, Purchase } from "@/types/payment/payment";

export default function PurchaseHistoryPage() {
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<
    "all" | "success" | "pending" | "failed"
  >("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const fetchPurchases = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await handleGetPurchaseHistory({
        status: selectedStatus,
        page,
        limit,
      });
      setPurchases(res.data);
      setFilteredPurchases(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError("Failed to load purchase history");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, page, limit]);
  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const handleStatusFilter = (
    status: "all" | "success" | "pending" | "failed"
  ) => {
    setSelectedStatus(status);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white text-gray-900 py-8 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Lịch sử Mua hàng</h1>
            </div>
          </div>

          {/* Stats Bar */}
          {purchases.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                <p className="text-gray-500 text-xs font-medium">
                  Tổng Đơn hàng
                </p>
                <p className="text-2xl font-bold text-violet-600">
                  {purchases.length}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                <p className="text-gray-500 text-xs font-medium">
                  Đã Hoàn thành
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {purchases.filter((p) => p.status === "success").length}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                <p className="text-gray-500 text-xs font-medium">Đang Chờ</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {purchases.filter((p) => p.status === "pending").length}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-100">
                <p className="text-gray-500 text-xs font-medium">
                  Tổng Chi tiêu
                </p>
                <p className="text-2xl font-bold text-purple-700">
                  {purchases
                    .reduce((sum, p) => sum + p.amount, 0)
                    .toLocaleString()}
                  ₫
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        {purchases.length === 0 ? (
          // Empty State
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="w-20 h-20 bg-linear-to-br from-violet-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-violet-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                Bạn chưa có đơn mua nào
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Bắt đầu khám phá các khóa học tuyệt vời và mua sắm ngay bây giờ.
              </p>
              <button
                onClick={() => router.push("/homepage")}
                className="bg-linear-to-r from-violet-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-violet-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
              >
                Khám Phá Khóa Học
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar - Filters */}
            <div className="lg:col-span-1">
              <PurchaseFilter
                selectedStatus={selectedStatus}
                onStatusChange={handleStatusFilter}
                statusCounts={{
                  all: purchases.length,
                  success: purchases.filter((p) => p.status === "success")
                    .length,
                  pending: purchases.filter((p) => p.status === "pending")
                    .length,
                  failed: purchases.filter((p) => p.status === "failed").length,
                }}
              />
            </div>

            {/* Main Content - Purchase List */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Đang tải lịch sử...</p>
                </div>
              ) : error ? (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                  <p className="text-red-700 font-semibold">{error}</p>
                </div>
              ) : filteredPurchases.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Không có đơn mua nào trong danh mục này.
                  </p>
                </div>
              ) : (
                <>
                  <PurchaseList purchases={filteredPurchases} />
                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-6">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="p-2 rounded-lg border"
                      >
                        <ChevronLeft />
                      </button>

                      {Array.from(
                        { length: pagination.totalPages },
                        (_, i) => i + 1
                      ).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`px-3 py-1 rounded-lg ${
                            page === p
                              ? "bg-violet-600 text-white"
                              : "border border-gray-300"
                          }`}
                        >
                          {p}
                        </button>
                      ))}

                      <button
                        onClick={() =>
                          setPage(Math.min(pagination.totalPages, page + 1))
                        }
                        disabled={page === pagination.totalPages}
                        className="p-2 rounded-lg border"
                      >
                        <ChevronRight />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
