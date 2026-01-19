import { Course } from "@/types/course/course";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
interface PriceableItem {
  price: number | null;
  originalPrice?: number | null;
  discount?: number | null;
  discountExpiresAt?: string | null;
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
  const now = new Date();

  return items.reduce((sum, item) => {
    let finalPrice = 0;

    // Kiểm tra điều kiện giảm giá:
    // 1. Có giá trị discount > 0
    // 2. Có discountExpiresAt và thời gian hiện tại chưa vượt quá hạn
    const hasValidDiscount =
      item.discount &&
      item.discount > 0 &&
      item.discountExpiresAt &&
      new Date(item.discountExpiresAt) > now;

    if (hasValidDiscount) {
      // Dùng giá đã giảm (price)
      finalPrice = item.price ?? 0;
    } else {
      // Dùng giá gốc (originalPrice), nếu không có thì fallback về price hoặc 0
      finalPrice = item.originalPrice ?? item.price ?? 0;
    }

    return sum + finalPrice;
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
      .filter((item) => item !== undefined);

    return cleanedArray.length > 0 ? cleanedArray : [];
  }

  if (typeof obj === "object" && obj !== null) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cleanedObj: any = {};

    Object.entries(obj).forEach(([key, value]) => {
      const cleanedValue = cleanFormData(value);

      if (
        cleanedValue !== undefined &&
        cleanedValue !== "" &&
        !(Array.isArray(cleanedValue) && cleanedValue.length === 0) &&
        !(
          typeof cleanedValue === "object" &&
          cleanedValue !== null &&
          Object.keys(cleanedValue).length === 0
        )
      ) {
        cleanedObj[key] = cleanedValue;
      } else if (cleanedValue === null) {
        cleanedObj[key] = null;
      }
    });

    return Object.keys(cleanedObj).length > 0 ? cleanedObj : undefined;
  }

  if (obj === "") return null;

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

export const extractPlaybackId = (url: string | null | undefined) => {
  if (!url) return null;
  const parts = url.split("/");
  const lastPart = parts[parts.length - 1];
  return lastPart ? lastPart.replace(".m3u8", "") : null;
};

export const getPaginationRange = (currentPage: number, totalPages: number) => {
  const delta = 2;
  const range = [];
  const rangeWithDots = [];
  let l;

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    }
  }

  // eslint-disable-next-line prefer-const
  for (let i of range) {
    if (l) {
      if (i - l === 2) {
        rangeWithDots.push(l + 1);
      } else if (i - l !== 1) {
        rangeWithDots.push("...");
      }
    }
    rangeWithDots.push(i);
    l = i;
  }

  return rangeWithDots;
};

// export const getStatusBadge = (course: Course, isAdmin: boolean = false) => {
//   if (course.status === "published") {
//     if (course.childCourseStatus === "pending") {
//       return {
//         label: "Đã xuất bản (Chờ duyệt sửa đổi)",
//         color: "border-black text-black",
//       };
//     }

//     if (course.childCourseStatus === "rejected") {
//       return {
//         label: "Đã xuất bản (Bản sửa bị từ chối)",
//         color: "border-black text-black",
//       };
//     }

//     if (!isAdmin && (course.childCourseStatus === "draft" || course.hasDraft)) {
//       return {
//         label: "Đã xuất bản (Có bản nháp)",
//         color: "border-black text-black",
//       };
//     }

//     return {
//       label: "Đã xuất bản",
//       color: "border-black text-black",
//     };
//   }

//   const statusMap = {
//     draft: {
//       label: "Nháp",
//       color: "border-black text-black",
//     },
//     pending: {
//       label: "Chờ duyệt",
//       color: "border-black text-black",
//     },
//     rejected: {
//       label: "Bị từ chối",
//       color: "border-black text-black",
//     },
//     archived: {
//       label: "Bị gỡ xuống",
//       color: "border-black text-black",
//     },
//   };

//   return (
//     statusMap[course.status as keyof typeof statusMap] || {
//       label: course.status,
//       color: "border-black text-black",
//     }
//   );
// };

export const getStatusBadge = (course: Course, isAdmin: boolean = false) => {
  if (course.status === "published") {
    if (course.childCourseStatus === "pending") {
      return {
        label: "Đã xuất bản (Chờ duyệt sửa đổi)",
        color: "border-black text-black",
      };
    }
    if (course.childCourseStatus === "rejected") {
      return {
        label: "Đã xuất bản (Bản sửa bị từ chối)",
        color: "border-black text-black",
      };
    }
    if (!isAdmin && (course.childCourseStatus === "draft" || course.hasDraft)) {
      return {
        label: "Đã xuất bản (Có bản nháp)",
        color: "border-black text-black",
      };
    }
    return { label: "Đã xuất bản", color: "border-black text-black" };
  }

  if (course.status === "archived") {
    if (course.childCourseStatus === "pending") {
      return {
        label: "Bị gỡ xuống (Chờ duyệt sửa đổi)",
        color: "border-black text-black", // Gợi ý đổi màu để dễ phân biệt
      };
    }
    if (course.childCourseStatus === "rejected") {
      return {
        label: "Bị gỡ xuống (Bản sửa bị từ chối)",
        color: "border-black text-black",
      };
    }
    if (!isAdmin && (course.childCourseStatus === "draft" || course.hasDraft)) {
      return {
        label: "Bị gỡ xuống (Có bản nháp)",
        color: "border-black text-black",
      };
    }
    return { label: "Bị gỡ xuống", color: "border-black text-black" };
  }

  const statusMap = {
    draft: { label: "Nháp", color: "border-black text-black" },
    pending: { label: "Chờ duyệt", color: "border-black text-black" },
    rejected: { label: "Bị từ chối", color: "border-black text-black" },
  };

  return (
    statusMap[course.status as keyof typeof statusMap] || {
      label: course.status,
      color: "border-black text-black",
    }
  );
};
