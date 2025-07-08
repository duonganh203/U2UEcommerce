"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   CheckCircle,
   XCircle,
   Clock,
   Loader2,
   Eye,
   AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface Auction {
   _id: string;
   title: string;
   description: string;
   startingPrice: number;
   currentPrice: number;
   images: string[];
   category: string;
   condition: string;
   startTime: string;
   endTime: string;
   status: string;
   participants: Array<{ _id: string; name: string; email: string }>;
   maxParticipants: number;
   createdBy: { _id: string; name: string; email: string };
   createdAt: string;
}

export default function AdminAuctionsPage() {
   const { data: session } = useSession();
   const [auctions, setAuctions] = useState<Auction[]>([]);
   const [loading, setLoading] = useState(true);
   const [statusFilter, setStatusFilter] = useState("pending");
   const [processingId, setProcessingId] = useState<string | null>(null);

   const statuses = [
      { value: "pending", label: "Chờ duyệt" },
      { value: "approved", label: "Đã duyệt" },
      { value: "active", label: "Đang diễn ra" },
      { value: "ended", label: "Đã kết thúc" },
      { value: "rejected", label: "Bị từ chối" },
      { value: "cancelled", label: "Đã hủy" },
   ];

   const fetchAuctions = async () => {
      try {
         setLoading(true);
         const response = await fetch(`/api/auctions?status=${statusFilter}`);
         const data = await response.json();

         if (response.ok) {
            setAuctions(data.auctions);
         } else {
            console.error("Failed to fetch auctions:", data.error);
         }
      } catch (error) {
         console.error("Error fetching auctions:", error);
      } finally {
         setLoading(false);
      }
   };

   const handleApprove = async (auctionId: string) => {
      try {
         setProcessingId(auctionId);
         const response = await fetch(
            `/api/admin/auctions/${auctionId}/approve`,
            {
               method: "POST",
            }
         );

         if (response.ok) {
            fetchAuctions();
         } else {
            const data = await response.json();
            alert(data.error || "Có lỗi xảy ra");
         }
      } catch (error) {
         console.error("Error approving auction:", error);
         alert("Có lỗi xảy ra");
      } finally {
         setProcessingId(null);
      }
   };

   const handleReject = async (auctionId: string) => {
      const reason = prompt("Lý do từ chối:");
      if (!reason) return;

      try {
         setProcessingId(auctionId);
         const response = await fetch(
            `/api/admin/auctions/${auctionId}/reject`,
            {
               method: "POST",
               headers: {
                  "Content-Type": "application/json",
               },
               body: JSON.stringify({ reason }),
            }
         );

         if (response.ok) {
            fetchAuctions();
         } else {
            const data = await response.json();
            alert(data.error || "Có lỗi xảy ra");
         }
      } catch (error) {
         console.error("Error rejecting auction:", error);
         alert("Có lỗi xảy ra");
      } finally {
         setProcessingId(null);
      }
   };

   useEffect(() => {
      fetchAuctions();
   }, [statusFilter]);

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

   if (!session || session.user.role !== "admin") {
      return (
         <div className="container mx-auto px-4 py-8">
            <Card>
               <CardContent className="text-center py-12">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-red-500" />
                  <p className="text-lg text-red-600">
                     Bạn không có quyền truy cập trang này
                  </p>
               </CardContent>
            </Card>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-8">
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
               <h1 className="text-3xl font-bold">Quản lý phiên đấu giá</h1>
               <p className="text-muted-foreground mt-2">
                  Duyệt và quản lý các phiên đấu giá
               </p>
            </div>
         </div>

         {/* Filter */}
         <Card className="mb-8">
            <CardHeader>
               <CardTitle>Bộ lọc</CardTitle>
            </CardHeader>
            <CardContent>
               <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-64">
                     <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                     {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                           {status.label}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </CardContent>
         </Card>

         {/* Auctions List */}
         {loading ? (
            <div className="flex justify-center items-center py-12">
               <Loader2 className="h-8 w-8 animate-spin" />
            </div>
         ) : auctions.length === 0 ? (
            <Card>
               <CardContent className="text-center py-12">
                  <div className="text-muted-foreground">
                     <p className="text-lg mb-2">Không có phiên đấu giá nào</p>
                     <p>Thử thay đổi bộ lọc</p>
                  </div>
               </CardContent>
            </Card>
         ) : (
            <div className="space-y-4">
               {auctions.map((auction) => (
                  <Card key={auction._id}>
                     <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-4">
                           {/* Image */}
                           <div className="w-24 h-24 flex-shrink-0">
                              <img
                                 src={
                                    auction.images[0] ||
                                    "/placeholder-image.jpg"
                                 }
                                 alt={auction.title}
                                 className="w-full h-full object-cover rounded-lg"
                              />
                           </div>

                           {/* Content */}
                           <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                 <div>
                                    <h3 className="font-semibold text-lg">
                                       {auction.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                       {auction.description}
                                    </p>
                                 </div>
                                 <Badge
                                    className={`${getStatusColor(
                                       auction.status
                                    )} text-white`}
                                 >
                                    {getStatusText(auction.status)}
                                 </Badge>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                 <div>
                                    <span className="text-muted-foreground">
                                       Giá khởi điểm:
                                    </span>
                                    <div className="font-semibold">
                                       {formatPrice(auction.startingPrice)}
                                    </div>
                                 </div>
                                 <div>
                                    <span className="text-muted-foreground">
                                       Giá hiện tại:
                                    </span>
                                    <div className="font-semibold text-green-600">
                                       {formatPrice(auction.currentPrice)}
                                    </div>
                                 </div>
                                 <div>
                                    <span className="text-muted-foreground">
                                       Tham gia:
                                    </span>
                                    <div>
                                       {auction.participants.length}/
                                       {auction.maxParticipants}
                                    </div>
                                 </div>
                                 <div>
                                    <span className="text-muted-foreground">
                                       Người tạo:
                                    </span>
                                    <div>{auction.createdBy.name}</div>
                                 </div>
                              </div>

                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-2">
                                 <div>
                                    <span className="text-muted-foreground">
                                       Bắt đầu:
                                    </span>
                                    <div>{formatDate(auction.startTime)}</div>
                                 </div>
                                 <div>
                                    <span className="text-muted-foreground">
                                       Kết thúc:
                                    </span>
                                    <div>{formatDate(auction.endTime)}</div>
                                 </div>
                                 <div>
                                    <span className="text-muted-foreground">
                                       Tạo lúc:
                                    </span>
                                    <div>{formatDate(auction.createdAt)}</div>
                                 </div>
                              </div>
                           </div>

                           {/* Actions */}
                           <div className="flex flex-col gap-2">
                              <Link href={`/auctions/${auction._id}`}>
                                 <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full"
                                 >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Xem chi tiết
                                 </Button>
                              </Link>

                              {auction.status === "pending" && (
                                 <>
                                    <Button
                                       onClick={() =>
                                          handleApprove(auction._id)
                                       }
                                       disabled={processingId === auction._id}
                                       size="sm"
                                       className="w-full bg-green-600 hover:bg-green-700"
                                    >
                                       {processingId === auction._id ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                       ) : (
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                       )}
                                       Duyệt
                                    </Button>

                                    <Button
                                       onClick={() => handleReject(auction._id)}
                                       disabled={processingId === auction._id}
                                       variant="destructive"
                                       size="sm"
                                       className="w-full"
                                    >
                                       {processingId === auction._id ? (
                                          <Loader2 className="h-4 w-4 animate-spin" />
                                       ) : (
                                          <XCircle className="h-4 w-4 mr-2" />
                                       )}
                                       Từ chối
                                    </Button>
                                 </>
                              )}
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>
         )}
      </div>
   );
}
