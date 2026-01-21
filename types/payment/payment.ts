import { Course } from "../course/course";

export interface Payment_items {
  id: string;
  price: number;
  course: Course;
}

export interface Payment {
  id: string;
  amount: string;
  currency: string;
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
  startDate?: string;
  endDate?: string;
  search?: string;
}

export interface PurchaseItem {
  id: string;
  courseId: string;
  title: string;
  price: number;
  instructor: string;
  image: string;
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
  customer?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
