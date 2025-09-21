// shared/sidebar-items.ts
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

export const adminItems = [
  { title: "Dashboard", url: "/admin", icon: Home, isActive: true },
  { title: "Courses", url: "/admin/courses", icon: Calendar },
  { title: "Users", url: "/admin/users", icon: Inbox },
  { title: "Settings", url: "/admin/settings", icon: Settings },
];

export const teacherItems = [
  { title: "My Courses", url: "/teacher/courses", icon: Home, isActive: true },
  { title: "Calendar", url: "/teacher/calendar", icon: Calendar },
  { title: "Messages", url: "/teacher/messages", icon: Inbox },
  { title: "Search", url: "/teacher/search", icon: Search },
];
