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

export const handelGetTeacherPayments = async () => {
  const res = await axiosClient.get("payment/teacher-payment");
  return res.data.data;
};

export const handleGetSpecificPayments = async (
  courseId: string,
  startDate: string,
  endDate: string
) => {
  const params = {
    courseId: courseId,
    startDate: startDate,
    endDate: endDate,
  };

  const res = await axiosClient.get("payment/teacher-payment-course", {
    params,
  });

  return res.data.data;
};
