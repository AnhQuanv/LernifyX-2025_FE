import {
  handleGetFilteredCourses,
  handleGetHomeCourses,
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
      console.log("Thunk fetching filtered courses with params:", params);
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
