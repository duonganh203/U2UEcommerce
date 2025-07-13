"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, DollarSign, Tag } from "lucide-react";

interface AuctionCardProps {
   auction: {
      _id: string;
      title: string;
      description: string;
      startingPrice: number;
      currentPrice: number;
      images: string[];
      category: string;
      condition: string;
      endTime: string;
      status: string;
      participants: Array<{ _id: string; name: string; email: string }>;
      maxParticipants: number;
      createdBy: { _id: string; name: string; email: string };
   };
}

const AuctionCard: React.FC<AuctionCardProps> = ({ auction }) => {
   const getStatusColor = (status: string) => {
      switch (status) {
         case "pending":
            return "bg-yellow-500";
         case "approved":
            return "bg-blue-500";
         case "active":
            return "bg-green-500";
         case "ended":
            return "bg-red-500";
         case "rejected":
            return "bg-red-600";
         case "cancelled":
            return "bg-gray-500";
         default:
            return "bg-gray-500";
      }
   };

   const getStatusText = (status: string) => {
      switch (status) {
         case "pending":
            return "Chờ duyệt";
         case "approved":
            return "Đã duyệt";
         case "active":
            return "Đang diễn ra";
         case "ended":
            return "Đã kết thúc";
         case "rejected":
            return "Bị từ chối";
         case "cancelled":
            return "Đã hủy";
         default:
            return status;
      }
   };

   const getConditionText = (condition: string) => {
      switch (condition) {
         case "new":
            return "Mới";
         case "like-new":
            return "Như mới";
         case "good":
            return "Tốt";
         case "fair":
            return "Khá";
         case "poor":
            return "Kém";
         default:
            return condition;
      }
   };

   const getCategoryText = (category: string) => {
      switch (category) {
         case "electronics":
            return "Điện tử";
         case "jewelry":
            return "Trang sức";
         case "art":
            return "Nghệ thuật";
         case "collectibles":
            return "Sưu tầm";
         case "fashion":
            return "Thời trang";
         case "sports":
            return "Thể thao";
         case "books":
            return "Sách";
         case "other":
            return "Khác";
         default:
            return category;
      }
   };

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat("vi-VN", {
         style: "currency",
         currency: "VND",
      }).format(price);
   };

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("vi-VN", {
         year: "numeric",
         month: "short",
         day: "numeric",
         hour: "2-digit",
         minute: "2-digit",
      });
   };

   const timeRemaining = () => {
      const now = new Date();
      const endTime = new Date(auction.endTime);
      const diff = endTime.getTime() - now.getTime();

      if (diff <= 0) return "Đã kết thúc";

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
         (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) return `${days} ngày ${hours} giờ`;
      if (hours > 0) return `${hours} giờ ${minutes} phút`;
      return `${minutes} phút`;
   };

   return (
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
         <div className="relative h-48 w-full">
            <Image
               src={auction.images[0] || "/placeholder-image.jpg"}
               alt={auction.title}
               fill
               className="object-cover"
            />
            <div className="absolute top-2 left-2">
               <Badge
                  className={`${getStatusColor(auction.status)} text-white`}
               >
                  {getStatusText(auction.status)}
               </Badge>
            </div>
            <div className="absolute top-2 right-2">
               <Badge variant="secondary" className="bg-black/50 text-white">
                  {getCategoryText(auction.category)}
               </Badge>
            </div>
         </div>

         <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
               <h3 className="font-semibold text-lg line-clamp-2">
                  {auction.title}
               </h3>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
               {auction.description}
            </p>
         </CardHeader>

         <CardContent className="pb-2">
            <div className="space-y-2">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                     <DollarSign className="h-4 w-4" />
                     <span>Giá hiện tại:</span>
                  </div>
                  <span className="font-semibold text-lg text-green-600">
                     {formatPrice(auction.currentPrice)}
                  </span>
               </div>

               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                     <Users className="h-4 w-4" />
                     <span>Tham gia:</span>
                  </div>
                  <span className="text-sm">
                     {auction.participants.length}/{auction.maxParticipants}
                  </span>
               </div>

               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                     <Tag className="h-4 w-4" />
                     <span>Tình trạng:</span>
                  </div>
                  <span className="text-sm">
                     {getConditionText(auction.condition)}
                  </span>
               </div>

               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                     <Clock className="h-4 w-4" />
                     <span>Kết thúc:</span>
                  </div>
                  <span className="text-sm">{formatDate(auction.endTime)}</span>
               </div>

               {auction.status === "active" && (
                  <div className="bg-orange-50 p-2 rounded-md">
                     <div className="flex items-center gap-1 text-sm text-orange-700">
                        <Clock className="h-4 w-4" />
                        <span>Còn lại: {timeRemaining()}</span>
                     </div>
                  </div>
               )}
            </div>
         </CardContent>

         <CardFooter className="pt-2">
            <Link href={`/auctions/${auction._id}`} className="w-full">
               <Button
                  className="w-full"
                  variant={auction.status === "active" ? "default" : "outline"}
               >
                  {auction.status === "active"
                     ? "Tham gia đấu giá"
                     : "Xem chi tiết"}
               </Button>
            </Link>
         </CardFooter>
      </Card>
   );
};

export default AuctionCard;
