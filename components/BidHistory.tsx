"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";

interface Bid {
   _id: string;
   bidder: {
      _id: string;
      name: string;
      email: string;
   };
   amount: number;
   timestamp: string;
}

interface BidHistoryProps {
   bids: Bid[];
   currentPrice: number;
   minIncrement: number;
}

const BidHistory: React.FC<BidHistoryProps> = ({
   bids,
   currentPrice,
   minIncrement,
}) => {
   const formatPrice = (price: number) => {
      return new Intl.NumberFormat("vi-VN", {
         style: "currency",
         currency: "VND",
      }).format(price);
   };

   const formatTime = (timestamp: string) => {
      return new Date(timestamp).toLocaleString("vi-VN", {
         year: "numeric",
         month: "2-digit",
         day: "2-digit",
         hour: "2-digit",
         minute: "2-digit",
         second: "2-digit",
      });
   };

   const getTimeAgo = (timestamp: string) => {
      const now = new Date();
      const bidTime = new Date(timestamp);
      const diff = now.getTime() - bidTime.getTime();

      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (days > 0) return `${days} ngày trước`;
      if (hours > 0) return `${hours} giờ trước`;
      if (minutes > 0) return `${minutes} phút trước`;
      return "Vừa xong";
   };

   const sortedBids = [...bids].sort(
      (a, b) =>
         new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
   );

   return (
      <Card>
         <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <Clock className="h-5 w-5" />
               Lịch sử đấu giá
            </CardTitle>
            <div className="text-sm text-muted-foreground">
               Giá hiện tại:{" "}
               <span className="font-semibold text-green-600">
                  {formatPrice(currentPrice)}
               </span>
               <br />
               Tăng tối thiểu:{" "}
               <span className="font-semibold">
                  {formatPrice(minIncrement)}
               </span>
            </div>
         </CardHeader>
         <CardContent>
            {sortedBids.length === 0 ? (
               <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Chưa có lượt đấu giá nào</p>
               </div>
            ) : (
               <div className="space-y-3 max-h-96 overflow-y-auto">
                  {sortedBids.map((bid, index) => (
                     <div
                        key={bid._id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                           index === 0
                              ? "bg-green-50 border-green-200"
                              : "bg-gray-50 border-gray-200"
                        }`}
                     >
                        <div className="flex items-center gap-3">
                           <div className="flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">
                                 {bid.bidder.name}
                              </span>
                              {index === 0 && (
                                 <Badge className="bg-green-500 text-white text-xs">
                                    Cao nhất
                                 </Badge>
                              )}
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="font-semibold text-lg text-green-600">
                              {formatPrice(bid.amount)}
                           </div>
                           <div className="text-xs text-muted-foreground">
                              {getTimeAgo(bid.timestamp)}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </CardContent>
      </Card>
   );
};

export default BidHistory;
