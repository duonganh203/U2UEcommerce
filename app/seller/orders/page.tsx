"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
   Package,
   Clock,
   CheckCircle,
   Truck,
   Eye,
   Calendar,
   DollarSign,
   MapPin,
   User,
   Mail,
   Phone,
   TrendingUp,
   ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderItem {
   _id: string;
   name: string;
   quantity: number;
   price: number;
   image: string;
   product: {
      _id: string;
      name: string;
      images: string[];
   };
}

interface Buyer {
   _id: string;
   name: string;
   email: string;
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
   buyer: Buyer;
}

export default function SellerOrdersPage() {
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
            const response = await fetch("/api/seller/orders");
            if (response.ok) {
               const data = await response.json();
               setOrders(data.orders || []);
            } else {
               console.error("Failed to fetch seller orders");
            }
         } catch (error) {
            console.error("Error fetching seller orders:", error);
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

   const totalRevenue = orders
      .filter((order) => order.isPaid)
      .reduce((sum, order) => sum + order.totalPrice, 0);

   const totalOrders = orders.length;
   const paidOrders = orders.filter((order) => order.isPaid).length;
   const deliveredOrders = orders.filter((order) => order.isDelivered).length;

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
                  Quản lý đơn hàng
               </h1>
               <p className="text-muted-foreground">
                  Theo dõi và quản lý đơn hàng của sản phẩm bạn bán
               </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">
                        Tổng đơn hàng
                     </CardTitle>
                     <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">{totalOrders}</div>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">
                        Đã thanh toán
                     </CardTitle>
                     <CheckCircle className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">{paidOrders}</div>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">
                        Đã giao hàng
                     </CardTitle>
                     <Truck className="h-4 w-4 text-blue-500" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">{deliveredOrders}</div>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">
                        Tổng doanh thu
                     </CardTitle>
                     <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-2xl font-bold">
                        {totalRevenue.toLocaleString()}₫
                     </div>
                  </CardContent>
               </Card>
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
                        ? "Bạn chưa có đơn hàng nào. Hãy đăng sản phẩm để bắt đầu bán hàng!"
                        : `Không có đơn hàng nào ở trạng thái "${filter}"`}
                  </p>
                  {filter === "all" && (
                     <Link href="/sell-item">
                        <Button>Đăng sản phẩm</Button>
                     </Link>
                  )}
               </div>
            ) : (
               <div className="space-y-6">
                  {filteredOrders.map((order) => (
                     <Card key={order._id} className="overflow-hidden">
                        {/* Order Header */}
                        <CardHeader className="border-b border-border">
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
                                 <Link href={`/seller/orders/${order._id}`}>
                                    <Button variant="outline" size="sm">
                                       <Eye className="w-4 h-4 mr-2" />
                                       Chi tiết
                                    </Button>
                                 </Link>
                              </div>
                           </div>
                        </CardHeader>

                        <CardContent className="p-6">
                           {/* Buyer Information */}
                           <div className="mb-6 p-4 bg-muted/50 rounded-lg">
                              <h4 className="font-semibold text-foreground mb-3 flex items-center">
                                 <User className="w-4 h-4 mr-2" />
                                 Thông tin người mua
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                 <div>
                                    <p className="text-sm text-muted-foreground">
                                       Tên:
                                    </p>
                                    <p className="font-medium">
                                       {order.buyer.name}
                                    </p>
                                 </div>
                                 <div>
                                    <p className="text-sm text-muted-foreground">
                                       Email:
                                    </p>
                                    <p className="font-medium flex items-center">
                                       <Mail className="w-4 h-4 mr-1" />
                                       {order.buyer.email}
                                    </p>
                                 </div>
                              </div>
                           </div>

                           {/* Order Items */}
                           <div className="mb-6">
                              <h4 className="font-semibold text-foreground mb-3 flex items-center">
                                 <Package className="w-4 h-4 mr-2" />
                                 Sản phẩm đã đặt
                              </h4>
                              <div className="space-y-3">
                                 {order.orderItems.map((item, index) => (
                                    <div
                                       key={index}
                                       className="flex items-center space-x-4 p-3 bg-muted/30 rounded-lg"
                                    >
                                       <div className="w-12 h-12 bg-background rounded-lg flex items-center justify-center">
                                          <Package className="w-5 h-5 text-muted-foreground" />
                                       </div>
                                       <div className="flex-1">
                                          <h5 className="font-medium text-foreground">
                                             {item.name}
                                          </h5>
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
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                 <h4 className="font-semibold text-foreground mb-3 flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Địa chỉ giao hàng
                                 </h4>
                                 <div className="p-3 bg-muted/30 rounded-lg">
                                    <p className="text-foreground">
                                       {order.shippingAddress.street}
                                    </p>
                                    <p className="text-foreground">
                                       {order.shippingAddress.city},{" "}
                                       {order.shippingAddress.state}
                                    </p>
                                    <p className="text-foreground">
                                       {order.shippingAddress.zipCode},{" "}
                                       {order.shippingAddress.country}
                                    </p>
                                 </div>
                              </div>

                              <div>
                                 <h4 className="font-semibold text-foreground mb-3 flex items-center">
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Tóm tắt đơn hàng
                                 </h4>
                                 <div className="p-3 bg-muted/30 rounded-lg space-y-2">
                                    <div className="flex justify-between">
                                       <span className="text-muted-foreground">
                                          Tạm tính:
                                       </span>
                                       <span>
                                          {order.itemsPrice.toLocaleString()}₫
                                       </span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="text-muted-foreground">
                                          Phí vận chuyển:
                                       </span>
                                       <span>
                                          {order.shippingPrice === 0
                                             ? "Miễn phí"
                                             : `${order.shippingPrice.toLocaleString()}₫`}
                                       </span>
                                    </div>
                                    <div className="flex justify-between">
                                       <span className="text-muted-foreground">
                                          Thuế:
                                       </span>
                                       <span>
                                          {order.taxPrice.toLocaleString()}₫
                                       </span>
                                    </div>
                                    <div className="border-t border-border pt-2">
                                       <div className="flex justify-between font-semibold">
                                          <span>Tổng cộng:</span>
                                          <span className="text-primary">
                                             {order.totalPrice.toLocaleString()}
                                             ₫
                                          </span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
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
