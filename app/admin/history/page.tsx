"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Loader, Search } from "lucide-react";
import PurchaseList from "@/components/student/auth/purchase-list";
import { handleGetPurchaseHistoryForAdmin } from "@/services/paymentService";
import { Pagination, Purchase } from "@/types/payment/payment";
import { getPaginationRange } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function PurchaseHistoryPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(6);

  const [searchInput, setSearchInput] = useState("");
  const [statusInput, setStatusInput] = useState("all");
  const [startDateInput, setStartDateInput] = useState("");
  const [endDateInput, setEndDateInput] = useState("");

  const [activeFilters, setActiveFilters] = useState({
    search: "",
    status: "all",
    startDate: "",
    endDate: "",
  });

  const fetchPurchases = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await handleGetPurchaseHistoryForAdmin({
        status: activeFilters.status as
          | "all"
          | "success"
          | "pending"
          | "failed",
        page: currentPage,
        limit,
        search: activeFilters.search.trim() || undefined,
        startDate: activeFilters.startDate || undefined,
        endDate: activeFilters.endDate || undefined,
      });

      setPurchases(res.data);
      setPagination(res.pagination);
    } catch (err) {
      setError("Không thể tải lịch sử giao dịch.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [activeFilters, currentPage, limit]);

  useEffect(() => {
    fetchPurchases();
  }, [fetchPurchases]);

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setActiveFilters({
      search: searchInput,
      status: statusInput,
      startDate: startDateInput,
      endDate: endDateInput,
    });
  };

  return (
    <main className="flex-1 overflow-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Quản Lý Giao Dịch Hệ Thống</h1>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
          <Card className="p-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm giao dịch, khách hàng..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Select */}
              <div className="flex-1">
                <Select
                  value={statusInput}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onValueChange={(v) => setStatusInput(v as any)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem className="cursor-pointer" value="all">
                      Tất cả trạng thái
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="success">
                      Thành công
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="pending">
                      Chờ xử lý
                    </SelectItem>
                    <SelectItem className="cursor-pointer" value="failed">
                      Thất bại
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range - Từ ngày */}
              <div className="flex-1">
                <Input
                  type="date"
                  value={startDateInput}
                  onChange={(e) => setStartDateInput(e.target.value)}
                  className="cursor-pointer"
                  title="Từ ngày"
                />
              </div>

              <div className="flex-1">
                <Input
                  type="date"
                  value={endDateInput}
                  onChange={(e) => setEndDateInput(e.target.value)}
                  className="cursor-pointer"
                  title="Đến ngày"
                />
              </div>

              <Button
                onClick={handleApplyFilters}
                className="w-full lg:w-32 bg-primary hover:bg-primary/90 text-primary-foreground font-medium cursor-pointer"
              >
                Cập nhật
              </Button>
            </div>
          </Card>
        </div>

        <div className="min-h-100">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader className="w-12 h-12 animate-spin mx-auto mb-4" />
                <p className="text-black-600">Đang tải dữ liệu...</p>
              </div>
            </div>
          ) : purchases.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-dashed border-gray-300">
              <h3 className="text-xl font-bold text-gray-800">
                Không có dữ liệu
              </h3>
              <p className="text-gray-500">
                Thử thay đổi bộ lọc hoặc nhấn &quot;Cập nhật&quot; lại.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <PurchaseList purchases={purchases} isAdminView={true} />

              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 py-8">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <div className="flex gap-2">
                    {getPaginationRange(
                      pagination.page,
                      pagination.totalPages,
                    ).map((p, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          typeof p === "number" && setCurrentPage(p)
                        }
                        className={`w-11 h-11 rounded-xl font-bold transition-all shadow-sm
                          ${p === currentPage ? "bg-violet-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-violet-400"}`}
                        disabled={p === "..."}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(pagination.totalPages, prev + 1),
                      )
                    }
                    disabled={currentPage === pagination.totalPages}
                    className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 disabled:opacity-40 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
