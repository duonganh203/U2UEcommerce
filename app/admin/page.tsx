"use client";

import React from "react";
import Link from "next/link";

const AdminDashboard = () => {
   // Mock data for demonstration
   const stats = [
      { name: "Total Users", value: "450", icon: "👥", change: "+5.2%" },
      { name: "Active Products", value: "182", icon: "📦", change: "+2.4%" },
      { name: "Pending Products", value: "24", icon: "⏳", change: "+18.7%" },
      { name: "Total Revenue", value: "$24,500", icon: "💰", change: "+12.1%" },
   ];

   const recentUsers = [
      {
         id: "1",
         name: "John Smith",
         email: "john@example.com",
         joined: "June 1, 2025",
         status: "Active",
      },
      {
         id: "2",
         name: "Sarah Johnson",
         email: "sarah@example.com",
         joined: "May 28, 2025",
         status: "Active",
      },
      {
         id: "3",
         name: "Michael Brown",
         email: "michael@example.com",
         joined: "May 25, 2025",
         status: "Inactive",
      },
      {
         id: "4",
         name: "Emily Davis",
         email: "emily@example.com",
         joined: "May 22, 2025",
         status: "Active",
      },
   ];

   const pendingProducts = [
      {
         id: "1",
         name: "Wireless Earbuds",
         seller: "TechStore",
         category: "Electronics",
         price: "$89.99",
         submitted: "May 31, 2025",
      },
      {
         id: "2",
         name: "Fitness Tracker",
         seller: "SportGoods",
         category: "Wearables",
         price: "$59.99",
         submitted: "May 30, 2025",
      },
      {
         id: "3",
         name: "Organic Coffee Beans",
         seller: "GreenCoffee",
         category: "Food & Beverages",
         price: "$24.99",
         submitted: "May 29, 2025",
      },
   ];

   return (
      <div className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
               <div
                  key={stat.name}
                  className="bg-white rounded-lg shadow p-5 transition-all hover:shadow-md"
               >
                  <div className="flex justify-between items-center">
                     <div>
                        <p className="text-gray-500 text-sm font-medium">
                           {stat.name}
                        </p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                     </div>
                     <div className="text-3xl">{stat.icon}</div>
                  </div>
                  <div className="mt-2 text-sm text-green-600">
                     {stat.change} from last month
                  </div>
               </div>
            ))}
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="bg-white rounded-lg shadow">
               <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                     Recent Users
                  </h3>
                  <Link
                     href="/admin/users"
                     className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                     View All
                  </Link>
               </div>
               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Joined
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                           </th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        {recentUsers.map((user) => (
                           <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="font-medium text-gray-900">
                                    {user.name}
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 {user.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 {user.joined}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <span
                                    className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                       user.status === "Active"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                    }`}
                                 >
                                    {user.status}
                                 </span>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            {/* Pending Products */}
            <div className="bg-white rounded-lg shadow">
               <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                     Pending Products
                  </h3>
                  <Link
                     href="/admin/products"
                     className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                     View All
                  </Link>
               </div>
               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Seller
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Submitted
                           </th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        {pendingProducts.map((product) => (
                           <tr key={product.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                 <div className="font-medium text-gray-900">
                                    {product.name}
                                 </div>
                                 <div className="text-xs text-gray-500">
                                    {product.category}
                                 </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 {product.seller}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 {product.price}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                 {product.submitted}
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>

         {/* Quick Actions */}
         <div className="bg-white rounded-lg shadow p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
               Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <Link
                  href="/admin/users"
                  className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg text-center"
               >
                  <div className="text-3xl mb-2">👥</div>
                  <h4 className="font-medium">Manage Users</h4>
                  <p className="text-sm text-gray-600 mt-1">
                     View and edit user accounts
                  </p>
               </Link>
               <Link
                  href="/admin/products"
                  className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg text-center"
               >
                  <div className="text-3xl mb-2">📦</div>
                  <h4 className="font-medium">Review Products</h4>
                  <p className="text-sm text-gray-600 mt-1">
                     Approve or reject product listings
                  </p>
               </Link>
               <Link
                  href="/admin/settings"
                  className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg text-center"
               >
                  <div className="text-3xl mb-2">⚙️</div>
                  <h4 className="font-medium">System Settings</h4>
                  <p className="text-sm text-gray-600 mt-1">
                     Configure store settings
                  </p>
               </Link>
            </div>
         </div>
      </div>
   );
};

export default AdminDashboard;
