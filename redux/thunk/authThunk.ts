import { login } from "@/services/authService";
import { AuthLoginData } from "@/types/api/auth";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const loginAsync = createAsyncThunk<
  AuthLoginData, // ✅ kiểu payload khi fulfilled
  { email: string; password: string }, // ✅ kiểu tham số truyền vào
  { rejectValue: string } // ✅ kiểu khi reject
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await login(email, password);
    console.log("res thunk", res);

    return res.data as AuthLoginData;
  } catch (err: unknown) {
    const error = err as AxiosError<{ message?: string }>;
    return rejectWithValue(
      error.response?.data?.message || "Đăng nhập thất bại"
    );
  }
});
