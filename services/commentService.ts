import axiosClient from "@/lib/axios";
import { CreateCommentDto } from "@/types/comment/comment";

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

export const handleGetCommentsByLesson = async (
  lessonId: string,
  page = 1,
  limit = 5
) => {
  const res = await axiosClient.get(
    `/comment/lesson/${lessonId}?page=${page}&limit=${limit}`
  );
  return res.data.data;
};

export const handlePostComment = async (body: CreateCommentDto) => {
  const res = await axiosClient.post(`/comment/create`, body);
  return res.data.data;
};
