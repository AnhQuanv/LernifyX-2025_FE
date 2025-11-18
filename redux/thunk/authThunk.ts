import {
  handleUpdateAvatar,
  handleUpdateProfile,
  login,
} from "@/services/authService";
import { ApiError } from "@/types/api/apiResponse";
import { AuthLoginData, IUser, UpdateProfileDto } from "@/types/api/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const loginAsync = createAsyncThunk<
  AuthLoginData,
  { email: string; password: string },
  { rejectValue: ApiError }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await login(email, password);
    return res.data as AuthLoginData;
  } catch (err: unknown) {
    const error = err as AxiosError<ApiError>;
    return rejectWithValue({
      message: error.response?.data?.message || "Đăng nhập thất bại",
      errorCode: error.response?.data?.errorCode,
    });
  }
});

export const updateProfile = createAsyncThunk<IUser, UpdateProfileDto>(
  "auth/updateProfile",
  async (dto, { rejectWithValue }) => {
    try {
      const response = await handleUpdateProfile(dto);
      return response as IUser;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message: error.response?.data?.message || "Cập nhật profile thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  }
);

export const updateAvatar = createAsyncThunk<IUser, File>(
  "auth/updateAvatar",
  async (file, { rejectWithValue }) => {
    try {
      const avatarUrl = await handleUpdateAvatar(file);

      return avatarUrl as IUser;
    } catch (err: unknown) {
      const error = err as AxiosError<ApiError>;
      return rejectWithValue({
        message: error.response?.data?.message || "Cập nhật avatar thất bại",
        errorCode: error.response?.data?.errorCode,
      });
    }
  }
);
