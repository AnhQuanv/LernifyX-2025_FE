import axiosClient from "@/lib/axios";

export const handleGetUserWishlist = async (page = 1, limit = 6) => {
  const res = await axiosClient.get(`wishlist`, {
    params: { page, limit },
  });
  return res.data.data;
};

export const handleAddToWishlist = async (courseId: string) => {
  const res = await axiosClient.post(`wishlist/${courseId}`);
  return res.data.data;
};

export const handleRemoveFromWishlist = async (courseId: string) => {
  const res = await axiosClient.delete(`wishlist/${courseId}`);
  return res.data.data;
};
