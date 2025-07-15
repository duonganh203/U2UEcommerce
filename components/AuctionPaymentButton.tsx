"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
   CreditCard,
   CheckCircle,
   AlertCircle,
   Loader2,
   DollarSign,
} from "lucide-react";

interface AuctionPaymentButtonProps {
   auctionId: string;
}

interface PaymentInfo {
   auction: {
      _id: string;
      title: string;
      winnerAmount: number;
      status: string;
      endTime: string;
   };
   existingOrder: {
      _id: string;
      totalPrice: number;
      isPaid: boolean;
      isDelivered: boolean;
      createdAt: string;
   } | null;
}

export default function AuctionPaymentButton({
   auctionId,
}: AuctionPaymentButtonProps) {
   const [paymentInfo, setPaymentInfo] = useState<PaymentInfo | null>(null);
   const [loading, setLoading] = useState(true);
   const [processing, setProcessing] = useState(false);
   const [error, setError] = useState("");

   const fetchPaymentInfo = async () => {
      try {
         setLoading(true);
         const response = await fetch(`/api/auction-orders/${auctionId}`);
         const data = await response.json();

         if (response.ok) {
            setPaymentInfo(data);
         } else {
            setError(data.error || "Không thể tải thông tin thanh toán");
         }
      } catch (error) {
         setError("Có lỗi xảy ra khi tải thông tin thanh toán");
      } finally {
         setLoading(false);
      }
   };

   const handleCreatePayment = async () => {
      try {
         setProcessing(true);
         setError("");

         const response = await fetch(`/api/auction-orders/${auctionId}`, {
            method: "POST",
         });

         const data = await response.json();

         if (response.ok) {
            // Chuyển hướng đến trang thanh toán VNPay
            window.location.href = data.paymentUrl;
         } else {
            setError(data.error || "Không thể tạo đơn hàng thanh toán");
         }
      } catch (error) {
         setError("Có lỗi xảy ra khi tạo đơn hàng thanh toán");
      } finally {
         setProcessing(false);
      }
   };

   useEffect(() => {
      fetchPaymentInfo();
   }, [auctionId]);

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat("vi-VN", {
         style: "currency",
         currency: "VND",
      }).format(price);
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

   if (loading) {
      return (
         <div className="flex justify-center items-center py-4">
            <Loader2 className="h-6 w-6 animate-spin" />
         </div>
      );
   }

   if (error) {
      return (
         <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
               <AlertCircle className="h-5 w-5 text-red-600" />
               <span className="font-semibold text-red-800">Lỗi</span>
            </div>
            <p className="text-sm text-red-700">{error}</p>
         </div>
      );
   }

   if (!paymentInfo) {
      return null;
   }

   // Nếu đã có order và đã thanh toán
   if (paymentInfo.existingOrder && paymentInfo.existingOrder.isPaid) {
      return (
         <Card className="border-green-200 bg-green-50">
            <CardHeader className="pb-3">
               <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  Đã thanh toán
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
               <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700">Tổng tiền:</span>
                  <span className="font-semibold text-green-800">
                     {formatPrice(paymentInfo.existingOrder.totalPrice)}
                  </span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700">
                     Ngày thanh toán:
                  </span>
                  <span className="text-sm text-green-700">
                     {formatDate(paymentInfo.existingOrder.createdAt)}
                  </span>
               </div>
               {paymentInfo.existingOrder.isDelivered && (
                  <Badge className="bg-green-600 text-white">
                     <CheckCircle className="h-3 w-3 mr-1" />
                     Đã giao hàng
                  </Badge>
               )}
            </CardContent>
         </Card>
      );
   }

   // Nếu đã có order nhưng chưa thanh toán
   if (paymentInfo.existingOrder && !paymentInfo.existingOrder.isPaid) {
      return (
         <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-3">
               <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <AlertCircle className="h-5 w-5" />
                  Chờ thanh toán
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
               <div className="flex justify-between items-center">
                  <span className="text-sm text-yellow-700">Tổng tiền:</span>
                  <span className="font-semibold text-yellow-800">
                     {formatPrice(paymentInfo.existingOrder.totalPrice)}
                  </span>
               </div>
               <Button
                  onClick={handleCreatePayment}
                  disabled={processing}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
               >
                  {processing ? (
                     <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang xử lý...
                     </>
                  ) : (
                     <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Thanh toán ngay
                     </>
                  )}
               </Button>
            </CardContent>
         </Card>
      );
   }

   // Nếu chưa có order - hiển thị nút tạo order thanh toán
   return (
      <Card className="border-blue-200 bg-blue-50">
         <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-blue-800">
               <DollarSign className="h-5 w-5" />
               Thanh toán đấu giá
            </CardTitle>
         </CardHeader>
         <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
               <span className="text-sm text-blue-700">Giá thắng:</span>
               <span className="font-semibold text-blue-800">
                  {formatPrice(paymentInfo.auction.winnerAmount)}
               </span>
            </div>
            <div className="text-xs text-blue-600">
               * Phí vận chuyển và thuế sẽ được tính thêm
            </div>
            <Button
               onClick={handleCreatePayment}
               disabled={processing}
               className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
               {processing ? (
                  <>
                     <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                     Đang tạo đơn hàng...
                  </>
               ) : (
                  <>
                     <CreditCard className="h-4 w-4 mr-2" />
                     Tạo đơn hàng thanh toán
                  </>
               )}
            </Button>
         </CardContent>
      </Card>
   );
}
