export interface Course {
  id: string;
  title: string;
  description?: string;
  instructor: string;
  rating: number;
  students: number;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  level: string;
  duration: number;
  category: string;
  discountExpiresAt: string | null;
  image: string;
}

export interface filterCourseParams {
  category?: string;
  level?: string;
  rating?: string;
  sortBy?: "a-z" | "z-a" | "price_asc" | "price_desc";
  page?: number;
  limit?: number;
  search?: string;
}
