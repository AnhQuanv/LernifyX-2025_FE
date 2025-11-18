import axiosClient from "@/lib/axios";

export const handleGetUserCart = async (page = 1, limit = 6) => {
  const res = await axiosClient.get(`cart-item`, {
    params: { page, limit },
  });
  return res.data.data;
};

export const handleAddToCart = async (courseId: string) => {
  const res = await axiosClient.post(`cart-item/${courseId}`);
  return res.data.data;
};

export const handleRemoveFromCart = async (courseId: string) => {
  const res = await axiosClient.delete(`cart-item/${courseId}`);
  return res.data.data;
};
