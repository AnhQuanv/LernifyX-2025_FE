import { User } from "../user/user";

export interface Comment {
  id: string;
  content: string;
  rating?: number | null;
  type: "lesson" | "course";
  createdAt: string;
  updatedAt: string;
  user: User;
  replies: Comment[];
}

export interface CreateCommentDto {
  content: string;
  type: "lesson" | "course";
  targetId: string;
  parentId?: string | null;
  rating?: number;
}
