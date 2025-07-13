"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import BidForm from "@/components/BidForm";
import BidHistory from "@/components/BidHistory";
import {
   Clock,
   Users,
   DollarSign,
   Tag,
   Calendar,
   User,
   AlertCircle,
   CheckCircle,
   Loader2,
} from "lucide-react";

interface Auction {
   _id: string;
   title: string;
   description: string;
   startingPrice: number;
   currentPrice: number;
   minIncrement: number;
   images: string[];
   category: string;
   condition: string;
   endTime: string;
   status: string;
   participants: Array<{ _id: string; name: string; email: string }>;
   maxParticipants: number;
   bids: Array<{
      _id: string;
      bidder: { _id: string; name: string; email: string };
      amount: number;
      timestamp: string;
   }>;
   createdBy: { _id: string; name: string; email: string };
   winner?: { _id: string; name: string; email: string };
   winnerAmount?: number;
}

export default function AuctionDetailPage() {
   const params = useParams();
   const { data: session } = useSession();
   const [auction, setAuction] = useState<Auction | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState("");
   const [isParticipant, setIsParticipant] = useState(false);
   const [joining, setJoining] = useState(false);
   const [currentImageIndex, setCurrentImageIndex] = useState(0);

   const auctionId = params.id as string;

   const fetchAuction = async () => {
      try {
         setLoading(true);
         const response = await fetch(`/api/auctions/${auctionId}`);
         const data = await response.json();

         if (response.ok) {
            setAuction(data);
            // Check if current user is a participant
            if (session?.user?.id) {
               setIsParticipant(
                  data.participants.some((p: any) => p._id === session.user.id)
               );
            }
         } else {
            setError(data.error || "Không thể tải thông tin phiên đấu giá");
         }
      } catch (error) {
         setError("Có lỗi xảy ra khi tải thông tin phiên đấu giá");
      } finally {
         setLoading(false);
      }
   };

   const handleJoinAuction = async () => {
      if (!session) {
         setError("Bạn cần đăng nhập để tham gia");
         return;
      }

      try {
         setJoining(true);
         const response = await fetch(`/api/auctions/${auctionId}/join`, {
            method: "POST",
         });

         const data = await response.json();

         if (response.ok) {
            setIsParticipant(true);
            setAuction(data);
         } else {
            setError(data.error || "Không thể tham gia phiên đấu giá");
         }
      } catch (error) {
         setError("Có lỗi xảy ra khi tham gia phiên đấu giá");
      } finally {
         setJoining(false);
      }
   };

   const handleBidPlaced = () => {
      fetchAuction();
   };

   useEffect(() => {
      if (auctionId) {
         fetchAuction();
      }
   }, [auctionId, session]);

   // Auto-refresh for active auctions
   useEffect(() => {
      if (auction?.status === "active") {
         const interval = setInterval(() => {
            fetchAuction();
         }, 5000); // Refresh every 5 seconds

         return () => clearInterval(interval);
      }
   }, [auction?.status]);

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

   const getStatusColor = (status: string) => {
      switch (status) {
         case "upcoming":
            return "bg-blue-500";
         case "active":
            return "bg-green-500";
         case "ended":
            return "bg-red-500";
         case "cancelled":
            return "bg-gray-500";
         default:
            return "bg-gray-500";
      }
   };

   const getStatusText = (status: string) => {
      switch (status) {
         case "upcoming":
            return "Sắp diễn ra";
         case "active":
            return "Đang diễn ra";
         case "ended":
            return "Đã kết thúc";
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

   const timeRemaining = () => {
      if (!auction || auction.status !== "active") return null;

      const now = new Date();
      const endTime = new Date(auction.endTime);
      const diff = endTime.getTime() - now.getTime();

      if (diff <= 0) return "Đã kết thúc";

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
         (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (days > 0) return `${days} ngày ${hours} giờ ${minutes} phút`;
      if (hours > 0) return `${hours} giờ ${minutes} phút ${seconds} giây`;
      if (minutes > 0) return `${minutes} phút ${seconds} giây`;
      return `${seconds} giây`;
   };

   if (loading) {
      return (
         <div className="container mx-auto px-4 py-8">
            <div className="flex justify-center items-center py-12">
               <Loader2 className="h-8 w-8 animate-spin" />
            </div>
         </div>
      );
   }

   if (error || !auction) {
      return (
         <div className="container mx-auto px-4 py-8">
            <Card>
               <CardContent className="text-center py-12">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                  <p className="text-lg text-red-600">
                     {error || "Không tìm thấy phiên đấu giá"}
                  </p>
               </CardContent>
            </Card>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-8">
         {/* Header */}
         <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
               <Badge
                  className={`${getStatusColor(auction.status)} text-white`}
               >
                  {getStatusText(auction.status)}
               </Badge>
               <Badge variant="outline">
                  {getCategoryText(auction.category)}
               </Badge>
               {auction.status === "active" && timeRemaining() && (
                  <Badge variant="destructive" className="animate-pulse">
                     <Clock className="h-3 w-3 mr-1" />
                     {timeRemaining()}
                  </Badge>
               )}
            </div>
            <h1 className="text-3xl font-bold mb-2">{auction.title}</h1>
            <p className="text-muted-foreground">{auction.description}</p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
               {/* Image Gallery */}
               <Card>
                  <CardContent className="p-0">
                     <div className="relative h-96 w-full">
                        <Image
                           src={
                              auction.images[currentImageIndex] ||
                              "/placeholder-image.jpg"
                           }
                           alt={auction.title}
                           fill
                           className="object-cover rounded-t-lg"
                        />
                     </div>
                     {auction.images.length > 1 && (
                        <div className="p-4">
                           <div className="flex gap-2 overflow-x-auto">
                              {auction.images.map((image, index) => (
                                 <button
                                    key={index}
                                    onClick={() => setCurrentImageIndex(index)}
                                    className={`relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border-2 ${
                                       index === currentImageIndex
                                          ? "border-primary"
                                          : "border-gray-200"
                                    }`}
                                 >
                                    <Image
                                       src={image}
                                       alt={`${auction.title} ${index + 1}`}
                                       fill
                                       className="object-cover"
                                    />
                                 </button>
                              ))}
                           </div>
                        </div>
                     )}
                  </CardContent>
               </Card>

               {/* Auction Details */}
               <Card>
                  <CardHeader>
                     <CardTitle>Thông tin chi tiết</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                           <DollarSign className="h-4 w-4 text-muted-foreground" />
                           <span className="text-sm text-muted-foreground">
                              Giá khởi điểm:
                           </span>
                           <span className="font-semibold">
                              {formatPrice(auction.startingPrice)}
                           </span>
                        </div>
                        <div className="flex items-center gap-2">
                           <DollarSign className="h-4 w-4 text-green-600" />
                           <span className="text-sm text-muted-foreground">
                              Giá hiện tại:
                           </span>
                           <span className="font-semibold text-green-600 text-lg">
                              {formatPrice(auction.currentPrice)}
                           </span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Users className="h-4 w-4 text-muted-foreground" />
                           <span className="text-sm text-muted-foreground">
                              Tham gia:
                           </span>
                           <span className="font-semibold">
                              {auction.participants.length}/
                              {auction.maxParticipants}
                           </span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Tag className="h-4 w-4 text-muted-foreground" />
                           <span className="text-sm text-muted-foreground">
                              Tình trạng:
                           </span>
                           <span className="font-semibold">
                              {getConditionText(auction.condition)}
                           </span>
                        </div>
                     </div>

                     <Separator />

                     <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                           Kết thúc:
                        </span>
                        <span className="font-semibold">
                           {formatDate(auction.endTime)}
                        </span>
                     </div>

                     <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                           Người tạo:
                        </span>
                        <span className="font-semibold">
                           {auction.createdBy.name}
                        </span>
                     </div>

                     {auction.status === "ended" && auction.winner && (
                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                           <div className="flex items-center gap-2 mb-2">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <span className="font-semibold text-green-800">
                                 Kết quả đấu giá
                              </span>
                           </div>
                           <p className="text-sm text-green-700">
                              Người thắng:{" "}
                              <span className="font-semibold">
                                 {auction.winner.name}
                              </span>
                           </p>
                           <p className="text-sm text-green-700">
                              Giá thắng:{" "}
                              <span className="font-semibold">
                                 {formatPrice(auction.winnerAmount!)}
                              </span>
                           </p>
                        </div>
                     )}
                  </CardContent>
               </Card>

               {/* Bid History */}
               <BidHistory
                  bids={auction.bids}
                  currentPrice={auction.currentPrice}
                  minIncrement={auction.minIncrement}
               />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
               {/* Join Auction */}
               {!isParticipant && auction.status === "active" && (
                  <Card>
                     <CardHeader>
                        <CardTitle>Tham gia đấu giá</CardTitle>
                     </CardHeader>
                     <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                           Bạn cần tham gia phiên đấu giá để có thể đặt giá
                        </p>
                        <Button
                           onClick={handleJoinAuction}
                           disabled={joining}
                           className="w-full"
                        >
                           {joining ? (
                              <>
                                 <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                 Đang tham gia...
                              </>
                           ) : (
                              "Tham gia phiên đấu giá"
                           )}
                        </Button>
                     </CardContent>
                  </Card>
               )}

               {/* Bid Form */}
               {auction.status === "active" && (
                  <BidForm
                     auctionId={auction._id}
                     currentPrice={auction.currentPrice}
                     minIncrement={auction.minIncrement}
                     isParticipant={isParticipant}
                     onBidPlaced={handleBidPlaced}
                  />
               )}

               {/* Participants */}
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        Người tham gia ({auction.participants.length}/
                        {auction.maxParticipants})
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     {auction.participants.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                           Chưa có người tham gia
                        </p>
                     ) : (
                        <div className="space-y-2">
                           {auction.participants.map((participant) => (
                              <div
                                 key={participant._id}
                                 className="flex items-center gap-2"
                              >
                                 <User className="h-4 w-4 text-muted-foreground" />
                                 <span className="text-sm">
                                    {participant.name}
                                 </span>
                              </div>
                           ))}
                        </div>
                     )}
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
