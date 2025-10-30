import { User } from "../user/user";

export interface Comment {
  id: string;
  content: string;
  rating: number;
  createdAt: string;
  user: User;
}