import axiosClient from "@/lib/axios";

export const handleGetCommentsByCourse = async (
  courseId: string,
  page = 1,
  limit = 5
) => {
  const res = await axiosClient.get(
    `/comment/course/${courseId}?page=${page}&limit=${limit}`
  );
  return res.data.data;
};
