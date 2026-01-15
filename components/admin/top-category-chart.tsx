"use client";

import { useCallback } from "react";
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

interface CategoryDataItem {
  name: string;
  revenue: number;
}

const generateTicks = (max: number, step: number) => {
  const ticks = [];
  for (let i = 0; i <= max; i += step) {
    ticks.push(i);
  }
  return ticks;
};

export function TopCategoriesChart({ data }: { data?: CategoryDataItem[] }) {
  const formatXAxis = useCallback((value: string) => {
    const limit = 15;
    if (value.length > limit) {
      return `${value.substring(0, limit)}...`;
    }
    return value;
  }, []);

  const formatYAxis = useCallback((value: number) => {
    if (value === 0) return "0";
    if (value >= 1000000) return `${value / 1000000}M`;
    return `${value / 1000}K`;
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 border border-border h-112.5 flex items-center justify-center">
        <p className="text-muted-foreground">Chưa có dữ liệu danh mục.</p>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map((item) => item.revenue));
  const step = 50000000;
  const domainMax = Math.ceil(maxRevenue / step) * step;
  const customTicks = generateTicks(domainMax, step);

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Top 10 Danh Mục Doanh Thu Cao Nhất (VNĐ)
      </h3>
      <ResponsiveContainer width="100%" height={450}>
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 10, bottom: 80 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="var(--color-border)"
          />

          <XAxis
            dataKey="name"
            stroke="var(--color-muted-foreground)"
            interval={0}
            angle={-45}
            textAnchor="end"
            tick={{ fontSize: 11 }}
            tickFormatter={formatXAxis}
          />

          <YAxis
            stroke="var(--color-muted-foreground)"
            tickFormatter={formatYAxis}
            domain={[0, domainMax]}
            ticks={customTicks}
            tick={{ fontSize: 12 }}
          />

          <Tooltip
            cursor={{ fill: "var(--color-muted)", opacity: 0.1 }}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const gmv = Number(payload[0].value);

                const basePrice = gmv / 1.1;

                const teacherReceive = basePrice * 0.9;

                const platformProfit = gmv - teacherReceive;

                const courseName = payload[0].payload.name;

                return (
                  <div className="bg-card border border-border p-3 rounded-lg shadow-md min-w-55">
                    <p className="text-sm font-bold mb-2 border-b border-border pb-1">
                      {courseName}
                    </p>
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between gap-4 text-xs">
                        <span className="text-black font-medium">
                          Học sinh trả:
                        </span>
                        <span className="font-bold text-black">
                          {gmv.toLocaleString("vi-VN")} đ
                        </span>
                      </div>

                      <div className="flex justify-between gap-4 text-xs">
                        <span className="text-black font-medium">
                          Giáo viên nhận:
                        </span>
                        <span className="font-bold text-black">
                          {Math.round(teacherReceive).toLocaleString("vi-VN")} đ
                        </span>
                      </div>

                      <div className="flex justify-between gap-4 text-xs pt-1 border-t border-dashed border-border mt-1">
                        <span className="font-bold text-foreground">
                          Lợi nhuận sàn:
                        </span>
                        <span className="font-bold text-black">
                          {Math.round(platformProfit).toLocaleString("vi-VN")} đ
                        </span>
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
            wrapperStyle={{ paddingBottom: 20 }}
          />

          <Bar
            dataKey="revenue"
            name="Doanh Thu "
            fill="#8b5cf6"
            radius={[4, 4, 0, 0]}
            barSize={35}
            isAnimationActive={false}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
