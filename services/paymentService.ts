import axiosClient from "@/lib/axios";
import { PurchaseHistoryParams } from "@/types/payment/payment";

export const handleCreatePayment = async (
  courseId: string[],
  gateway: string
) => {
  const res = await axiosClient.post(`payment`, {
    courseId,
    gateway,
  });

  return res.data.data;
};

export const handleFindByPayment = async (paymentId: string) => {
  const res = await axiosClient.get(`payment/${paymentId}`);
  return res.data.data;
};

export const handleGetPurchaseHistory = async (
  params?: PurchaseHistoryParams
) => {
  const res = await axiosClient.get("payment", {
    params: {
      status: params?.status || "all",
      page: params?.page || 1,
      limit: params?.limit || 6,
    },
  });
  return res.data.data;
};

export const handelGetTeacherPayments = async (year: string) => {
  const res = await axiosClient.get(`payment/teacher-payment?year=${year}`);
  return res.data.data;
};

export const handleGetSpecificPayments = async (
  courseId: string,
  startDate: string,
  endDate: string,
  teacherId?: string
) => {
  const params = {
    courseId: courseId,
    startDate: startDate,
    endDate: endDate,
    teacherId: teacherId,
  };

  const res = await axiosClient.get("payment/teacher-payment-course", {
    params,
  });

  return res.data.data;
};

export const handleGetMainStatsDashboardTeacher = async () => {
  const res = await axiosClient.get("payment/teacher-stats-dashboard");
  return res.data.data;
};

export const handleGetMainStatsDashboard = async (
  range: string,
  startDate?: string,
  endDate?: string
) => {
  const res = await axiosClient.get("payment/admin-stats-dashboard", {
    params: {
      range,
      startDate,
      endDate,
    },
  });
  return res.data.data;
};

export const handleGetTop10CoursesRevenue = async (
  range: string,
  startDate?: string,
  endDate?: string
) => {
  const res = await axiosClient.get("payment/admin-top-course-dashboard", {
    params: {
      range,
      startDate,
      endDate,
    },
  });
  return res.data.data;
};

export const handleGetTop10CategoriesRevenue = async (
  range: string,
  startDate?: string,
  endDate?: string
) => {
  const res = await axiosClient.get("payment/admin-top-category-dashboard", {
    params: {
      range,
      startDate,
      endDate,
    },
  });
  return res.data.data;
};
