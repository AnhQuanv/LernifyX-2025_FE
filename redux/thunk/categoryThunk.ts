import { handleGetAllCategories } from "@/services/categoyService";
import { ApiError } from "@/types/api/apiResponse";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const getAllCategories = createAsyncThunk(
  "category/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await handleGetAllCategories();
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
