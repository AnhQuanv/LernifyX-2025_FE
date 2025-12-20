import { Comment } from "../comment/comment";

export interface Course {
  id: string;
  title: string;
  description?: string;
  instructor: string;
  rating?: number;
  ratingCount?: number;
  students?: number;
  price: number | null;
  originalPrice: number;
  discount: number | null;
  level: "Cơ Bản" | "Trung Cấp" | "Nâng Cao";
  duration?: number | null;
  category: string;
  discountExpiresAt: string | null;
  learnings?: string[];
  requirements?: string[];
  image: string;
  isInWishlist?: boolean;
  isInCart?: boolean;
  status?: "published" | "draft" | "pending" | "rejected";
  revenue?: string;
  createdAt?: string;
  lessons?: number;
  progress?: number;
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

export interface filterTeacherCourseParams {
  status?: string;
  search?: string;
  sortBy?: "a-z" | "z-a" | "newest" | "oldest";
  page?: number;
  limit?: number;
}

export interface Lesson_Note {
  id: string;
  text: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Progress_Lesson {
  id: string;
  completed: boolean;
  lastPosition: number;
  notes?: Lesson_Note[];
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionId: string;
  order?: number;
}

export interface VideoAsset {
  id: string;
  originalUrl: string;
  duration: number;
  widthOriginal: number;
  heightOriginal: number;
}
export interface Lesson {
  id: string;
  title: string;
  duration: number;
  order: number;
  content: string;
  hasQuiz?: boolean;
  canViewVideo?: boolean;
  videoAsset?: VideoAsset | null;
  progress?: Progress_Lesson;
  quiz?: QuizQuestion[];
}

export interface Chapter {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface CourseDetail extends Course {
  isPurchased?: boolean;
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

export interface CreateCourseDto {
  title: string;
  description: string;
  requirements: string[];
  learnings: string[];
  category: string;
  level: string;
  originalPrice: string;
  hasDiscount: boolean;
  price: string;
  discountExpiresAt: string;
  status: string;
  image?: string;
}

export interface UpdateCourseDto extends CreateCourseDto {
  id: string;
}

export type ProgressCallback = (progress: number) => void;
export interface VideoUploadData {
  id: string;
  publicId: string;
  url_720p: string;
  url_480p: string;
  url_360p: string;
  duration: number;
  widthOriginal: number;
  heightOriginal: number;
}
