"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";

function PaymentSuccessContent() {
   const searchParams = useSearchParams();
   const orderId = searchParams.get("orderId");
   const cartCleared = searchParams.get("cartCleared");
   const auctionOrder = searchParams.get("auctionOrder");
   const [order, setOrder] = useState<any>(null);
   const [loading, setLoading] = useState(true);
   const { clearCart } = useCart();

   useEffect(() => {
      if (orderId) {
         // Clear cart if this is a successful payment (cartCleared flag is present)
         if (cartCleared === "true") {
            console.log(
               "Payment Success DEBUG - Clearing cart after successful payment"
            );
            clearCart();

            // Also call API to clear cart (for future database implementation)
            fetch("/api/cart/clear", {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
            }).catch((error) => {
               console.error("Error calling cart clear API:", error);
            });
         }

         // Fetch order details from API
         fetch(`/api/payment/success/${orderId}`)
            .then((res) => res.json())
            .then((data) => {
               console.log("Payment Success DEBUG - API response:", data);
               if (data.success) {
                  console.log(
                     "Payment Success DEBUG - Order data:",
                     data.order
                  );
                  setOrder(data.order);
               } else {
                  console.error("Failed to fetch order:", data.error);
                  // Fallback to basic order info
                  setOrder({
                     _id: orderId,
                     totalPrice: 0,
                     orderItems: [],
                  });
               }
            })
            .catch((error) => {
               console.error("Error fetching order:", error);
               // Fallback to basic order info
               setOrder({
                  _id: orderId,
                  totalPrice: 0,
                  orderItems: [],
               });
            })
            .finally(() => {
               setLoading(false);
            });
      }
   }, [orderId, cartCleared]);

   if (loading) {
      return (
         <div className="min-h-screen bg-background flex items-center justify-center">
            <div className="text-center">
               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
               <p className="mt-4 text-muted-foreground">Đang tải...</p>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-background">
         <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
               <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />

               <h1 className="text-3xl font-bold text-foreground mb-4">
                  Thanh toán thành công!
               </h1>

               <p className="text-muted-foreground mb-8">
                  {auctionOrder === "true"
                     ? "Cảm ơn bạn đã thanh toán đấu giá. Đơn hàng của bạn đã được xác nhận và sẽ được xử lý sớm nhất."
                     : "Cảm ơn bạn đã mua sắm. Đơn hàng của bạn đã được xác nhận và sẽ được xử lý sớm nhất. Giỏ hàng của bạn đã được xóa."}
               </p>

               {order && (
                  <div className="bg-card rounded-lg shadow-md p-6 mb-8">
                     <h2 className="text-lg font-semibold text-foreground mb-4">
                        Chi tiết đơn hàng
                     </h2>

                     <div className="space-y-2 text-left">
                        <div className="flex justify-between">
                           <span className="text-muted-foreground">
                              Mã đơn hàng:
                           </span>
                           <span className="font-semibold text-foreground">
                              {order._id}
                           </span>
                        </div>

                        <div className="flex justify-between">
                           <span className="text-muted-foreground">
                              Tổng tiền:
                           </span>
                           <span className="font-semibold text-green-600">
                              {new Intl.NumberFormat("vi-VN", {
                                 style: "currency",
                                 currency: "VND",
                              }).format(order.totalPrice)}
                           </span>
                        </div>

                        <div className="flex justify-between">
                           <span className="text-muted-foreground">
                              Số lượng sản phẩm:
                           </span>
                           <span className="font-semibold text-foreground">
                              {order.orderItems?.length || 0}
                           </span>
                        </div>

                        <div className="flex justify-between">
                           <span className="text-muted-foreground">
                              Trạng thái:
                           </span>
                           <span className="font-semibold text-green-600">
                              Đã thanh toán
                           </span>
                        </div>
                     </div>
                  </div>
               )}

               <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                     <Package className="w-4 h-4" />
                     <span>
                        {auctionOrder === "true"
                           ? "Sản phẩm đấu giá sẽ được giao trong 3-5 ngày làm việc"
                           : "Đơn hàng sẽ được giao trong 3-5 ngày làm việc"}
                     </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <Link href="/dashboard">
                        <Button variant="outline" className="w-full sm:w-auto">
                           <ShoppingBag className="w-4 h-4 mr-2" />
                           Xem đơn hàng
                        </Button>
                     </Link>

                     <Link
                        href={
                           auctionOrder === "true" ? "/auctions" : "/products"
                        }
                     >
                        <Button className="w-full sm:w-auto">
                           <Home className="w-4 h-4 mr-2" />
                           {auctionOrder === "true"
                              ? "Xem đấu giá khác"
                              : "Tiếp tục mua sắm"}
                        </Button>
                     </Link>
                  </div>
               </div>

               <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                     Bạn sẽ nhận được email xác nhận đơn hàng trong vài phút
                     tới.
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}

function PaymentSuccessFallback() {
   return (
      <div className="min-h-screen bg-background flex items-center justify-center">
         <div className="text-center">
            <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-foreground mb-4">
               Đang tải...
            </h1>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">
               Đang xử lý thông tin thanh toán...
            </p>
         </div>
      </div>
   );
}

export default function PaymentSuccessPage() {
   return (
      <Suspense fallback={<PaymentSuccessFallback />}>
         <PaymentSuccessContent />
      </Suspense>
   );
}
