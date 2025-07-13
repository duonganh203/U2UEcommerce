"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
   Bell,
   Search,
   Settings,
   LogOut,
   User,
   Home,
   Menu,
   X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { ModeToggle } from "./ModeToggle";

interface AdminNavbarProps {
   onMenuToggle?: () => void;
   title?: string;
}

export default function AdminNavbar({
   onMenuToggle,
   title = "Admin Dashboard",
}: AdminNavbarProps) {
   const { data: session } = useSession();
   const [isSearchFocused, setIsSearchFocused] = useState(false);

   return (
      <nav className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
         <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
               {/* Left side - Menu toggle and title */}
               <div className="flex items-center space-x-4">
                  {/* Mobile menu toggle */}
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={onMenuToggle}
                     className="lg:hidden p-2"
                  >
                     <Menu className="h-5 w-5" />
                  </Button>

                  {/* Title */}
                  <div className="flex items-center">
                     <h1 className="text-xl font-semibold text-gray-900 dark:text-white hidden sm:block">
                        {title}
                     </h1>
                     <h1 className="text-lg font-semibold text-gray-900 dark:text-white sm:hidden">
                        Admin
                     </h1>
                  </div>
               </div>

               {/* Center - Search bar */}
               <div className="hidden md:flex flex-1 max-w-lg mx-8">
                  <div className="relative w-full">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                     </div>
                     <input
                        type="text"
                        placeholder="Search users, products, orders..."
                        className={`block w-full pl-10 pr-3 py-2 border rounded-lg leading-5 bg-white dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-all duration-200 ${
                           isSearchFocused
                              ? "border-blue-500 shadow-sm"
                              : "border-gray-300 dark:border-gray-600"
                        }`}
                        onFocus={() => setIsSearchFocused(true)}
                        onBlur={() => setIsSearchFocused(false)}
                     />
                  </div>
               </div>

               {/* Right side - Actions and user menu */}
               <div className="flex items-center space-x-3">
                  {/* Back to store link */}
                  <Link href="/">
                     <Button
                        variant="ghost"
                        size="sm"
                        className="hidden sm:flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                     >
                        <Home className="h-4 w-4" />
                        <span className="hidden lg:inline">Store</span>
                     </Button>
                  </Link>

                  {/* Notifications */}
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button
                           variant="ghost"
                           size="sm"
                           className="relative p-2"
                        >
                           <Bell className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                           {/* Notification badge */}
                           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                              3
                           </span>
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel>Thông báo</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <div className="max-h-64 overflow-y-auto">
                           <DropdownMenuItem className="p-3 border-b">
                              <div className="flex flex-col space-y-1">
                                 <p className="text-sm font-medium">
                                     Đã nhận đơn hàng mới
                                 </p>
                                 <p className="text-xs text-gray-500">
                                    Đơn hàng #12345 - $299.99
                                 </p>
                                 <p className="text-xs text-gray-400">
                                    2 phút trước
                                 </p>
                              </div>
                           </DropdownMenuItem>
                           <DropdownMenuItem className="p-3 border-b">
                              <div className="flex flex-col space-y-1">
                                 <p className="text-sm font-medium">
                                    Cần phê duyệt sản phẩm
                                 </p>
                                 <p className="text-xs text-gray-500">
                                    Wireless Headphones by John D.
                                 </p>
                                 <p className="text-xs text-gray-400">
                                    1 hour ago
                                 </p>
                              </div>
                           </DropdownMenuItem>
                           <DropdownMenuItem className="p-3">
                              <div className="flex flex-col space-y-1">
                                 <p className="text-sm font-medium">
                                    Người dùng mới đã đăng ký
                                 </p>
                                 <p className="text-xs text-gray-500">
                                    sarah.johnson@example.com
                                 </p>
                                 <p className="text-xs text-gray-400">
                                    3h trước
                                 </p>
                              </div>
                           </DropdownMenuItem>
                        </div>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-center text-blue-600 hover:text-blue-700">
                           Xem tất cả thông báo
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Theme toggle */}
                  <ModeToggle />

                  {/* Settings */}
                  <Link href="/admin/settings">
                     <Button variant="ghost" size="sm" className="p-2">
                        <Settings className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                     </Button>
                  </Link>

                  {/* User dropdown */}
                  {session && (
                     <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                           <Button
                              variant="ghost"
                              className="relative h-8 w-8 rounded-full hover:ring-2 hover:ring-blue-500 transition-all"
                           >
                              <Avatar className="h-8 w-8">
                                 <AvatarImage
                                    src={session.user?.image || ""}
                                    alt={session.user?.name || "Admin"}
                                 />
                                 <AvatarFallback className="bg-blue-600 text-white">
                                    {session.user?.name
                                       ?.charAt(0)
                                       .toUpperCase() ||
                                       session.user?.email
                                          ?.charAt(0)
                                          .toUpperCase() ||
                                       "A"}
                                 </AvatarFallback>
                              </Avatar>
                           </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                           className="w-56"
                           align="end"
                           forceMount
                        >
                           <DropdownMenuLabel className="font-normal">
                              <div className="flex flex-col space-y-1">
                                 <p className="text-sm font-medium leading-none">
                                    {session.user?.name || "Admin User"}
                                 </p>
                                 <p className="text-xs leading-none text-muted-foreground">
                                    {session.user?.email}
                                 </p>
                                 <p className="text-xs leading-none text-blue-600 font-medium">
                                    Administrator
                                 </p>
                              </div>
                           </DropdownMenuLabel>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem asChild>
                              <Link
                                 href="/profile"
                                 className="w-full cursor-pointer"
                              >
                                 <User className="mr-2 h-4 w-4" />
                                 <span>Hồ sơ cá nhân</span>
                              </Link>
                           </DropdownMenuItem>
                           <DropdownMenuItem asChild>
                              <Link
                                 href="/admin/settings"
                                 className="w-full cursor-pointer"
                              >
                                 <Settings className="mr-2 h-4 w-4" />
                                 <span>Cài đặt</span>
                              </Link>
                           </DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem asChild>
                              <Link href="/" className="w-full cursor-pointer">
                                 <Home className="mr-2 h-4 w-4" />
                                 <span>Trở về cửa hàng</span>
                              </Link>
                           </DropdownMenuItem>
                           <DropdownMenuSeparator />
                           <DropdownMenuItem
                              className="cursor-pointer text-red-600 focus:text-red-600"
                              onClick={() => signOut({ callbackUrl: "/" })}
                           >
                              <LogOut className="mr-2 h-4 w-4" />
                              <span>Đăng xuất</span>
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  )}
               </div>
            </div>

            {/* Mobile search bar */}
            <div className="md:hidden pb-3">
               <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                     type="text"
                     placeholder="Search..."
                     className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
               </div>
            </div>
         </div>
      </nav>
   );
}
