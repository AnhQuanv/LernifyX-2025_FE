import {
  handleCreatePayment,
  handleFindByPayment,
} from "@/services/paymentService";
import { ApiError } from "@/types/api/apiResponse";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const findByPayment = createAsyncThunk(
  "payment/findByPayment",
  async (paymentId: string, { rejectWithValue }) => {
    try {
      const res = await handleFindByPayment(paymentId);
      return res;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message: error.response?.data?.message || "Lấy hóa đơn thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  }
);

export const createPayment = createAsyncThunk(
  "payment/createPayment",
  async (
    { courseId, gateway }: { courseId: string[]; gateway: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await handleCreatePayment(courseId, gateway);
      return res;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message: error.response?.data?.message || "Lấy url payment thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  }
);
