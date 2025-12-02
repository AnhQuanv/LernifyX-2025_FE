import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface UserAvatarProps {
  fullName?: string;
  avatarUrl?: string | null;
  size?: number; // px
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  fullName = "User",
  avatarUrl,
  size = 64,
}) => {
  const initials = getInitials(fullName || "User");
  return (
    <Avatar style={{ width: size, height: size }}>
      {avatarUrl && avatarUrl.trim() !== "" && (
        <AvatarImage src={avatarUrl} alt={fullName} />
      )}
      <AvatarFallback className="bg-gradient-to-br from-violet-600 to-purple-600 text-white text-2xl font-bold flex items-center justify-center rounded-2xl">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
