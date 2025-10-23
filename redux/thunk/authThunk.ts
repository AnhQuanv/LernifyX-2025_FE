import { login } from "@/services/authService";
import { ApiError } from "@/types/api/apiResponse";
import { AuthLoginData } from "@/types/api/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const loginAsync = createAsyncThunk<
  AuthLoginData,
  { email: string; password: string },
  { rejectValue: ApiError }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await login(email, password);
    console.log("res thunk", res);
    return res.data as AuthLoginData;
  } catch (err: unknown) {
    const error = err as AxiosError<ApiError>;
    return rejectWithValue({
      message: error.response?.data?.message || "Đăng nhập thất bại",
      errorCode: error.response?.data?.errorCode,
    });
  }
});
