import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name?: string) => {
  if (!name) return "U";
  const words = name.trim().split(" ").filter(Boolean);
  if (words.length === 0) return "U";
  if (words.length === 1) return words[0][0].toUpperCase();
  return words[0][0].toUpperCase() + words[words.length - 1][0].toUpperCase();
};

export const getCartTotal = (items: { price: number }[]): number => {
  return items.reduce((sum, item) => sum + item.price, 0);
};

export const formatCurrency = (amount: number, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

export const roundVND = (value: number) => {
  const remainder = value % 1000;
  if (remainder >= 500) {
    return value + (1000 - remainder);
  } else {
    return value - remainder;
  }
};

export const formatTimeFull = (seconds: number): string => {
  if (!seconds || seconds < 0) return "0m 00s";

  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const mm = String(mins).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");

  if (hrs > 0) {
    return `${hrs}h ${mm}m ${ss}s`;
  }

  return `${mm}m ${ss}s`;
};

export const formatTimeRounded = (seconds: number): string => {
  if (!seconds || seconds < 0) return "0h";

  const totalHours = seconds / 3600;
  const roundedHours = Math.round(totalHours);

  return `${roundedHours}h`;
};
