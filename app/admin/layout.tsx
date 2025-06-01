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
            <div
               className={`flex-1 lg:ml-0 ${
                  collapsed ? "lg:ml-16" : "lg:ml-64"
               } transition-all duration-300`}
            >
               <main className="p-6">{children}</main>
            </div>
         </div>
      </div>
   );
};

export default AdminLayout;
