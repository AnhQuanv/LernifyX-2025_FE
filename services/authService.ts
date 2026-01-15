import axiosClient from "@/lib/axios";
import {
  AuthLoginResponse,
  CreateUserPreferenceDto,
  RegisterData,
  ResetPasswordDto,
  UpdatePasswordDto,
  UpdateProfileDto,
} from "@/types/api/auth";

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
  return res.data;
};

export const handleUpdateProfile = async (dto: UpdateProfileDto) => {
  const res = await axiosClient.put("/profile/edit", dto);
  return res.data.data;
};

export const handleUpdateAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axiosClient.post("cloudinary/imageAvatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
};

export const handleChangePassword = async (dto: UpdatePasswordDto) => {
  const res = await axiosClient.put("/profile/change-password", dto);
  return res.data;
};

export const handlePasswordForget = async (email: string) => {
  const res = await axiosClient.put("/auth/forget-password", { email });
  return res.data;
};

export const handleResetPassword = async (dto: ResetPasswordDto) => {
  const res = await axiosClient.put("/auth/reset-password", dto);
  return res.data;
};

export const handleSendVerifyMail = async (email: string) => {
  const res = await axiosClient.post("/auth/send-verify-email", { email });
  return res.data;
};

export const handlecreatePreference = async (dto: CreateUserPreferenceDto) => {
  const res = await axiosClient.post("/user-preferences/create", dto);
  return res.data;
};

export const handleGetStudentsCourseProgress = async ({
  limit,
  page,
  search,
  role,
}: {
  limit?: number;
  page?: number;
  search?: string;
  role?: string;
}) => {
  const res = await axiosClient.get("/profile/admin-student", {
    params: { limit, page, search, role },
  });
  return res.data.data;
};

export const handleDeleteUser = async (userId: string) => {
  const res = await axiosClient.delete("/profile/delete", {
    params: {
      userId,
    },
  });

  return res.data;
};
