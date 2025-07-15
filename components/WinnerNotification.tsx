"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, Bell, DollarSign, Clock, CheckCircle, X } from "lucide-react";
import Link from "next/link";

interface WinnerNotificationProps {
   auctionId: string;
   onClose?: () => void;
}

interface NotificationData {
   auction: {
      _id: string;
      title: string;
      winnerAmount: number;
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

export default function WinnerNotification({
   auctionId,
   onClose,
}: WinnerNotificationProps) {
   const { data: session } = useSession();
   const [notificationData, setNotificationData] =
      useState<NotificationData | null>(null);
   const [loading, setLoading] = useState(true);
   const [showNotification, setShowNotification] = useState(true);

   const fetchNotificationData = async () => {
      if (!session?.user?.id) return;

      try {
         setLoading(true);
         const response = await fetch(`/api/auction-orders/${auctionId}`);
         const data = await response.json();

         if (response.ok) {
            setNotificationData(data);
         }
      } catch (error) {
         console.error("Error fetching notification data:", error);
      } finally {
         setLoading(false);
      }
   };

   const handleCreatePayment = async () => {
      try {
         const response = await fetch(`/api/auction-orders/${auctionId}`, {
            method: "POST",
         });

         const data = await response.json();

         if (response.ok) {
            window.location.href = data.paymentUrl;
         } else {
            alert(data.error || "Không thể tạo đơn hàng thanh toán");
         }
      } catch (error) {
         alert("Có lỗi xảy ra khi tạo đơn hàng thanh toán");
      }
   };

   const handleClose = () => {
      setShowNotification(false);
      onClose?.();
   };

   useEffect(() => {
      fetchNotificationData();
   }, [session, auctionId]);

   if (loading || !notificationData || !showNotification) {
      return null;
   }

   // Chỉ hiển thị cho người thắng cuộc
   if (!session?.user?.id) {
      return null;
   }

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

   return (
      <div className="fixed top-4 right-4 z-50 max-w-md w-full">
         <Card className="border-green-200 bg-green-50 shadow-lg">
            <CardHeader className="pb-3">
               <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                     <Trophy className="h-5 w-5" />
                     Chúc mừng! Bạn đã thắng
                  </CardTitle>
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={handleClose}
                     className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
                  >
                     <X className="h-4 w-4" />
                  </Button>
               </div>
            </CardHeader>
            <CardContent className="space-y-3">
               <div className="space-y-2">
                  <h3 className="font-semibold text-green-800">
                     {notificationData.auction.title}
                  </h3>
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-green-700">Giá thắng:</span>
                     <span className="font-bold text-green-800 text-lg">
                        {formatPrice(notificationData.auction.winnerAmount)}
                     </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-green-600">
                     <Clock className="h-3 w-3" />
                     <span>
                        Kết thúc: {formatDate(notificationData.auction.endTime)}
                     </span>
                  </div>
               </div>

               {notificationData.existingOrder ? (
                  notificationData.existingOrder.isPaid ? (
                     <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-700">
                           Đã thanh toán
                        </span>
                     </div>
                  ) : (
                     <div className="space-y-2">
                        <div className="flex justify-between items-center">
                           <span className="text-sm text-green-700">
                              Tổng tiền:
                           </span>
                           <span className="font-semibold text-green-800">
                              {formatPrice(
                                 notificationData.existingOrder.totalPrice
                              )}
                           </span>
                        </div>
                        <Button
                           onClick={handleCreatePayment}
                           className="w-full bg-green-600 hover:bg-green-700 text-white"
                        >
                           <DollarSign className="h-4 w-4 mr-2" />
                           Thanh toán ngay
                        </Button>
                     </div>
                  )
               ) : (
                  <div className="space-y-2">
                     <p className="text-sm text-green-700">
                        Bạn cần tạo đơn hàng thanh toán để hoàn tất giao dịch
                     </p>
                     <Button
                        onClick={handleCreatePayment}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                     >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Tạo đơn hàng thanh toán
                     </Button>
                  </div>
               )}

               <div className="pt-2 border-t border-green-200">
                  <Link href={`/auctions/${auctionId}`}>
                     <Button
                        variant="outline"
                        size="sm"
                        className="w-full text-green-700 border-green-300"
                     >
                        Xem chi tiết đấu giá
                     </Button>
                  </Link>
               </div>
            </CardContent>
         </Card>
      </div>
   );
}
