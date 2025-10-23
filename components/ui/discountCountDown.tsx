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
    <div className="flex items-center gap-3 h-[60px]">
      {/* Discount Badge */}
      <div className="relative flex-shrink-0">
        <div className="bg-gradient-to-r from-red-500 via-red-600 to-red-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-red-400/50 backdrop-blur-sm animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl animate-shimmer"></div>
          <TrendingDown className="w-5 h-5 flex-shrink-0 drop-shadow-lg" />
          <span className="text-base tracking-wide drop-shadow-lg whitespace-nowrap">
            -{discount}%
          </span>
        </div>
      </div>

      {/* Countdown Timer */}
      <div className="relative group flex-1">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
        <div className="relative bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-3 py-2 rounded-lg font-bold shadow-xl border border-orange-500/30">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-orange-400 animate-pulse flex-shrink-0" />
              <span className="text-orange-300 text-xs font-semibold whitespace-nowrap">
                Only
              </span>
            </div>
            <div className="text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-red-300 to-pink-300">
              <CountdownTimer expiresAt={discountExpiresAt} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscountCountdown;
