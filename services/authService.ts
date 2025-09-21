import axiosClient from "@/lib/axios";
import { AuthLoginResponse, RegisterData } from "@/types/api/auth";

export const login = async (
  email: string,
  password: string
): Promise<AuthLoginResponse> => {
  const res = await axiosClient.post("auth/login", { email, password });
  return res.data;
};

export const register = async (data: RegisterData) => {
  const res = await axiosClient.post("auth/register", data);
  return res.data;
};

export const verifyEmail = async (email: string, codeId: number) => {
  const res = await axiosClient.post("auth/verify-email", { email, codeId });
  console.log("verify-email", res);
  return res.data;
};
