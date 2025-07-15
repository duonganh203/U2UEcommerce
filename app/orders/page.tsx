"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
   Package,
   Clock,
   CheckCircle,
   XCircle,
   Truck,
   Eye,
   Calendar,
   DollarSign,
   MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface OrderItem {
   _id: string;
   name: string;
   quantity: number;
   price: number;
   image: string;
}

interface Order {
   _id: string;
   orderItems: OrderItem[];
   shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
   };
   paymentMethod: string;
   itemsPrice: number;
   shippingPrice: number;
   taxPrice: number;
   totalPrice: number;
   isPaid: boolean;
   paidAt?: string;
   isDelivered: boolean;
   deliveredAt?: string;
   createdAt: string;
   paymentResult?: {
      id: string;
      status: string;
      update_time: string;
      email_address: string;
   };
}

export default function OrdersPage() {
   const { data: session, status } = useSession();
   const router = useRouter();
   const [orders, setOrders] = useState<Order[]>([]);
   const [loading, setLoading] = useState(true);
   const [filter, setFilter] = useState<string>("all");

   useEffect(() => {
      if (status === "loading") return;
      if (!session) {
         router.push("/login");
         return;
      }

      const fetchOrders = async () => {
         try {
            const response = await fetch("/api/orders");
            if (response.ok) {
               const data = await response.json();
               setOrders(data.orders || []);
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

   const getStatusIcon = (order: Order) => {
      if (!order.isPaid) return <Clock className="w-4 h-4 text-yellow-500" />;
      if (!order.isDelivered)
         return <Truck className="w-4 h-4 text-blue-500" />;
      return <CheckCircle className="w-4 h-4 text-green-500" />;
   };

   const getStatusText = (order: Order) => {
      if (!order.isPaid) return "Chờ thanh toán";
      if (!order.isDelivered) return "Đang giao hàng";
      return "Đã giao hàng";
   };

   const getStatusBadge = (order: Order) => {
      if (!order.isPaid) {
         return <Badge variant="secondary">Chờ thanh toán</Badge>;
      }
      if (!order.isDelivered) {
         return <Badge variant="default">Đang giao hàng</Badge>;
      }
      return (
         <Badge variant="outline" className="text-green-600 border-green-600">
            Đã giao hàng
         </Badge>
      );
   };

   const filteredOrders = orders.filter((order) => {
      if (filter === "all") return true;
      if (filter === "pending" && !order.isPaid) return true;
      if (filter === "paid" && order.isPaid && !order.isDelivered) return true;
      if (filter === "delivered" && order.isDelivered) return true;
      return false;
   });

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("vi-VN", {
         year: "numeric",
         month: "long",
         day: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      });
   };

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
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-foreground mb-2">
                  Đơn hàng của tôi
               </h1>
               <p className="text-muted-foreground">
                  Quản lý và theo dõi tất cả đơn hàng của bạn
               </p>
            </div>

            {/* Filter Tabs */}
            <div className="mb-6">
               <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                  <Button
                     variant={filter === "all" ? "default" : "ghost"}
                     size="sm"
                     onClick={() => setFilter("all")}
                  >
                     Tất cả ({orders.length})
                  </Button>
                  <Button
                     variant={filter === "pending" ? "default" : "ghost"}
                     size="sm"
                     onClick={() => setFilter("pending")}
                  >
                     Chờ thanh toán ({orders.filter((o) => !o.isPaid).length})
                  </Button>
                  <Button
                     variant={filter === "paid" ? "default" : "ghost"}
                     size="sm"
                     onClick={() => setFilter("paid")}
                  >
                     Đang giao (
                     {orders.filter((o) => o.isPaid && !o.isDelivered).length})
                  </Button>
                  <Button
                     variant={filter === "delivered" ? "default" : "ghost"}
                     size="sm"
                     onClick={() => setFilter("delivered")}
                  >
                     Đã giao ({orders.filter((o) => o.isDelivered).length})
                  </Button>
               </div>
            </div>

            {loading ? (
               <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
               </div>
            ) : filteredOrders.length === 0 ? (
               <div className="text-center py-12">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                     {filter === "all"
                        ? "Chưa có đơn hàng nào"
                        : "Không có đơn hàng nào"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                     {filter === "all"
                        ? "Bạn chưa có đơn hàng nào. Hãy bắt đầu mua sắm!"
                        : `Không có đơn hàng nào ở trạng thái "${filter}"`}
                  </p>
                  {filter === "all" && (
                     <Link href="/products">
                        <Button>Mua sắm ngay</Button>
                     </Link>
                  )}
               </div>
            ) : (
               <div className="space-y-6">
                  {filteredOrders.map((order) => (
                     <div
                        key={order._id}
                        className="bg-card rounded-lg shadow-md border border-border overflow-hidden"
                     >
                        {/* Order Header */}
                        <div className="p-6 border-b border-border">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                 {getStatusIcon(order)}
                                 <div>
                                    <h3 className="text-lg font-semibold text-foreground">
                                       Đơn hàng #{order._id.slice(-8)}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                       {formatDate(order.createdAt)}
                                    </p>
                                 </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                 {getStatusBadge(order)}
                                 <Link href={`/orders/${order._id}`}>
                                    <Button variant="outline" size="sm">
                                       <Eye className="w-4 h-4 mr-2" />
                                       Chi tiết
                                    </Button>
                                 </Link>
                              </div>
                           </div>
                        </div>

                        {/* Order Items */}
                        <div className="p-6">
                           <div className="space-y-4">
                              {order.orderItems.map((item, index) => (
                                 <div
                                    key={index}
                                    className="flex items-center space-x-4"
                                 >
                                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                                       <Package className="w-6 h-6 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                       <h4 className="font-medium text-foreground">
                                          {item.name}
                                       </h4>
                                       <p className="text-sm text-muted-foreground">
                                          Số lượng: {item.quantity} x{" "}
                                          {item.price.toLocaleString()}₫
                                       </p>
                                    </div>
                                    <div className="text-right">
                                       <p className="font-semibold text-foreground">
                                          {(
                                             item.price * item.quantity
                                          ).toLocaleString()}
                                          ₫
                                       </p>
                                    </div>
                                 </div>
                              ))}
                           </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-muted px-6 py-4">
                           <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                 <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <MapPin className="w-4 h-4" />
                                    <span>
                                       {order.shippingAddress.street},{" "}
                                       {order.shippingAddress.city}
                                    </span>
                                 </div>
                                 <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <Calendar className="w-4 h-4" />
                                    <span>
                                       {order.isPaid && order.paidAt
                                          ? `Đã thanh toán: ${formatDate(
                                               order.paidAt
                                            )}`
                                          : "Chưa thanh toán"}
                                    </span>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className="flex items-center space-x-2">
                                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-lg font-bold text-foreground">
                                       {order.totalPrice.toLocaleString()}₫
                                    </span>
                                 </div>
                                 <p className="text-sm text-muted-foreground">
                                    {order.paymentMethod}
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}

            {/* Back to Dashboard */}
            <div className="mt-8">
               <Link href="/dashboard">
                  <Button variant="outline">← Quay lại bảng điều khiển</Button>
               </Link>
            </div>
         </div>
      </div>
   );
}
