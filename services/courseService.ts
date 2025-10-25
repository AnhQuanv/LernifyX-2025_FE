import axiosClient from "@/lib/axios";
import { filterCourseParams } from "@/types/course/course";

export const handleGetHomeCourses = async () => {
  const res = await axiosClient.get("course/home");
  console.log("Home courses fetched in service:", res.data.data);
  return res.data.data;
};

export const handleGetFilteredCourses = async ({
  params,
}: { params?: filterCourseParams } = {}) => {
  console.log("Fetching filtered courses with params:", params);
  const res = await axiosClient.get("course/filter", { params });
  console.log("Filtered courses fetched in service:", res.data.data);
  return res.data.data;
};
