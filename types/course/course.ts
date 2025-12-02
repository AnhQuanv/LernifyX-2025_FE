import { Comment } from "../comment/comment";

export interface Course {
  id: string;
  title: string;
  description?: string;
  instructor: string;
  rating?: number;
  ratingCount?: number;
  students?: number;
  price: number;
  originalPrice: number | null;
  discount: number | null;
  level: string;
  duration?: string;
  category: string;
  discountExpiresAt: string | null;
  learnings?: string[];
  requirements?: string[];
  image: string;
  isInWishlist?: boolean;
  isInCart?: boolean;
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

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration: number;
  order: number;
  content: string;
  hasQuiz?: boolean;
  canViewVideo?: boolean;
  videoUrl?: string | null;
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
