"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { getInitials } from "@/lib/utils";
import type { User } from "@/types/user";
import { Badge } from "@/components/ui/badge";
import { UserIcon, Settings, HelpCircle, ChevronUp } from "lucide-react";

export function NavUser({ user }: { user: User }) {
  const roleColor =
    user.roleName === "admin"
      ? "bg-amber-100 text-amber-800"
      : "bg-blue-100 text-blue-800";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-gradient-to-r hover:from-primary/5 hover:to-primary/10 transition-all duration-200 group"
            >
              <div className="flex items-center gap-3 w-full">
                <Avatar className="h-9 w-9 rounded-xl ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-200">
                  <AvatarImage
                    src={user.avatarUrl || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-sm rounded-xl">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="truncate font-medium text-sm">
                      {user.name}
                    </span>
                    <Badge
                      variant="secondary"
                      className={`text-xs px-1.5 py-0.5 ${roleColor}`}
                    >
                      {user.roleName}
                    </Badge>
                  </div>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
                <ChevronUp className="w-4 h-4 text-muted-foreground group-data-[state=open]:rotate-180 transition-transform duration-200" />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 p-2" align="start" side="right">
            <DropdownMenuLabel className="p-2">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage
                    src={user.avatarUrl || "/placeholder.svg"}
                    alt={user.name}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-xs rounded-lg">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <UserIcon className="w-4 h-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <Settings className="w-4 h-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 cursor-pointer">
              <HelpCircle className="w-4 h-4" />
              Help & Support
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
