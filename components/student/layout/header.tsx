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
import {
  Heart,
  ShoppingCart,
  User,
  Bell,
  BookOpen,
  LogOut,
  Settings,
  Book,
  MessageSquare,
  UserCircle,
  CreditCard,
  HelpCircle,
  Globe,
  History,
  Clipboard,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";

const Header = ({ isAuthenticated = false }) => {
  const router = useRouter();
  return (
    <>
      <header className="bg-gradient-to-r from-violet-700 to-purple-600 text-white sticky top-0 left-0 w-full z-[1000] py-3">
        <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center bg-white rounded-full p-1.5 shadow-md">
              <BookOpen className="w-7 h-7 text-violet-600" />
            </div>
            <button
              className="font-extrabold text-white cursor-pointer bg-transparent border-none p-0 text-2xl lg:text-3xl"
              aria-label="Go to homepage"
            >
              LeanrifyX
            </button>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden sm:flex gap-5 md:gap-8">
            <button className="text-white text-lg font-semibold relative cursor-pointer">
              Home
              <span className="absolute -bottom-1 left-0 h-0.5 bg-white w-full" />
            </button>
            <button className="text-white text-lg hover:text-violet-100 relative group cursor-pointer">
              Course
              <span className="absolute -bottom-1 left-0 h-0.5 bg-white w-0 group-hover:w-full transition-all duration-300" />
            </button>
            <button className="text-white text-lg hover:text-violet-100 relative group cursor-pointer">
              Teacher
              <span className="absolute -bottom-1 left-0 h-0.5 bg-white w-0 group-hover:w-full transition-all duration-300" />
            </button>
            <button className="text-white text-lg hover:text-violet-100 relative group cursor-pointer">
              About
              <span className="absolute -bottom-1 left-0 h-0.5 bg-white w-0 group-hover:w-full transition-all duration-300" />
            </button>
          </nav>

          {/* Right actions */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2 md:space-x-3">
              {/* Notification Button */}
              <div className="relative group">
                <button
                  className="text-white flex items-center justify-center w-10 h-10 rounded-full bg-white/10 relative"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500">
                    5
                  </Badge>
                </button>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-300" />
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-white text-violet-700 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap font-medium pointer-events-none">
                  Notifications
                </span>
              </div>

              {/* Wishlist Button */}
              <div className="relative group">
                <button
                  className="text-white flex items-center justify-center w-10 h-10 rounded-full bg-white/10 relative"
                  aria-label="View wish list"
                >
                  <Heart className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500">
                    3
                  </Badge>
                </button>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-300" />
              </div>

              {/* Cart Button */}
              <div className="relative group">
                <button
                  className="text-white flex items-center justify-center w-10 h-10 rounded-full bg-white/10 relative"
                  aria-label="View shopping cart"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500">
                    2
                  </Badge>
                </button>
                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white scale-0 group-hover:scale-100 transition-transform duration-300" />
              </div>

              {/* User Dropdown */}
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="flex items-center justify-center ml-2 cursor-pointer group"
                      aria-label="View profile"
                    >
                      <div className="flex items-center space-x-1">
                        <Avatar className="h-9 w-9 rounded-xl ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-200">
                          <AvatarImage src={"/placeholder.svg"} alt={""} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-sm rounded-xl">
                            {getInitials("Anh Quan")}
                          </AvatarFallback>
                        </Avatar>
                        <ChevronDown className="w-4 h-4 text-white/80" />
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 rounded-xl shadow-xl border border-violet-100 p-1"
                  >
                    <DropdownMenuLabel className="h-16 gap-2 rounded-lg">
                      <div className="flex items-center gap-3 w-full mt-3">
                        <Avatar className="h-9 w-9 rounded-xl ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all duration-200">
                          <AvatarImage src={"/placeholder.svg"} alt={""} />
                          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold text-sm rounded-xl">
                            {getInitials("Anh Quan")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 text-left min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="truncate font-medium text-sm">
                              Võ Annh Quân
                            </span>
                          </div>
                          <span className="truncate text-xs text-muted-foreground">
                            anhquan@gmail.com
                          </span>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-violet-100" />

                    <DropdownMenuItem className="text-violet-800 hover:bg-violet-50 rounded-lg">
                      <Book className="w-4 h-4 text-violet-600 mr-2" />
                      My learning
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-violet-800 hover:bg-violet-50 rounded-lg">
                      <ShoppingCart className="w-4 h-4 text-violet-600 mr-2" />
                      <div className="flex items-center justify-between w-full">
                        <span>My cart</span>
                        <span className="bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          1
                        </span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-violet-800 hover:bg-violet-50 rounded-lg">
                      <Heart className="w-4 h-4 text-pink-500 mr-2" />
                      Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-violet-800 hover:bg-violet-50 rounded-lg">
                      <Clipboard className="w-4 h-4 text-violet-600 mr-2" />
                      Instructor dashboard
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-violet-100" />

                    <DropdownMenuItem className="text-violet-800 hover:bg-violet-50 rounded-lg">
                      <Bell className="w-4 h-4 text-violet-600 mr-2" />
                      <div className="flex items-center justify-between w-full">
                        <span>Notifications</span>
                        <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          5
                        </span>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-violet-800 hover:bg-violet-50 rounded-lg">
                      <MessageSquare className="w-4 h-4 text-violet-600 mr-2" />
                      Messages
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-violet-100" />

                    <DropdownMenuItem className="text-violet-800 hover:bg-violet-50 rounded-lg">
                      <Settings className="w-4 h-4 text-violet-600 mr-2" />
                      Account settings
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-violet-800 hover:bg-violet-50 rounded-lg">
                      <CreditCard className="w-4 h-4 text-violet-600 mr-2" />
                      Payment methods
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-violet-800 hover:bg-violet-50 rounded-lg">
                      <History className="w-4 h-4 text-violet-600 mr-2" />
                      Subscriptions
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-violet-800 hover:bg-violet-50 rounded-lg">
                      <CreditCard className="w-4 h-4 text-violet-600 mr-2" />
                      Credits
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-violet-800 hover:bg-violet-50 rounded-lg">
                      <History className="w-4 h-4 text-violet-600 mr-2" />
                      Purchase history
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-violet-100" />

                    <DropdownMenuItem className="text-violet-800 hover:bg-violet-50 rounded-lg">
                      <Globe className="w-4 h-4 text-violet-600 mr-2" />
                      <div className="flex justify-between w-full">
                        <span>Language</span>
                        <span className="text-gray-500 font-medium">
                          English
                        </span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-violet-100" />

                    <DropdownMenuItem className="text-violet-800 hover:bg-violet-50 rounded-lg">
                      <UserCircle className="w-4 h-4 text-violet-600 mr-2" />
                      Public profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-violet-800 hover:bg-violet-50 rounded-lg">
                      <User className="w-4 h-4 text-violet-600 mr-2" />
                      Edit profile
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="bg-violet-100" />

                    <DropdownMenuItem className="text-violet-800 hover:bg-violet-50 rounded-lg">
                      <HelpCircle className="w-4 h-4 text-violet-600 mr-2" />
                      Help and Support
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-500 hover:bg-red-50 rounded-lg mt-1">
                      <LogOut className="w-4 h-4 text-red-500 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-3 ml-4">
                  <button
                    className="text-white hover:text-violet-200 glass-effect hover:shadow-lg transition-all duration-300 hover-scale rounded-full px-6 py-2 font-medium cursor-pointer"
                    onClick={() => router.push("/auth/login")}
                  >
                    Sign In
                  </button>
                  <button
                    className="bg-white text-violet-600 hover:bg-violet-50 hover:shadow-xl transition-all duration-300 hover-scale rounded-full px-6 py-2 font-semibold cursor-pointer"
                    onClick={() => router.push("/auth/register")}
                  >
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
