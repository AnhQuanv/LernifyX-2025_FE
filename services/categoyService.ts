import axiosClient from "@/lib/axios";

export const handleGetAllCategories = async () => {
  const res = await axiosClient.get("category/all");
  return res.data.data;
};
