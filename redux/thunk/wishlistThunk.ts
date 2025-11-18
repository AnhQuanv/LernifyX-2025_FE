import {
  handleAddToWishlist,
  handleGetUserWishlist,
  handleRemoveFromWishlist,
} from "@/services/wishlistService";
import { ApiError } from "@/types/api/apiResponse";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const getUserWishlist = createAsyncThunk(
  "wishlist/getUserWishlist",
  async (
    { page = 1, limit = 6 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await handleGetUserWishlist(page, limit);
      return res;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "Lấy danh sách khóa học yêu thích thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  }
);

export const getUserAllWishlist = createAsyncThunk(
  "wishlist/getUserAllWishlist",
  async (
    { page = 1, limit = 100 }: { page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await handleGetUserWishlist(page, limit);
      return res;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message:
          error.response?.data?.message ||
          "Lấy danh sách khóa học yêu thích thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/addToWishlist",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const res = await handleAddToWishlist(courseId);
      return res;
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message: error.response?.data?.message || "Thêm vào wishlist thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (courseId: string, { rejectWithValue }) => {
    try {
      const res = await handleRemoveFromWishlist(courseId);
      return res;
    } catch (err) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message: error.response?.data?.message || "Xóa khỏi wishlist thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  }
);
