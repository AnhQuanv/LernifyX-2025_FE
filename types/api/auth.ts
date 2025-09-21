import { ApiResponse } from "./apiResponse";

export interface IUser {
  userId: string;
  email: string;
  fullName: string;
  roleName: string;
  phone: string;
  dateOfBirth: string;
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
}

export type AuthLoginResponse = ApiResponse<AuthLoginData>;
