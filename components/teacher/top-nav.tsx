"use client";

import { getInitials } from "@/lib/utils";
import { RootState } from "@/redux/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
import { useSelector } from "react-redux";

export function TopNav() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="bg-card border-b border-border h-22 flex items-center justify-between px-8">
      {/* Search */}
      <div className="flex-1 max-w-lg">
        <div className="flex items-center gap-3 bg-input rounded-xl px-5 py-3">
          <Search size={20} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm khóa học hoặc học sinh..."
            className="bg-transparent outline-none text-foreground placeholder-muted-foreground flex-1 text-base"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-4 ml-8">
        <Avatar className="h-12 w-12 rounded-2xl ring-2 ring-violet-200 shadow-lg">
          <AvatarImage
            src={user?.avatar}
            alt={user?.fullName || "User avatar"}
          />
          <AvatarFallback className="bg-gradient-to-br from-violet-600 to-purple-600 text-white font-bold text-lg rounded-2xl">
            {getInitials(user?.fullName || "Võ Anh Quân")}
          </AvatarFallback>
        </Avatar>

        <div className="leading-tight">
          <p className="font-semibold text-base">
            {user?.fullName || "Võ Anh Quân"}
          </p>
          <p className="text-sm text-muted-foreground">
            {user?.email || "banhkute200@gmail.com"}
          </p>
        </div>
      </div>
    </div>
  );
}
