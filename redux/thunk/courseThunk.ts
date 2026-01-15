import {
  handleGetCourseRecommendation,
  handleGetDetailCourse,
  handleGetFilteredCourses,
  handleGetHomeCourses,
  handleGetLessonDetail,
  handleGetLessonDetailForTeacher,
} from "@/services/courseService";
import { ApiError } from "@/types/api/apiResponse";
import { filterCourseParams } from "@/types/course/course";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const getFilterCourses = createAsyncThunk(
  "courses/getFilterCourses",
  async (
    { params }: { params?: filterCourseParams } = {},
    { rejectWithValue }
  ) => {
    try {
      const res = await handleGetFilteredCourses({ params });
      return res;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message: error.response?.data?.message || "Lấy khóa học thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  }
);

export const getHomeCourses = createAsyncThunk(
  "courses/getHomeCourses",
  async (_, { rejectWithValue }) => {
    try {
      const res = await handleGetHomeCourses();
      return res;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message: error.response?.data?.message || "Lấy danh mục thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  }
);

export const getCourseRecommendation = createAsyncThunk(
  "courses/getCourseRecommendation",
  async (_, { rejectWithValue }) => {
    try {
      const res = await handleGetCourseRecommendation();
      return res;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message: error.response?.data?.message || "Lấy gợi ý khóa học thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  }
);

export const getDetailCourse = createAsyncThunk(
  "courses/getDetailCourse",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const res = await handleGetDetailCourse(courseId);
      return res;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message:
          error.response?.data?.message || "Lấy chi tiết khóa học thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  }
);

export const getLessonDetail = createAsyncThunk(
  "courses/getLessonDetail",
  async (
    params: { courseId: string; lessonId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await handleGetLessonDetail(params.courseId, params.lessonId);
      return res;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message:
          error.response?.data?.message || "Lấy chi tiết bài học thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  }
);

export const getLessonDetailForTeacher = createAsyncThunk(
  "courses/getLessonDetail",
  async (
    params: { courseId: string; lessonId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await handleGetLessonDetailForTeacher(
        params.courseId,
        params.lessonId
      );
      return res;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message:
          error.response?.data?.message || "Lấy chi tiết bài học thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  }
);
