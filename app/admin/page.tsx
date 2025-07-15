"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import RevenueChart from "@/components/charts/RevenueChart";
import CategoryChart from "@/components/charts/CategoryChart";
import OrderStatusChart from "@/components/charts/OrderStatusChart";
import DailyRevenueChart from "@/components/charts/DailyRevenueChart";
import StatsOverview from "@/components/charts/StatsOverview";
import QuickStats from "@/components/charts/QuickStats";

interface AdminStats {
   totalUsers: number;
   activeProducts: number;
   pendingProducts: number;
   totalRevenue: number;
   revenueChange: string;
   totalOrders: number;
   completedOrders: number;
   averageOrderValue: number;
   topCategory: string;
   chartData: {
      monthlyRevenue: Array<{ month: string; revenue: number }>;
      productsByCategory: Array<{ category: string; count: number }>;
      ordersByStatus: Array<{ status: string; count: number }>;
      dailyRevenue: Array<{ date: string; revenue: number }>;
   };
   recentUsers: Array<{
      id: string;
      name: string;
      email: string;
      joined: string;
      status: string;
   }>;
   pendingProductsList: Array<{
      id: string;
      name: string;
      seller: string;
      category: string;
      price: string;
      submitted: string;
   }>;
}

const AdminDashboard = () => {
   const [stats, setStats] = useState<AdminStats | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const fetchStats = async () => {
         try {
            const response = await fetch("/api/admin/stats");
            if (!response.ok) {
               throw new Error("Failed to fetch stats");
            }
            const data = await response.json();
            setStats(data);
         } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
         } finally {
            setLoading(false);
         }
      };

      fetchStats();
   }, []);

   if (loading) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="text-lg">Đang tải dữ liệu...</div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="text-red-600">Lỗi: {error}</div>
         </div>
      );
   }

   if (!stats) {
      return (
         <div className="flex items-center justify-center min-h-screen">
            <div className="text-gray-600">Không có dữ liệu</div>
         </div>
      );
   }

   return (
      <div className="space-y-6">
         <StatsOverview
            totalRevenue={stats.totalRevenue}
            totalUsers={stats.totalUsers}
            activeProducts={stats.activeProducts}
            pendingProducts={stats.pendingProducts}
            revenueChange={stats.revenueChange}
         />

         <QuickStats
            totalOrders={stats.totalOrders}
            completedOrders={stats.completedOrders}
            averageOrderValue={stats.averageOrderValue}
            topCategory={stats.topCategory}
         />

         {/* Charts Section */}
         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <RevenueChart data={stats.chartData.monthlyRevenue} />
            <DailyRevenueChart data={stats.chartData.dailyRevenue} />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <CategoryChart data={stats.chartData.productsByCategory} />
            <OrderStatusChart data={stats.chartData.ordersByStatus} />
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <div className="bg-white rounded-lg shadow">
               <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="text-lg font-semibold text-gray-800">
                     Người dùng gần đây
                  </h3>
                  <Link
                     href="/admin/users"
                     className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                     Xem tất cả
                  </Link>
               </div>
               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tên
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ngày tạo
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Trạng thái
                           </th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        {stats.recentUsers.map((user) => (
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
                                       user.status === "active"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-red-100 text-red-800"
                                    }`}
                                 >
                                    {user.status === "active"
                                       ? "Hoạt động"
                                       : "Không hoạt động"}
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
                     Sản phẩm đang chờ duyệt
                  </h3>
                  <Link
                     href="/admin/products"
                     className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                     Xem tất cả
                  </Link>
               </div>
               <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                     <thead className="bg-gray-50">
                        <tr>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sản phẩm
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Người bán
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Giá
                           </th>
                           <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Đã gửi
                           </th>
                        </tr>
                     </thead>
                     <tbody className="bg-white divide-y divide-gray-200">
                        {stats.pendingProductsList.map((product) => (
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
               Hành động nhanh
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <Link
                  href="/admin/users"
                  className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg text-center"
               >
                  <div className="text-3xl mb-2">👥</div>
                  <h4 className="font-medium">Quản lý người dùng</h4>
                  <p className="text-sm text-gray-600 mt-1">
                     Xem và chỉnh sửa tài khoản người dùng
                  </p>
               </Link>
               <Link
                  href="/admin/products"
                  className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg text-center"
               >
                  <div className="text-3xl mb-2">📦</div>
                  <h4 className="font-medium">Duyệt sản phẩm</h4>
                  <p className="text-sm text-gray-600 mt-1">
                     Phê duyệt hoặc từ chối danh sách sản phẩm
                  </p>
               </Link>
               <Link
                  href="/admin/settings"
                  className="bg-indigo-50 hover:bg-indigo-100 p-4 rounded-lg text-center"
               >
                  <div className="text-3xl mb-2">⚙️</div>
                  <h4 className="font-medium">Cài đặt hệ thống</h4>
                  <p className="text-sm text-gray-600 mt-1">
                     Cấu hình các thông số hệ thống
                  </p>
               </Link>
            </div>
         </div>
      </div>
   );
};

export default AdminDashboard;
