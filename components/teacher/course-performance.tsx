"use client";

import { CourseRevenueDetail } from "@/app/teacher/dashboard/page";
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

  const nameCounts: Record<string, number> = data.reduce(
    (acc, item) => {
      acc[item.name] = (acc[item.name] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

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

    return (
      <div className="bg-card border border-border p-3 rounded-lg shadow-md min-w-55">
        <p className="text-sm font-bold mb-2 border-b border-border pb-1 text-black">
          {dataEntry.uniqueName || dataEntry.name}
        </p>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between gap-4 text-xs">
            <span className="text-black font-medium text-[11px]">
              Trạng thái:
            </span>
            <span className="font-bold text-black">
              {dataEntry.status === "published"
                ? "Đã xuất bản"
                : dataEntry.status === "archived"
                  ? "Đã gỡ xuống"
                  : dataEntry.status}
            </span>
          </div>

          <div className="flex justify-between gap-4 text-xs">
            <span className="text-black text-[11px] font-medium">
              Tổng doanh thu:
            </span>
            <span className="font-medium text-black">
              {Math.round(dataEntry.gmv || 0).toLocaleString("vi-VN")} đ
            </span>
          </div>

          <div className="flex justify-between gap-4 text-xs">
            <span className="text-black text-[11px] font-medium">
              Giảng viên nhận:
            </span>
            <span className="font-medium text-black">
              {Math.round(dataEntry.netRevenue || 0).toLocaleString("vi-VN")} đ
            </span>
          </div>

          <div className="flex justify-between gap-4 text-xs">
            <span className="text-black text-[11px] font-medium">
              Tỷ lệ doanh thu:
            </span>
            <span className="font-medium text-black">{dataEntry.value}%</span>
          </div>

          <div className="flex justify-between gap-4 text-xs pt-1 border-t border-dashed border-border mt-1">
            <span className="font-bold text-black">Lợi nhuận sàn:</span>
            <span className="font-bold text-black">
              {Math.round((dataEntry.gmv || 0) * 0.2).toLocaleString("vi-VN")} đ
            </span>
          </div>
        </div>
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
    processedData ? processedData.length : 0,
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
