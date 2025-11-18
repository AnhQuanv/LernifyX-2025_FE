import {
  handleAddToCart,
  handleGetUserCart,
  handleRemoveFromCart,
} from "@/services/cartService";
import { ApiError } from "@/types/api/apiResponse";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const getUserCart = createAsyncThunk(
  "cart/getUserCart",
  async (
    { page = 1, limit = 6 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await handleGetUserCart(page, limit);
      return res;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "Lấy danh sách khóa học giỏ hàng thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  }
);

export const getUserAllCart = createAsyncThunk(
  "cart/getUserAllCart",
  async (
    { page = 1, limit = 100 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await handleGetUserCart(page, limit);
      return res;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "Lấy danh sách khóa học giỏ hàng thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const res = await handleAddToCart(courseId);
      return res;
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message: error.response?.data?.message || "Thêm vào cart thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const res = await handleRemoveFromCart(courseId);
      return res;
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message: error.response?.data?.message || "Xóa khỏi cart thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  }
);
