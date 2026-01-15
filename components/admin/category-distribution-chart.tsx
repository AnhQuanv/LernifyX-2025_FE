"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const generateMockData = () => {
  const categories = [
    { name: "Lập trình Web", value: 450000000 },
    { name: "Thiết kế & UI/UX", value: 320000000 },
    { name: "Marketing Online", value: 280000000 },
    { name: "Data Science & AI", value: 210000000 },
    { name: "Mobile App", value: 180000000 },
    { name: "Cloud Computing", value: 150000000 },
    { name: "Cyber Security", value: 120000000 },
    { name: "Game Development", value: 90000000 },
    { name: "Blockchain", value: 70000000 },
    { name: "Soft Skills", value: 50000000 },
  ];

  for (let i = 1; i <= 40; i++) {
    categories.push({
      name: `Danh mục phụ ${i}`,
      value: Math.floor(Math.random() * 10000000) + 1000000,
    });
  }
  return categories;
};

const rawData = generateMockData();

const COLORS = [
  "#8b5cf6",
  "#3b82f6",
  "#ec4899",
  "#f59e0b",
  "#10b981",
  "#ef4444",
  "#06b6d4",
  "#f43f5e",
  "#84cc16",
  "#6366f1",
  "#94a3b8",
];

export function CategoryDistributionChart() {
  const chartData = useMemo(() => {
    const sorted = [...rawData].sort((a, b) => b.value - a.value);
    const top10 = sorted.slice(0, 10);
    const othersValue = sorted
      .slice(10)
      .reduce((sum, item) => sum + item.value, 0);

    const finalData = top10.map((item, index) => ({
      ...item,
      color: COLORS[index],
    }));

    if (othersValue > 0) {
      finalData.push({
        name: "Các danh mục khác",
        value: othersValue,
        color: COLORS[10],
      });
    }

    return finalData;
  }, []);

  const total = useMemo(
    () => rawData.reduce((sum, item) => sum + item.value, 0),
    []
  );

  return (
    <div className="bg-card rounded-lg p-6 border border-border shadow-sm flex flex-col h-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-foreground">
          Tỷ Trọng Doanh Thu Theo Ngành
        </h3>
        <p className="text-sm text-muted-foreground">
          Hiển thị Top 10 danh mục dẫn đầu
        </p>
      </div>

      <div className="flex-1 min-h-100">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={2}
              dataKey="value"
              isAnimationActive={true}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  stroke="var(--color-card)"
                  strokeWidth={2}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                color: "var(--color-foreground)",
              }}
              formatter={(value: number) => [
                `${value.toLocaleString("vi-VN")} đ (${(
                  (value / total) *
                  100
                ).toFixed(1)}%)`,
                "Doanh thu",
              ]}
            />

            <Legend
              verticalAlign="bottom"
              align="center"
              layout="horizontal"
              iconType="circle"
              wrapperStyle={{ paddingTop: "20px" }}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              formatter={(value, entry: any) => {
                const percent = ((entry.payload.value / total) * 100).toFixed(
                  1
                );
                return (
                  <span className="text-[12px] text-muted-foreground ml-1">
                    {value} ({percent}%)
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
