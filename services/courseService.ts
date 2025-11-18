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
