"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Book,
  Users,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { logout } from "@/redux/features/auth/authSlice";

export function Sidebar() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.auth.user);
  const role = user?.roleName;

  const teacherMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/teacher/dashboard" },
    { icon: BookOpen, label: "Khóa Học", href: "/teacher/course" },
    { icon: BarChart3, label: "Thống Kê", href: "/teacher/analytics" },
    { icon: User, label: "Chỉnh sửa hồ sơ", href: "/teacher/profile" },
    { icon: Settings, label: "Cài Đặt", href: "/teacher/setting" },
  ];

  const adminMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
    { icon: Users, label: "Quản lý tài khoản", href: "/admin/students" },
    { icon: BookOpen, label: "Quản lý khóa học", href: "/admin/courses" },
    { icon: BarChart3, label: "Thống Kê", href: "/admin/analytics" },
    { icon: BarChart3, label: "Lịch sử giao dịch", href: "/admin/history" },
    { icon: User, label: "Chỉnh sửa hồ sơ", href: "/admin/profile" },
    { icon: Settings, label: "Cài Đặt", href: "/admin/setting" },
  ];

  const menuItems = role === "admin" ? adminMenuItems : teacherMenuItems;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + "/");

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/login");
  };
  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-primary text-primary-foreground p-2 rounded-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <div
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }  pt-0.75 fixed md:relative md:translate-x-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground transition-transform duration-300 ease-in-out flex flex-col`}
      >
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Book className="w-7 h-7 text-violet-600" />
            <div>
              <h2 className="font-bold text-3xl">LearnifyX</h2>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.label} href={item.href}>
              <button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${
                  isActive(item.href)
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/20"
                }`}
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-2">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent/20 transition-colors cursor-pointer"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span className="font-medium">Đăng Xuất</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
