"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
   const pathname = usePathname();
   const [collapsed, setCollapsed] = useState(false);
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

   const getPageTitle = () => {
      switch (pathname) {
         case "/admin":
            return "Admin Dashboard";
         case "/admin/users":
            return "User Management";
         case "/admin/products":
            return "Product Management";
         case "/admin/orders":
            return "Order Management";
         case "/admin/settings":
            return "System Settings";
         default:
            return "Admin Dashboard";
      }
   };
   return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
         {/* Admin Navbar */}
         <AdminNavbar
            title={getPageTitle()}
            onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
         />

         <div className="flex">
            {/* Sidebar */}
            <AdminSidebar
               collapsed={collapsed}
               onToggleCollapse={() => setCollapsed(!collapsed)}
               isMobileMenuOpen={isMobileMenuOpen}
               onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
            />

            {/* Main content */}
            <div className="flex-1 transition-all duration-300">
               <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <main className="py-6">{children}</main>
               </div>
            </div>
         </div>
      </div>
   );
};

export default AdminLayout;
