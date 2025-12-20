"use client";

import type React from "react";
import { Sidebar } from "@/components/teacher/sidebar";
import { TopNav } from "@/components/teacher/top-nav";

export default function LayoutTeacher({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden ">
        <TopNav />
        <main className="flex-1 overflow-auto bg-gradient-to-br bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}
