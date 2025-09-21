"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type NavItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
};

export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup className="px-2">
      <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
        Navigation
      </SidebarGroupLabel>
      <SidebarMenu className="space-y-1">
        {items.map((item) => (
          <SidebarMenuItem key={item.title}>
            <Link href={item.url} className="block">
              <SidebarMenuButton
                tooltip={item.title}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  "hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5",
                  "hover:shadow-sm hover:scale-[1.02]",
                  item.isActive && [
                    "bg-gradient-to-r from-primary/15 to-primary/10",
                    "text-primary font-medium shadow-sm",
                    "border border-primary/20",
                  ]
                )}
              >
                {item.icon && (
                  <item.icon
                    className={cn(
                      "w-4 h-4 transition-all duration-200",
                      "group-hover:scale-110",
                      item.isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                )}
                <span
                  className={cn(
                    "text-sm transition-colors duration-200",
                    item.isActive
                      ? "text-primary font-medium"
                      : "text-foreground"
                  )}
                >
                  {item.title}
                </span>
                {item.isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                )}
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
