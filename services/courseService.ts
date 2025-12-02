import axiosClient from "@/lib/axios";
import { filterCourseParams } from "@/types/course/course";

export const handleGetHomeCourses = async () => {
  const res = await axiosClient.get("course/home");
  return res.data.data;
};

export const handleGetFilteredCourses = async ({
  params,
}: { params?: filterCourseParams } = {}) => {
  const res = await axiosClient.get("course/filter", { params });
  return res.data.data;
};

export const handleGetDetailCourse = async (courseId: string) => {
  const res = await axiosClient.get("course/detail", { params: { courseId } });
  return res.data.data;
};

export const handleGetMyLearningCourses = async ({
  progressStatus,
  page,
  limit,
}: { progressStatus?: string; page?: number; limit?: number } = {}) => {
  const res = await axiosClient.get("course/my-learning", {
    params: { progressStatus, page, limit },
  });
  return res.data.data;
};

export const handleGetLessonDetail = async (
  courseId: string,
  lessonId: string
) => {
  const res = await axiosClient.get(`course/${courseId}/lesson/${lessonId}`, {
    params: { courseId, lessonId },
  });
  return res.data.data;
};

export const handleGetCourseRecommendation = async () => {
  const res = await axiosClient.get("user-preferences/recommendations");
  return res.data.data;
};
