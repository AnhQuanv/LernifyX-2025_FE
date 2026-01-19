import { IUser } from "../api/auth";
import { Course } from "../course/course";

export interface User {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  roleName: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  description?: string;
  bio?: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface UserWithProgress extends IUser {
  course: Course[];
  isDisabled?: boolean;
}
