"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";
import { AppDispatch, RootState } from "@/redux/store";
import {
  Heart,
  ShoppingCart,
  User,
  Book,
  LogOut,
  HelpCircle,
  Globe,
  History,
  ChevronDown,
  Settings,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/features/auth/authSlice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { WishlistPopover } from "@/components/ui/wishlist-popover";
import { CartPopover } from "@/components/ui/cart-popover";
import { useEffect, useState } from "react";
import { getUserAllWishlist } from "@/redux/thunk/wishlistThunk";
import { getUserAllCart } from "@/redux/thunk/cartThunk";

type DropdownItemType =
  | {
      type: "item";
      label: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      icon: any;
      path?: string;
      count?: number;
      right?: string;
    }
  | { type: "separator" };

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/auth/login");
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist.allCourses
  );
  const cartItems = useSelector((state: RootState) => state.cart.allCourses);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/auth/login");
  };

  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const navItems = [
    { label: "Trang chủ", href: "/homepage" },
    { label: "Khóa học", href: "/courses" },
    { label: "Giảng viên", href: "/teachers" },
  ];

  const dropdownItems: DropdownItemType[] = [
    {
      type: "item",
      label: "Khóa học của tôi",
      icon: Book,
      path: "/my-learning",
    },
    {
      type: "item",
      label: "Giỏ hàng",
      icon: ShoppingCart,
      path: "/cart",
      count: cartItems.length,
    },
    {
      type: "item",
      label: "Yêu thích",
      icon: Heart,
      path: "/wishlist",
      count: wishlistItems.length,
    },
    {
      type: "item",
      label: "Cài đặt tài khoản",
      icon: Settings,
      path: "/account/settings",
    },
    {
      type: "item",
      label: "Lịch sử mua hàng",
      icon: History,
      path: "/checkout/history",
    },
    {
      type: "item",
      label: "Chỉnh sửa hồ sơ",
      icon: User,
      path: "/account/edit",
    },
  ];

  useEffect(() => {
    if (isAuthenticated && user?.roleName === "student") {
      dispatch(getUserAllWishlist({ page: 1, limit: 100 }));
      dispatch(getUserAllCart({ page: 1, limit: 100 }));
    }
  }, [isAuthenticated, user, dispatch]);

  return (
    <header className="bg-linear-to-r from-violet-700 to-purple-600 text-white sticky top-0 w-full z-1000 py-3">
      <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push("/homepage")}
        >
          <div className="flex items-center justify-center bg-white rounded-full p-1.5 shadow-md">
            <Book className="w-7 h-7 text-violet-600" />
          </div>
          <span className="font-extrabold text-white text-2xl lg:text-3xl">
            LearnifyX
          </span>
        </div>

        {/* Nav links */}
        <nav className="hidden sm:flex gap-6">
          {navItems.map((item) => (
            <button
              key={item.href}
              onClick={() => router.push(item.href)}
              className="text-white text-lg hover:text-violet-100 relative group cursor-pointer transition-colors"
            >
              {item.label}
              <span className="absolute -bottom-1 left-0 h-0.5 bg-white w-0 group-hover:w-full transition-all duration-300" />
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Wishlist */}
          <Popover open={wishlistOpen} onOpenChange={setWishlistOpen}>
            <PopoverTrigger asChild>
              <button
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 cursor-pointer"
                onMouseEnter={() => setWishlistOpen(true)}
                onMouseLeave={() => setWishlistOpen(false)}
              >
                <Heart className="w-5 h-5" />
                {wishlistItems.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 flex items-center justify-center rounded-full text-xs">
                    {wishlistItems.length}
                  </Badge>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="center"
              className="p-0 border-0 shadow-lg"
              onMouseEnter={() => setWishlistOpen(true)}
              onMouseLeave={() => setWishlistOpen(false)}
            >
              <WishlistPopover />
            </PopoverContent>
          </Popover>

          {/* Cart */}
          <Popover open={cartOpen} onOpenChange={setCartOpen}>
            <PopoverTrigger asChild>
              <button
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20  cursor-pointer"
                onMouseEnter={() => setCartOpen(true)}
                onMouseLeave={() => setCartOpen(false)}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItems.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 bg-red-500 w-5 h-5 flex items-center justify-center rounded-full text-xs">
                    {cartItems.length}
                  </Badge>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="center"
              className="p-0 border-0 shadow-lg"
              onMouseEnter={() => setCartOpen(true)}
              onMouseLeave={() => setCartOpen(false)}
            >
              <CartPopover />
            </PopoverContent>
          </Popover>

          {/* Profile dropdown */}
          {isAuthenticated && !isAuthPage ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-1 group">
                  <Avatar className="h-9 w-9 rounded-xl ring-2 ring-violet-100 shadow-md  cursor-pointer">
                    <AvatarImage
                      src={user?.avatar}
                      alt={user?.fullName || "User avatar"}
                    />
                    <AvatarFallback className="bg-linear-to-br from-violet-600 to-purple-600 text-white font-semibold text-sm rounded-xl">
                      {getInitials(user?.fullName || "User")}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="w-4 h-4 text-white/80" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-64 rounded-xl shadow-xl border border-violet-100 p-1"
              >
                <DropdownMenuLabel>
                  <div className="flex items-center gap-3 mt-3">
                    <Avatar className="h-9 w-9 rounded-xl ring-2 ring-violet-100 shadow-md">
                      <AvatarImage
                        src={user?.avatar}
                        alt={user?.fullName || "User avatar"}
                      />
                      <AvatarFallback className="bg-linear-to-br from-violet-600 to-purple-600 text-white font-semibold text-sm rounded-xl">
                        {getInitials(user?.fullName || "User")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {user?.fullName || "Người dùng"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user?.email || "unknown@gmail.com"}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator className="bg-violet-100" />

                {dropdownItems.map((item, i) =>
                  item.type === "separator" ? (
                    <DropdownMenuSeparator
                      key={`sep-${i}`}
                      className="bg-violet-100"
                    />
                  ) : (
                    <DropdownMenuItem
                      key={item.label}
                      onClick={() =>
                        item.path ? router.push(item.path) : undefined
                      }
                      className="text-violet-800 hover:bg-violet-50 rounded-lg cursor-pointer"
                    >
                      <item.icon className="w-4 h-4 text-violet-600 mr-2" />
                      <div className="flex items-center justify-between w-full">
                        <span>{item.label}</span>
                        {item.count ? (
                          <span className="bg-linear-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {item.count}
                          </span>
                        ) : item.right ? (
                          <span className="text-gray-500 text-xs font-medium">
                            {item.right}
                          </span>
                        ) : null}
                      </div>
                    </DropdownMenuItem>
                  )
                )}

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-500 hover:bg-red-50 rounded-lg mt-1 cursor-pointer"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-3 ml-4">
              <button
                onClick={() => router.push("/auth/login")}
                className="text-white hover:text-violet-200 px-6 py-2 font-medium cursor-pointer"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => router.push("/auth/register")}
                className="bg-white text-violet-600 hover:bg-violet-50 px-6 py-2 font-semibold rounded-full cursor-pointer"
              >
                Đăng ký
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
