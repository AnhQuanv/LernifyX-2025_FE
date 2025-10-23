import axiosClient from "@/lib/axios";
import { ApiError } from "@/types/api/apiResponse";
import { filterCourseParams } from "@/types/course/course";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const getAllCourses = createAsyncThunk(
  "courses/getAllCourses",
  async (
    { params }: { params?: filterCourseParams } = {},
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosClient.get("/course/filter", { params });
      console.log("Courses fetched in thunk:", res.data.data);
      return res.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message: error.response?.data?.message || "Lấy danh mục thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  }
);
