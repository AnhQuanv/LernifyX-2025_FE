"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const RootPage = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (auth.user === null) {
      router.replace("/auth/login");
      return;
    }

    const { roleName, hasPreferences } = auth.user;

    if (roleName === "student") {
      if (!hasPreferences) {
        router.replace("/survey");
      } else {
        router.replace("/homepage");
      }
    } else if (roleName === "teacher") {
      router.replace("/teacher/dashboard");
    } else if (roleName === "admin") {
      router.replace("/admin/dashboard");
    }
  }, [auth.user, router]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
      <Loader className="w-12 h-12 animate-spin mb-4 text-primary" />
      <p className="text-gray-600 font-medium">Đang tải dữ liệu...</p>
    </div>
  );
};

export default RootPage;
