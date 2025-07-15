"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import WonAuctions from "@/components/WonAuctions";

export default function Dashboard() {
   const { data: session, status } = useSession();
   const router = useRouter();
   const [orders, setOrders] = useState([]);
   const [loading, setLoading] = useState(true);

   useEffect(() => {
      if (status === "loading") return; // Still loading
      if (!session) {
         router.push("/login");
         return;
      }

      // Fetch user orders
      const fetchOrders = async () => {
         try {
            const response = await fetch("/api/orders");
            if (response.ok) {
               const data = await response.json();
               setOrders(data.orders);
            }
         } catch (error) {
            console.error("Error fetching orders:", error);
         } finally {
            setLoading(false);
         }
      };

      if (session?.user?.id) {
         fetchOrders();
      }
   }, [session, status, router]);
   if (status === "loading") {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
         </div>
      );
   }

   if (!session) {
      return null;
   }

   return (
      <div className="min-h-screen bg-background">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
               <div className="px-4 py-5 sm:p-6">
                  <h1 className="text-3xl font-bold text-foreground mb-6">
                     Bảng điều khiển
                  </h1>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                     <h2 className="text-lg font-semibold text-foreground mb-2">
                        Xin chào, {session.user.firstName}{" "}
                        {session.user.lastName}!
                     </h2>
                     <p className="text-muted-foreground">
                        Email: {session.user.email}
                     </p>
                     <p className="text-muted-foreground">
                        Vai trò: {session.user.role}
                     </p>
                  </div>{" "}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                     <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
                        <div className="p-5">
                           <div className="flex items-center">
                              <div className="flex-shrink-0">
                                 <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                                    <span className="text-primary-foreground font-semibold">
                                       O
                                    </span>
                                 </div>
                              </div>
                              <div className="ml-5 w-0 flex-1">
                                 <dl>
                                    <dt className="text-sm font-medium text-muted-foreground truncate">
                                       Tổng đơn hàng
                                    </dt>
                                    <dd className="text-lg font-medium text-foreground">
                                       {loading ? "..." : orders.length}
                                    </dd>
                                 </dl>
                              </div>
                           </div>
                        </div>
                        <div className="bg-muted px-5 py-3">
                           <div className="text-sm">
                              <Link
                                 href="/orders"
                                 className="font-medium text-primary hover:text-primary/80"
                              >
                                 Xem tất cả đơn hàng
                              </Link>
                           </div>
                        </div>
                     </div>

                     <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
                        <div className="p-5">
                           <div className="flex items-center">
                              <div className="flex-shrink-0">
                                 <div className="w-8 h-8 bg-secondary rounded-md flex items-center justify-center">
                                    <span className="text-secondary-foreground font-semibold">
                                       P
                                    </span>
                                 </div>
                              </div>
                              <div className="ml-5 w-0 flex-1">
                                 <dl>
                                    <dt className="text-sm font-medium text-muted-foreground truncate">
                                       Sản phẩm
                                    </dt>
                                    <dd className="text-lg font-medium text-foreground">
                                       0
                                    </dd>
                                 </dl>
                              </div>
                           </div>
                        </div>
                        <div className="bg-muted px-5 py-3">
                           <div className="text-sm">
                              <Link
                                 href="/products"
                                 className="font-medium text-primary hover:text-primary/80"
                              >
                                 Xem sản phẩm
                              </Link>
                           </div>
                        </div>
                     </div>

                     <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
                        <div className="p-5">
                           <div className="flex items-center">
                              <div className="flex-shrink-0">
                                 <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
                                    <span className="text-accent-foreground font-semibold">
                                       S
                                    </span>
                                 </div>
                              </div>
                              <div className="ml-5 w-0 flex-1">
                                 <dl>
                                    <dt className="text-sm font-medium text-muted-foreground truncate">
                                       Tin đăng của tôi
                                    </dt>
                                    <dd className="text-lg font-medium text-foreground">
                                       0 Đang hoạt động
                                    </dd>
                                 </dl>
                              </div>
                           </div>
                        </div>
                        <div className="bg-muted px-5 py-3">
                           <div className="text-sm flex gap-2">
                              <Link
                                 href="/sell-item"
                                 className="font-medium text-primary hover:text-primary/80"
                              >
                                 Đăng bán sản phẩm
                              </Link>
                              <span className="text-muted-foreground">•</span>
                              <Link
                                 href="/manage-products"
                                 className="font-medium text-primary hover:text-primary/80"
                              >
                                 Quản lý
                              </Link>
                           </div>
                        </div>
                     </div>

                     <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
                        <div className="p-5">
                           <div className="flex items-center">
                              <div className="flex-shrink-0">
                                 <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                                    <span className="text-white font-semibold">
                                       O
                                    </span>
                                 </div>
                              </div>
                              <div className="ml-5 w-0 flex-1">
                                 <dl>
                                    <dt className="text-sm font-medium text-muted-foreground truncate">
                                       Đơn hàng bán
                                    </dt>
                                    <dd className="text-lg font-medium text-foreground">
                                       Quản lý đơn hàng
                                    </dd>
                                 </dl>
                              </div>
                           </div>
                        </div>
                        <div className="bg-muted px-5 py-3">
                           <div className="text-sm">
                              <Link
                                 href="/seller/orders"
                                 className="font-medium text-primary hover:text-primary/80"
                              >
                                 Xem đơn hàng bán
                              </Link>
                           </div>
                        </div>
                     </div>

                     <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
                        <div className="p-5">
                           <div className="flex items-center">
                              <div className="flex-shrink-0">
                                 <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
                                    <span className="text-accent-foreground font-semibold">
                                       U
                                    </span>
                                 </div>
                              </div>
                              <div className="ml-5 w-0 flex-1">
                                 <dl>
                                    <dt className="text-sm font-medium text-muted-foreground truncate">
                                       Hồ sơ cá nhân
                                    </dt>
                                    <dd className="text-lg font-medium text-foreground">
                                       Quản lý
                                    </dd>
                                 </dl>
                              </div>
                           </div>
                        </div>
                        <div className="bg-muted px-5 py-3">
                           <div className="text-sm">
                              <Link
                                 href="/profile"
                                 className="font-medium text-primary hover:text-primary/80"
                              >
                                 Cập nhật hồ sơ
                              </Link>
                           </div>
                        </div>
                     </div>
                  </div>
                  {/* Won Auctions Section */}
                  <div className="mt-8">
                     <WonAuctions />
                  </div>
                  <div className="mt-6">
                     <Link
                        href="/"
                        className="inline-flex items-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                     >
                        ← Quay lại trang chủ
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
