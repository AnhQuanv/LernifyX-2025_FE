"use client";

import { RevenueDataItem } from "@/app/(teacher)/dashboard/page";
import { useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const generateTicks = (max: number, step: number) => {
  const ticks = [];
  for (let i = 0; i <= max; i += step) {
    ticks.push(i);
  }
  return ticks;
};

export function RevenueChart({ data }: { data: RevenueDataItem[] }) {
  const formatYAxis = useCallback((value: number) => {
    if (value === 0) return "0";
    if (value >= 1000000) {
      return `${value / 1000000}M`;
    }
    return `${value / 1000}K`;
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 border border-border h-87.5 flex items-center justify-center">
        <p className="text-muted-foreground">Chưa có dữ liệu doanh thu.</p>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((item) => item.revenue));
  const step = 500000;
  const domainMax = Math.ceil(maxRevenue / step) * step;
  const customTicks = generateTicks(domainMax, step);

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Doanh Thu Hàng Tháng (Đơn vị: Ngàn đồng)
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />

          <XAxis
            dataKey="name"
            stroke="var(--color-muted-foreground)"
            interval={0} // Yêu cầu hiển thị tất cả
            angle={-45}
            textAnchor="end"
            height={60} // Tăng chiều cao trục X để chứa nhãn xoay
          />

          <YAxis
            stroke="var(--color-muted-foreground)"
            tickFormatter={formatYAxis}
            domain={[0, domainMax]}
            interval={0}
            ticks={customTicks}
          />

          <Tooltip
            contentStyle={{
              backgroundColor: "var(--color-card)",
              border: `1px solid var(--color-border)`,
              borderRadius: "8px",
              color: "var(--color-foreground)",
            }}
            formatter={(value) => [
              `${value.toLocaleString("vi-VN")} đ`,
              "Doanh thu",
            ]}
          />

          <Legend wrapperStyle={{ paddingTop: 10 }} />

          <Line
            type="monotone"
            dataKey="revenue"
            name="Doanh Thu"
            stroke="var(--color-primary)"
            strokeWidth={2}
            dot={{ fill: "var(--color-primary)", r: 4 }}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
