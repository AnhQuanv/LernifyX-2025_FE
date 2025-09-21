"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { User } from "@/types/user";
import { adminItems, teacherItems } from "../shared/sidebar-items";
import { LogOut } from "lucide-react";
import { NavUser } from "./nav-user";
import { NavMain } from "./nav-main";

export function AppSidebar({ user }: { user: User }) {
  return (
    <Sidebar className="h-screen" collapsible="icon">
      <SidebarHeader>
        <NavUser user={user} />
      </SidebarHeader>
      <SidebarContent>
        {user.roleName === "admin" && <NavMain items={adminItems} />}
        {user.roleName === "teacher" && <NavMain items={teacherItems} />}
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter className="flex items-center justify-center p-4 border-t">
        <SidebarMenuButton className="flex items-center gap-2 text-destructive hover:text-destructive/80 transition">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </SidebarMenuButton>
      </SidebarFooter>
    </Sidebar>
  );
}
