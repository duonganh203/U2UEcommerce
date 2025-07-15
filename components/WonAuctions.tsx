"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   Trophy,
   DollarSign,
   Clock,
   CheckCircle,
   AlertCircle,
   Loader2,
   ExternalLink,
} from "lucide-react";
import Link from "next/link";

interface WonAuction {
   _id: string;
   title: string;
   description: string;
   images: string[];
   winnerAmount: number;
   endTime: string;
   status: string;
   existingOrder?: {
      _id: string;
      totalPrice: number;
      isPaid: boolean;
      isDelivered: boolean;
      createdAt: string;
   };
}

export default function WonAuctions() {
   const { data: session } = useSession();
   const [wonAuctions, setWonAuctions] = useState<WonAuction[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");

   const fetchWonAuctions = async () => {
      if (!session?.user?.id) return;

      try {
         setLoading(true);
         const response = await fetch("/api/auctions/won");
         const data = await response.json();

         if (response.ok) {
            // Lấy thông tin payment cho từng auction
            const auctionsWithPaymentInfo = await Promise.all(
               data.auctions.map(async (auction: any) => {
                  try {
                     const paymentResponse = await fetch(
                        `/api/auction-orders/${auction._id}`
                     );
                     const paymentData = await paymentResponse.json();

                     return {
                        ...auction,
                        existingOrder: paymentData.existingOrder,
                     };
                  } catch (error) {
                     console.error(
                        `Error fetching payment info for auction ${auction._id}:`,
                        error
                     );
                     return {
                        ...auction,
                        existingOrder: null,
                     };
                  }
               })
            );

            setWonAuctions(auctionsWithPaymentInfo);
         } else {
            setError(data.error || "Không thể tải danh sách đấu giá đã thắng");
         }
      } catch (error) {
         setError("Có lỗi xảy ra khi tải danh sách đấu giá đã thắng");
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchWonAuctions();
   }, [session]);

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

   const handleCreatePayment = async (auctionId: string) => {
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

   if (loading) {
      return (
         <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
         </div>
      );
   }

   if (error) {
      return (
         <Card>
            <CardContent className="text-center py-8">
               <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
               <p className="text-red-600">{error}</p>
            </CardContent>
         </Card>
      );
   }

   if (wonAuctions.length === 0) {
      return (
         <Card>
            <CardContent className="text-center py-8">
               <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
               <p className="text-muted-foreground">
                  Bạn chưa thắng phiên đấu giá nào
               </p>
               <Link href="/auctions">
                  <Button className="mt-4">
                     <ExternalLink className="h-4 w-4 mr-2" />
                     Xem đấu giá
                  </Button>
               </Link>
            </CardContent>
         </Card>
      );
   }

   return (
      <div className="space-y-6">
         <div className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-600" />
            <h2 className="text-xl font-semibold">Đấu giá đã thắng</h2>
         </div>

         <div className="grid gap-4">
            {wonAuctions.map((auction) => (
               <Card key={auction._id} className="overflow-hidden">
                  <div className="flex">
                     <div className="w-24 h-24 relative flex-shrink-0">
                        <img
                           src={auction.images[0] || "/placeholder-image.jpg"}
                           alt={auction.title}
                           className="w-full h-full object-cover"
                        />
                     </div>
                     <div className="flex-1 p-4">
                        <div className="flex justify-between items-start mb-2">
                           <div>
                              <h3 className="font-semibold text-lg">
                                 {auction.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                 {auction.description}
                              </p>
                           </div>
                           <div className="text-right">
                              <div className="text-lg font-bold text-green-600">
                                 {formatPrice(auction.winnerAmount)}
                              </div>
                              <Badge variant="outline" className="mt-1">
                                 <Clock className="h-3 w-3 mr-1" />
                                 {formatDate(auction.endTime)}
                              </Badge>
                           </div>
                        </div>

                        <div className="flex justify-between items-center">
                           <div className="flex items-center gap-2">
                              {auction.existingOrder ? (
                                 auction.existingOrder.isPaid ? (
                                    <Badge className="bg-green-600 text-white">
                                       <CheckCircle className="h-3 w-3 mr-1" />
                                       Đã thanh toán
                                    </Badge>
                                 ) : (
                                    <Badge className="bg-yellow-600 text-white">
                                       <AlertCircle className="h-3 w-3 mr-1" />
                                       Chờ thanh toán
                                    </Badge>
                                 )
                              ) : (
                                 <Badge className="bg-blue-600 text-white">
                                    <DollarSign className="h-3 w-3 mr-1" />
                                    Cần thanh toán
                                 </Badge>
                              )}
                           </div>

                           <div className="flex gap-2">
                              <Link href={`/auctions/${auction._id}`}>
                                 <Button variant="outline" size="sm">
                                    <ExternalLink className="h-4 w-4 mr-1" />
                                    Xem chi tiết
                                 </Button>
                              </Link>

                              {auction.existingOrder &&
                                 !auction.existingOrder.isPaid && (
                                    <Button
                                       onClick={() =>
                                          handleCreatePayment(auction._id)
                                       }
                                       size="sm"
                                       className="bg-yellow-600 hover:bg-yellow-700"
                                    >
                                       <DollarSign className="h-4 w-4 mr-1" />
                                       Thanh toán
                                    </Button>
                                 )}

                              {!auction.existingOrder && (
                                 <Button
                                    onClick={() =>
                                       handleCreatePayment(auction._id)
                                    }
                                    size="sm"
                                    className="bg-blue-600 hover:bg-blue-700"
                                 >
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    Tạo đơn hàng
                                 </Button>
                              )}
                           </div>
                        </div>

                        {auction.existingOrder && (
                           <div className="mt-2 text-sm text-muted-foreground">
                              <div className="flex justify-between">
                                 <span>Tổng tiền:</span>
                                 <span className="font-semibold">
                                    {formatPrice(
                                       auction.existingOrder.totalPrice
                                    )}
                                 </span>
                              </div>
                              {auction.existingOrder.isDelivered && (
                                 <div className="flex items-center gap-1 mt-1">
                                    <CheckCircle className="h-3 w-3 text-green-600" />
                                    <span className="text-green-600">
                                       Đã giao hàng
                                    </span>
                                 </div>
                              )}
                           </div>
                        )}
                     </div>
                  </div>
               </Card>
            ))}
         </div>
      </div>
   );
}
