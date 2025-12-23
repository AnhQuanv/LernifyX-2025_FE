"use client";

import { Filter } from "lucide-react";

interface PurchaseFilterProps {
  selectedStatus: "all" | "success" | "pending" | "failed";
  onStatusChange: (status: "all" | "success" | "pending" | "failed") => void;
  statusCounts: {
    all: number;
    success: number;
    pending: number;
    failed: number;
  };
}

export default function PurchaseFilter({
  selectedStatus,
  onStatusChange,
  statusCounts,
}: PurchaseFilterProps) {
  const filters = [
    { value: "all" as const, label: "Tất cả", count: statusCounts.all },
    {
      value: "success" as const,
      label: "Đã hoàn thành",
      count: statusCounts.success,
      color: "text-green-600",
    },
    {
      value: "pending" as const,
      label: "Đang chờ",
      count: statusCounts.pending,
      color: "text-yellow-600",
    },
    {
      value: "failed" as const,
      label: "Thất bại",
      count: statusCounts.failed,
      color: "text-red-600",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-24">
      <h3 className="flex items-center gap-2 text-lg font-bold text-gray-800 mb-4">
        Lọc Trạng thái
      </h3>

      <div className="space-y-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => onStatusChange(filter.value)}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-300 border-2 ${
              selectedStatus === filter.value
                ? "bg-violet-50 border-violet-600 text-violet-700"
                : "bg-gray-50 border-gray-200 text-gray-700 hover:border-violet-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span>{filter.label}</span>
              <span
                className={`text-sm font-bold ${
                  filter.color || "text-gray-600"
                }`}
              >
                {filter.count}
              </span>
            </div>
          </button>
        ))}
      </div>

      <hr className="my-6" />
    </div>
  );
}
