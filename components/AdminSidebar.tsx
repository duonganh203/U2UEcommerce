"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
   LayoutDashboard,
   Users,
   Package,
   ShoppingCart,
   Settings,
   Home,
   ChevronLeft,
   ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminSidebarProps {
   collapsed: boolean;
   onToggleCollapse: () => void;
   isMobileMenuOpen: boolean;
   onCloseMobileMenu: () => void;
}

export default function AdminSidebar({
   collapsed,
   onToggleCollapse,
   isMobileMenuOpen,
   onCloseMobileMenu,
}: AdminSidebarProps) {
   const pathname = usePathname();

   const navigation = [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Users", href: "/admin/users", icon: Users },
      { name: "Products", href: "/admin/products", icon: Package },
      { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
      { name: "Settings", href: "/admin/settings", icon: Settings },
   ];

   return (
      <>
         {/* Mobile overlay */}
         {isMobileMenuOpen && (
            <div
               className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
               onClick={onCloseMobileMenu}
            />
         )}

         {/* Sidebar */}
         <div
            className={`bg-white dark:bg-gray-800 shadow-lg ${
               collapsed ? "w-16" : "w-64"
            } ${
               isMobileMenuOpen
                  ? "translate-x-0"
                  : "-translate-x-full lg:translate-x-0"
            } fixed lg:relative top-16 lg:top-0 left-0 h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)] z-50 flex flex-col transition-all duration-300 ease-in-out border-r border-gray-200 dark:border-gray-700`}
         >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
               {!collapsed && (
                  <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                     Admin Panel
                  </h1>
               )}
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={onToggleCollapse}
                  className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hidden lg:flex"
               >
                  {collapsed ? (
                     <ChevronRight className="h-4 w-4" />
                  ) : (
                     <ChevronLeft className="h-4 w-4" />
                  )}
               </Button>
            </div>

            <nav className="flex-1 mt-4 px-2">
               <ul className="space-y-1">
                  {navigation.map((item) => {
                     const Icon = item.icon;
                     const isActive = pathname === item.href;

                     return (
                        <li key={item.name}>
                           <Link
                              href={item.href}
                              className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 ${
                                 isActive
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                              } ${collapsed ? "justify-center" : ""} group`}
                              onClick={onCloseMobileMenu}
                           >
                              <Icon
                                 className={`h-5 w-5 ${
                                    collapsed ? "" : "mr-3"
                                 } flex-shrink-0`}
                              />
                              {!collapsed && (
                                 <span className="font-medium">
                                    {item.name}
                                 </span>
                              )}
                              {collapsed && (
                                 <div className="absolute left-full ml-6 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                                    {item.name}
                                    <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-900"></div>
                                 </div>
                              )}
                           </Link>
                        </li>
                     );
                  })}
               </ul>
            </nav>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
               <Link
                  href="/"
                  className={`flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
                     collapsed ? "justify-center" : ""
                  } group`}
               >
                  <Home
                     className={`h-5 w-5 ${
                        collapsed ? "" : "mr-3"
                     } flex-shrink-0`}
                  />
                  {!collapsed && (
                     <span className="font-medium">Back to Store</span>
                  )}
                  {collapsed && (
                     <div className="absolute left-full ml-6 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap">
                        Back to Store
                        <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1 border-4 border-transparent border-r-gray-900"></div>
                     </div>
                  )}
               </Link>
            </div>
         </div>
      </>
   );
}
