"use client";

import { RevenueDataItem } from "@/app/teacher/dashboard/page";
import { useCallback, useMemo } from "react";
import { Loader2 } from "lucide-react";
import {
  BarChart,
  Bar,
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

interface RevenueChartProps {
  data: RevenueDataItem[];
  isLoading?: boolean;
}

export function RevenueChart({ data, isLoading }: RevenueChartProps) {
  const formatYAxis = useCallback((value: number) => {
    if (value === 0) return "0";
    if (value >= 1000000) return `${value / 1000000}M`;
    return `${value / 1000}K`;
  }, []);

  const isAllZero = useMemo(() => {
    if (!data || data.length === 0) return true;
    return data.every((item) => item.revenue === 0 && item.gmv === 0);
  }, [data]);

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg p-6 border border-border h-120 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
        <p className="text-muted-foreground animate-pulse font-medium">
          Đang cập nhật dữ liệu...
        </p>
      </div>
    );
  }

  if (isAllZero) {
    return (
      <div className="bg-card rounded-lg p-6 border border-border h-120 flex flex-col items-center justify-center text-center space-y-3">
        <div className="bg-muted p-4 rounded-full"></div>
        <div className="space-y-1">
          <p className="text-foreground ">Chưa có doanh thu</p>
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((item) => item.revenue), 1000000);
  const step = 500000;
  const domainMax = Math.ceil(maxRevenue / step) * step;
  const customTicks = generateTicks(domainMax, step);

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
        Doanh Thu Hàng Tháng (Đơn vị: VNĐ)
      </h3>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 40 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="rgba(var(--color-border), 0.5)"
          />
          <XAxis
            dataKey="name"
            stroke="#888888"
            tick={{ fontSize: 11 }}
            axisLine={true}
            tickLine={true}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            stroke="#888888"
            tickFormatter={formatYAxis}
            domain={[0, domainMax]}
            ticks={customTicks}
            tick={{ fontSize: 11 }}
            axisLine={true}
            tickLine={true}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                const gmv = item.gmv || 0;
                const revenue = item.revenue || 0;
                const platformProfit = gmv * 0.2;

                return (
                  <div className="bg-white border border-border p-4 rounded-xl shadow-xl min-w-60">
                    <p className="text-sm font-bold mb-3 border-b border-slate-200 pb-2 text-black">
                      Tháng {item.name}
                    </p>

                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-black font-medium">
                          Tổng doanh thu:
                        </span>
                        <span className="font-bold text-black">
                          {gmv.toLocaleString("vi-VN")} đ
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-xs">
                        <span className="text-black font-medium">
                          Giáo viên nhận:
                        </span>
                        <span className="font-bold text-black">
                          {revenue.toLocaleString("vi-VN")} đ
                        </span>
                      </div>

                      <div className="pt-2 border-t border-dashed border-slate-300 mt-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-black font-bold">
                            Lợi nhuận sàn:
                          </span>
                          <span className="font-bold text-black">
                            {platformProfit.toLocaleString("vi-VN")} đ
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: 25, fontSize: "12px" }}
          />
          <Bar
            isAnimationActive={false}
            dataKey="revenue"
            name="Doanh Thu Nhận"
            fill="#3b82f6"
            radius={[6, 6, 0, 0]}
            barSize={32}
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
