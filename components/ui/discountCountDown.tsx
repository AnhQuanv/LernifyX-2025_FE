"use client";
import { TrendingDown, Clock } from "lucide-react";
import CountdownTimer from "./countDownTimer";

interface DiscountCountdownProps {
  discount: number;
  discountExpiresAt: string;
}

const DiscountCountdown: React.FC<DiscountCountdownProps> = ({
  discount,
  discountExpiresAt,
}) => {
  if (!discount) return null;

  return (
    <div className="flex items-center gap-2">
      {/* Discount Badge */}
      <div className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-lg">
        <TrendingDown className="w-4 h-4" />
        <span>-{discount}%</span>
      </div>

      {/* Countdown Timer */}
      <div className="flex items-center gap-1 bg-gray-900 text-white px-3 py-1.5 rounded-lg font-bold text-sm shadow-lg border border-orange-500/30">
        <Clock className="w-4 h-4 text-orange-400 animate-pulse" />
        <span>Còn lại</span>
        <CountdownTimer expiresAt={discountExpiresAt} />
      </div>
    </div>
  );
};

export default DiscountCountdown;
