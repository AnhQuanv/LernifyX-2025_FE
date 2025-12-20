"use client";

import { CourseRevenueDetail } from "@/app/(teacher)/dashboard/page";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const generateDynamicColors = (count: number) => {
  if (count === 0) return [];
  const colors = [];
  const saturation = "70%";
  const lightness = "50%";
  const hueStep = 360 / count;
  for (let i = 0; i < count; i++) {
    const hue = Math.round(i * hueStep);
    colors.push(`hsl(${hue}, ${saturation}, ${lightness})`);
  }
  return colors;
};

const shortenId = (id: string) => {
  return id ? String(id).substring(0, 6) : "";
};

const processCourseData = (data: { name: string; id?: string }[]) => {
  if (!data || data.length === 0) return [];

  const nameCounts: Record<string, number> = data.reduce((acc, item) => {
    acc[item.name] = (acc[item.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return data.map((item) => {
    const isDuplicate = nameCounts[item.name] > 1;
    const uniqueName =
      isDuplicate && item.id
        ? `${item.name} (${shortenId(item.id)})`
        : item.name;

    return {
      ...item,
      uniqueName: uniqueName,
    };
  });
};

const CustomTooltip = ({
  active,
  payload,
}: {
  active: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
}) => {
  if (active && payload && payload.length) {
    const dataEntry = payload[0].payload;
    const netRevenueString = dataEntry.netRevenue
      ? dataEntry.netRevenue.toLocaleString("vi-VN", {
          style: "currency",
          currency: "VND",
        })
      : "";

    return (
      <div
        className="p-3 shadow-md border rounded-lg"
        style={{
          backgroundColor: "var(--color-card)",
          border: `1px solid var(--color-border)`,
          color: "var(--color-foreground)",
        }}
      >
        <p className="font-semibold text-sm mb-1">
          {dataEntry.uniqueName || dataEntry.name}
        </p>

        {dataEntry.netRevenue && (
          <p className="text-muted-foreground text-xs mt-1">
            Doanh thu:
            <span className="font-bold text-primary ml-1">
              {netRevenueString}
            </span>
          </p>
        )}

        <p className="text-muted-foreground text-xs mt-1">
          Tỷ lệ Doanh thu:
          <span className="font-bold text-primary ml-1">
            {dataEntry.value}%
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const legendFormatter = (value: string) => {
  const MAX_LENGTH = 25;
  if (value.length > MAX_LENGTH) {
    return value.substring(0, MAX_LENGTH) + "...";
  }
  return value;
};

export function CoursePerformance({ data }: { data: CourseRevenueDetail[] }) {
  const processedData = processCourseData(data);
  const dynamicColors = generateDynamicColors(
    processedData ? processedData.length : 0
  );

  if (!processedData || processedData.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 border border-border h-75 flex items-center justify-center">
        <p className="text-muted-foreground">
          Chưa có dữ liệu khóa học để tính tỷ lệ doanh thu.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        Tỷ Lệ Doanh Thu Theo Khóa Học (Đơn vị: Phần trăm)
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Tooltip content={CustomTooltip} />

          <Legend
            verticalAlign="middle"
            align="right"
            layout="vertical"
            wrapperStyle={{ paddingLeft: "10px" }}
            formatter={legendFormatter}
          />

          <Pie
            isAnimationActive={false}
            data={processedData}
            cx="35%"
            cy="50%"
            labelLine={false}
            label={({ percent }) => `${((percent ?? 0) * 100).toFixed(2)}%`}
            outerRadius={100}
            dataKey="value"
            nameKey="uniqueName"
          >
            {processedData.map((entry, index) => (
              <Cell
                key={`cell-${entry.id || index}`}
                fill={dynamicColors[index]}
                strokeWidth={2}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
