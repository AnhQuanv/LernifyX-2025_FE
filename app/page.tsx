"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";
import { Loader } from "lucide-react";

const RootPage = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!auth.user) {
      return;
    }

    const { roleName, hasPreferences } = auth.user;
    setIsRedirecting(true);
    if (roleName === "student") {
      const hasPref = Boolean(hasPreferences);
      if (hasPref === false) {
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
      <Loader className="w-12 h-12  animate-spin mx-auto mb-4" />
      <p className="text-black-600">Đang tải dữ liệu...</p>
    </div>
  );
};

export default RootPage;
