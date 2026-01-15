import { ApiResponse } from "./apiResponse";

export interface IUser {
  userId: string;
  email: string;
  fullName: string;
  roleName: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  avatar?: string;
  hasPreferences?: boolean;
  isActive?: boolean;
  bio?: string;
  description?: string;
  password?: string;
  createdAt?: string;
}

export interface AuthLoginData {
  accessToken: string;
  user: IUser;
}

export interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  address: string;
  phone: string;
  dateOfBirth: string;
  roleName: string;
  bio?: string;
  description?: string;
}

export interface UpdateProfileDto {
  userId?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  address?: string;
  avatar?: string;
  adminPassword?: string;
}

export interface UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
}

export interface ResetPasswordDto {
  email: string;
  codeId: number;
  newPassword: string;
  confirmPassword: string;
}

export interface CreateUserPreferenceDto {
  mainCategoryIds: string[];
  desiredLevels: string[];
  learningGoals: string[];
  interestedSkills: string[];
}

export type AuthLoginResponse = ApiResponse<AuthLoginData>;
