import { User } from "@/types/user";

export function getCurrentUser(): User {
  return {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    avatarUrl: "/avatar-admin.png",
    roleName: "admin",
  };
}
