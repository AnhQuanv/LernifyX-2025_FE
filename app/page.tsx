"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter } from "next/navigation";

const RootPage = () => {
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (!auth.user) {
      router.push("/homepage");
      return;
    }

    if (auth.user.roleName === "teacher") {
      router.push("/dashboard");
    } else if (auth.user.roleName === "student") {
      if (auth.user.hasPreferences) {
        router.push("/homepage");
      } else {
        router.push("/survey");
      }
    }
  }, [auth.user, router]);

  return <></>;
};

export default RootPage;
