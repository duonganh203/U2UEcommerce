"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
   const pathname = usePathname();
   const [collapsed, setCollapsed] = useState(false);

   const navigation = [
      { name: "Dashboard", href: "/admin", icon: "📊" },
      { name: "Users", href: "/admin/users", icon: "👥" },
      { name: "Products", href: "/admin/products", icon: "📦" },
      { name: "Orders", href: "/admin/orders", icon: "🛒" },
      { name: "Settings", href: "/admin/settings", icon: "⚙️" },
   ];

   return (
      <div className="flex h-screen bg-gray-100">
         {/* Sidebar */}
         <div
            className={`bg-indigo-800 text-white ${
               collapsed ? "w-16" : "w-64"
            } flex flex-col transition-all duration-300 ease-in-out`}
         >
            <div className="flex items-center justify-between p-4 border-b border-indigo-700">
               {!collapsed && (
                  <h1 className="text-xl font-bold">Admin Panel</h1>
               )}
               <button
                  onClick={() => setCollapsed(!collapsed)}
                  className="p-1 rounded-md hover:bg-indigo-700"
               >
                  {collapsed ? "→" : "←"}
               </button>
            </div>

            <nav className="flex-1 mt-4">
               <ul>
                  {navigation.map((item) => (
                     <li key={item.name} className="mb-1">
                        <Link
                           href={item.href}
                           className={`flex items-center px-4 py-3 ${
                              pathname === item.href
                                 ? "bg-indigo-700 text-white"
                                 : "text-indigo-100 hover:bg-indigo-700"
                           } ${collapsed ? "justify-center" : ""}`}
                        >
                           <span className="text-xl">{item.icon}</span>
                           {!collapsed && (
                              <span className="ml-3">{item.name}</span>
                           )}
                        </Link>
                     </li>
                  ))}
               </ul>
            </nav>

            <div className="p-4 border-t border-indigo-700">
               <Link
                  href="/"
                  className={`flex items-center text-indigo-100 hover:text-white ${
                     collapsed ? "justify-center" : ""
                  }`}
               >
                  <span className="text-xl">🏠</span>
                  {!collapsed && <span className="ml-3">Back to Store</span>}
               </Link>
            </div>
         </div>

         {/* Main content */}
         <div className="flex-1 flex flex-col overflow-hidden">
            {" "}
            {/* Top header */}
            <header className="bg-white shadow">
               <div className="px-4 py-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                     {pathname === "/admin"
                        ? "Admin Dashboard"
                        : pathname === "/admin/users"
                        ? "User Management"
                        : pathname === "/admin/products"
                        ? "Product Management"
                        : pathname === "/admin/orders"
                        ? "Order Management"
                        : pathname === "/admin/settings"
                        ? "System Settings"
                        : "Admin Dashboard"}
                  </h2>
                  <div className="flex items-center">
                     <span className="mr-2 text-sm text-gray-600">
                        Admin User
                     </span>
                     <img
                        className="h-8 w-8 rounded-full"
                        src="https://via.placeholder.com/40"
                        alt="Admin profile"
                     />
                  </div>
               </div>
            </header>
            {/* Main content area */}
            <main className="flex-1 overflow-y-auto p-4">{children}</main>
         </div>
      </div>
   );
};

export default AdminLayout;
