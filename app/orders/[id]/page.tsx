"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
   Package,
   Clock,
   CheckCircle,
   Truck,
   ArrowLeft,
   Calendar,
   DollarSign,
   MapPin,
   CreditCard,
   User,
   Phone,
   Mail,
   FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

export default function OrderDetailPage({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const { id } = use(params);
   const { data: session, status } = useSession();
   const router = useRouter();
   const [order, setOrder] = useState<Order | null>(null);
   const [loading, setLoading] = useState(true);
   const [markingDelivered, setMarkingDelivered] = useState(false);

   useEffect(() => {
      if (status === "loading") return;
      if (!session) {
         router.push("/login");
         return;
      }

      const fetchOrder = async () => {
         try {
            const response = await fetch(`/api/orders/${id}`);
            if (response.ok) {
               const data = await response.json();
               setOrder(data.order);
            } else {
               console.error("Failed to fetch order");
            }
         } catch (error) {
            console.error("Error fetching order:", error);
         } finally {
            setLoading(false);
         }
      };

      if (session?.user?.id) {
         fetchOrder();
      }
   }, [session, status, router, id]);

   const getStatusIcon = (order: Order) => {
      if (!order.isPaid) return <Clock className="w-5 h-5 text-yellow-500" />;
      if (!order.isDelivered)
         return <Truck className="w-5 h-5 text-blue-500" />;
      return <CheckCircle className="w-5 h-5 text-green-500" />;
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

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("vi-VN", {
         year: "numeric",
         month: "long",
         day: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      });
   };

   const handleMarkAsDelivered = async () => {
      if (!order) return;

      setMarkingDelivered(true);
      try {
         const response = await fetch(
            `/api/orders/${order._id}/mark-delivered`,
            {
               method: "PATCH",
               headers: {
                  "Content-Type": "application/json",
               },
            }
         );

         if (response.ok) {
            const data = await response.json();
            // Update the order state with new delivery status
            setOrder({
               ...order,
               isDelivered: true,
               deliveredAt: data.order.deliveredAt,
            });
            alert("Đã đánh dấu đơn hàng là đã giao thành công!");
         } else {
            const errorData = await response.json();
            alert(`Lỗi: ${errorData.error}`);
         }
      } catch (error) {
         console.error("Error marking order as delivered:", error);
         alert("Có lỗi xảy ra khi đánh dấu đơn hàng");
      } finally {
         setMarkingDelivered(false);
      }
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

   if (loading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
         </div>
      );
   }

   if (!order) {
      return (
         <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
               <div className="text-center">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h1 className="text-2xl font-bold text-foreground mb-2">
                     Không tìm thấy đơn hàng
                  </h1>
                  <p className="text-muted-foreground mb-6">
                     Đơn hàng bạn đang tìm kiếm không tồn tại hoặc bạn không có
                     quyền xem.
                  </p>
                  <Link href="/orders">
                     <Button>Quay lại danh sách đơn hàng</Button>
                  </Link>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-background">
         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
               <Link href="/orders">
                  <Button variant="ghost" className="mb-4">
                     <ArrowLeft className="w-4 h-4 mr-2" />
                     Quay lại danh sách đơn hàng
                  </Button>
               </Link>

               <div className="flex items-center justify-between">
                  <div>
                     <h1 className="text-3xl font-bold text-foreground mb-2">
                        Đơn hàng #{order._id.slice(-8)}
                     </h1>
                     <p className="text-muted-foreground">
                        Đặt hàng vào {formatDate(order.createdAt)}
                     </p>
                  </div>
                  <div className="flex items-center space-x-3">
                     {getStatusIcon(order)}
                     {getStatusBadge(order)}
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Main Content */}
               <div className="lg:col-span-2 space-y-6">
                  {/* Order Items */}
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center">
                           <Package className="w-5 h-5 mr-2" />
                           Sản phẩm đã đặt
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-4">
                           {order.orderItems.map((item, index) => (
                              <div
                                 key={index}
                                 className="flex items-center space-x-4 p-4 bg-muted/50 rounded-lg"
                              >
                                 <div className="w-16 h-16 bg-background rounded-lg flex items-center justify-center">
                                    <Package className="w-6 h-6 text-muted-foreground" />
                                 </div>
                                 <div className="flex-1">
                                    <h4 className="font-semibold text-foreground">
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
                     </CardContent>
                  </Card>

                  {/* Shipping Address */}
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center">
                           <MapPin className="w-5 h-5 mr-2" />
                           Địa chỉ giao hàng
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-2">
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
                     </CardContent>
                  </Card>

                  {/* Payment Information */}
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center">
                           <CreditCard className="w-5 h-5 mr-2" />
                           Thông tin thanh toán
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-4">
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                 Phương thức:
                              </span>
                              <span className="font-medium">
                                 {order.paymentMethod}
                              </span>
                           </div>

                           {order.paymentResult && (
                              <>
                                 <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                       Mã giao dịch:
                                    </span>
                                    <span className="font-medium">
                                       {order.paymentResult.id}
                                    </span>
                                 </div>
                                 <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                       Trạng thái:
                                    </span>
                                    <Badge
                                       variant={
                                          order.paymentResult.status ===
                                          "completed"
                                             ? "default"
                                             : "secondary"
                                       }
                                    >
                                       {order.paymentResult.status ===
                                       "completed"
                                          ? "Thành công"
                                          : "Thất bại"}
                                    </Badge>
                                 </div>
                              </>
                           )}

                           <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                 Ngày thanh toán:
                              </span>
                              <span className="font-medium">
                                 {order.isPaid && order.paidAt
                                    ? formatDate(order.paidAt)
                                    : "Chưa thanh toán"}
                              </span>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               </div>

               {/* Sidebar */}
               <div className="space-y-6">
                  {/* Order Summary */}
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center">
                           <FileText className="w-5 h-5 mr-2" />
                           Tóm tắt đơn hàng
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-3">
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                 Tạm tính:
                              </span>
                              <span>{order.itemsPrice.toLocaleString()}₫</span>
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
                              <span>{order.taxPrice.toLocaleString()}₫</span>
                           </div>
                           <Separator />
                           <div className="flex justify-between text-lg font-bold">
                              <span>Tổng cộng:</span>
                              <span className="text-primary">
                                 {order.totalPrice.toLocaleString()}₫
                              </span>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  {/* Order Timeline */}
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center">
                           <Calendar className="w-5 h-5 mr-2" />
                           Lịch sử đơn hàng
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="space-y-4">
                           <div className="flex items-start space-x-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                              <div>
                                 <p className="font-medium text-foreground">
                                    Đơn hàng đã được tạo
                                 </p>
                                 <p className="text-sm text-muted-foreground">
                                    {formatDate(order.createdAt)}
                                 </p>
                              </div>
                           </div>

                           {order.isPaid && order.paidAt && (
                              <div className="flex items-start space-x-3">
                                 <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                                 <div>
                                    <p className="font-medium text-foreground">
                                       Đã thanh toán
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                       {formatDate(order.paidAt)}
                                    </p>
                                 </div>
                              </div>
                           )}

                           {order.isDelivered && order.deliveredAt && (
                              <div className="flex items-start space-x-3">
                                 <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                 <div>
                                    <p className="font-medium text-foreground">
                                       Đã giao hàng
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                       {formatDate(order.deliveredAt)}
                                    </p>
                                 </div>
                              </div>
                           )}
                        </div>
                     </CardContent>
                  </Card>

                  {/* Actions */}
                  <Card>
                     <CardHeader>
                        <CardTitle>Hành động</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-3">
                        {/* Mark as Delivered Button - Only show for paid but not delivered orders */}
                        {order.isPaid && !order.isDelivered && (
                           <Button
                              className="w-full"
                              onClick={handleMarkAsDelivered}
                              disabled={markingDelivered}
                           >
                              {markingDelivered ? (
                                 <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Đang xử lý...
                                 </>
                              ) : (
                                 <>
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Đánh dấu đã giao
                                 </>
                              )}
                           </Button>
                        )}

                        {/* Show delivered status if already delivered */}
                        {order.isDelivered && (
                           <div className="flex items-center justify-center p-3 bg-green-50 border border-green-200 rounded-lg">
                              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                              <span className="text-green-700 font-medium">
                                 Đã giao hàng
                              </span>
                           </div>
                        )}

                        <Button className="w-full" variant="outline">
                           Tải hóa đơn
                        </Button>
                        <Button className="w-full" variant="outline">
                           Liên hệ hỗ trợ
                        </Button>
                     </CardContent>
                  </Card>
               </div>
            </div>
         </div>
      </div>
   );
}
