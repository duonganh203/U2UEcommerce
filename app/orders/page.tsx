"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
   Package,
   Calendar,
   DollarSign,
   CheckCircle,
   XCircle,
   Clock,
   MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface OrderItem {
   product: {
      _id: string;
      name: string;
      image: string;
      price: number;
   };
   name: string;
   quantity: number;
   image: string;
   price: number;
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
}

export default function OrdersPage() {
   const { data: session, status } = useSession();
   const router = useRouter();
   const [orders, setOrders] = useState<Order[]>([]);
   const [loading, setLoading] = useState(true);

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

   const getStatusIcon = (isPaid: boolean, isDelivered: boolean) => {
      if (isDelivered) {
         return <CheckCircle className="w-5 h-5 text-green-500" />;
      } else if (isPaid) {
         return <Clock className="w-5 h-5 text-blue-500" />;
      } else {
         return <XCircle className="w-5 h-5 text-red-500" />;
      }
   };

   const getStatusText = (isPaid: boolean, isDelivered: boolean) => {
      if (isDelivered) {
         return "Đã giao hàng";
      } else if (isPaid) {
         return "Đã thanh toán";
      } else {
         return "Chưa thanh toán";
      }
   };

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
            <div className="flex items-center justify-between mb-8">
               <h1 className="text-3xl font-bold text-foreground">
                  Đơn hàng của tôi
               </h1>
               <Link href="/dashboard">
                  <Button variant="outline">← Quay lại Dashboard</Button>
               </Link>
            </div>

            {loading ? (
               <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">
                     Đang tải đơn hàng...
                  </p>
               </div>
            ) : orders.length === 0 ? (
               <div className="text-center py-12">
                  <Package className="w-24 h-24 text-muted-foreground/50 mx-auto mb-6" />
                  <h2 className="text-2xl font-semibold text-foreground mb-4">
                     Bạn chưa có đơn hàng nào
                  </h2>
                  <p className="text-muted-foreground mb-8">
                     Hãy bắt đầu mua sắm để tạo đơn hàng đầu tiên!
                  </p>
                  <Link href="/products">
                     <Button size="lg">Mua sắm ngay</Button>
                  </Link>
               </div>
            ) : (
               <div className="space-y-6">
                  {orders.map((order) => (
                     <div
                        key={order._id}
                        className="bg-card rounded-lg shadow-md border border-border"
                     >
                        <div className="p-6">
                           <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-4">
                                 <Package className="w-6 h-6 text-primary" />
                                 <div>
                                    <h3 className="text-lg font-semibold text-foreground">
                                       Đơn hàng #{order._id.slice(-8)}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                       {formatDate(order.createdAt)}
                                    </p>
                                 </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                 {getStatusIcon(
                                    order.isPaid,
                                    order.isDelivered
                                 )}
                                 <span className="text-sm font-medium">
                                    {getStatusText(
                                       order.isPaid,
                                       order.isDelivered
                                    )}
                                 </span>
                              </div>
                           </div>

                           <div className="space-y-4">
                              {order.orderItems.map((item, index) => (
                                 <div
                                    key={index}
                                    className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg"
                                 >
                                    <div className="w-16 h-16 relative bg-background rounded-lg overflow-hidden">
                                       <Image
                                          src={item.image}
                                          alt={item.name}
                                          fill
                                          className="object-cover"
                                       />
                                    </div>
                                    <div className="flex-1">
                                       <h4 className="font-semibold text-foreground">
                                          {item.name}
                                       </h4>
                                       <p className="text-sm text-muted-foreground">
                                          Số lượng: {item.quantity}
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

                           <div className="mt-6 pt-6 border-t border-border">
                              <div className="flex justify-between items-center">
                                 <div className="space-y-2">
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
                                          Đặt hàng:{" "}
                                          {formatDate(order.createdAt)}
                                       </span>
                                    </div>
                                    {order.paidAt && (
                                       <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                          <CheckCircle className="w-4 h-4" />
                                          <span>
                                             Thanh toán:{" "}
                                             {formatDate(order.paidAt)}
                                          </span>
                                       </div>
                                    )}
                                 </div>
                                 <div className="text-right">
                                    <div className="text-sm text-muted-foreground">
                                       Tổng cộng:
                                    </div>
                                    <div className="text-xl font-bold text-foreground">
                                       {order.totalPrice.toLocaleString()}₫
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
   );
}
