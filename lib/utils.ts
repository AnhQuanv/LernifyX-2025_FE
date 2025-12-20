import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
interface PriceableItem {
  price: number | null;
}
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

export const getCartTotal = (items: PriceableItem[]): number => {
  return items.reduce((sum, item) => {
    const price = item.price ?? 0;
    return sum + price;
  }, 0);
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cleanFormData(obj: any): any {
  if (Array.isArray(obj)) {
    const cleanedArray = obj
      .map((item) => cleanFormData(item))
      .filter((item) => item !== undefined && item !== null);

    return cleanedArray.length > 0 ? cleanedArray : undefined;
  }

  if (typeof obj === "object" && obj !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cleanedObj: any = {};

    Object.entries(obj).forEach(([key, value]) => {
      const cleanedValue = cleanFormData(value);

      if (
        cleanedValue !== undefined &&
        cleanedValue !== null &&
        cleanedValue !== "" &&
        !(Array.isArray(cleanedValue) && cleanedValue.length === 0) &&
        !(
          typeof cleanedValue === "object" &&
          Object.keys(cleanedValue).length === 0
        )
      ) {
        cleanedObj[key] = cleanedValue;
      }
    });

    return Object.keys(cleanedObj).length > 0 ? cleanedObj : undefined;
  }

  if (obj === "") return undefined;

  return obj;
}

export function formatDurationVi(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const parts: string[] = [];

  if (h > 0) parts.push(`${h} giờ`);
  if (m > 0) parts.push(`${m} phút`);
  if (s > 0 || parts.length === 0) parts.push(`${s} giây`);

  return parts.join(" ");
}
