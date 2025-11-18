import { Course } from "../course/course";

export interface Payment_items {
  id: string;
  price: number;
  course: Course;
}

export interface Payment {
  id: string;
  amount: string;
  status: string;
  gateway: string;
  transaction_ref: string;
  paid_at: string;
  bankCode: string;
  items: Payment_items[];
  order_info?: string;
  message?: string;
}

export interface PurchaseHistoryParams {
  status?: "all" | "success" | "pending" | "failed";
  page?: number;
  limit?: number;
}

export interface PurchaseItem {
  id: string;
  courseId: string;
  title: string;
  price: number;
  instructor: string;
}

export interface Purchase {
  id: string;
  transactionRef: string;
  amount: number;
  currency: string;
  status: "success" | "pending" | "failed";
  gateway: string;
  items: PurchaseItem[];
  paidAt?: Date;
  createdAt: Date;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
