import { Comment } from "../comment/comment";

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
  learnings?: string[];
  requirements?: string[];
  image: string;
  isInWishlist: boolean;
  isInCart: boolean;
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

export interface Lesson {
  id: string;
  title: string;
  duration: number;
  videoUrl: string | null;
  comments?: Comment[];
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface CourseDetail extends Course {
  chapters: Chapter[];
  comments?: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
