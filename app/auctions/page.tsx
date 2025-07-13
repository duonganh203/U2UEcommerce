"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import AuctionCard from "@/components/AuctionCard";
import { Search, Filter, Plus, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Auction {
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
}

interface PaginationInfo {
   page: number;
   limit: number;
   total: number;
   pages: number;
}

export default function AuctionsPage() {
   const { data: session } = useSession();
   const [auctions, setAuctions] = useState<Auction[]>([]);
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [statusFilter, setStatusFilter] = useState("all");
   const [categoryFilter, setCategoryFilter] = useState("all");
   const [pagination, setPagination] = useState<PaginationInfo>({
      page: 1,
      limit: 12,
      total: 0,
      pages: 0,
   });

   const categories = [
      { value: "electronics", label: "Điện tử" },
      { value: "jewelry", label: "Trang sức" },
      { value: "art", label: "Nghệ thuật" },
      { value: "collectibles", label: "Sưu tầm" },
      { value: "fashion", label: "Thời trang" },
      { value: "sports", label: "Thể thao" },
      { value: "books", label: "Sách" },
      { value: "other", label: "Khác" },
   ];

   const statuses = [
      { value: "pending", label: "Chờ duyệt" },
      { value: "approved", label: "Đã duyệt" },
      { value: "active", label: "Đang diễn ra" },
      { value: "ended", label: "Đã kết thúc" },
      { value: "rejected", label: "Bị từ chối" },
      { value: "cancelled", label: "Đã hủy" },
   ];

   const fetchAuctions = async (page = 1) => {
      try {
         setLoading(true);
         const params = new URLSearchParams({
            page: page.toString(),
            limit: pagination.limit.toString(),
         });

         if (searchTerm) params.append("search", searchTerm);
         if (statusFilter && statusFilter !== "all")
            params.append("status", statusFilter);
         if (categoryFilter && categoryFilter !== "all")
            params.append("category", categoryFilter);

         const response = await fetch(`/api/auctions?${params}`);
         const data = await response.json();

         if (response.ok) {
            setAuctions(data.auctions);
            setPagination(data.pagination);
         } else {
            console.error("Failed to fetch auctions:", data.error);
         }
      } catch (error) {
         console.error("Error fetching auctions:", error);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      fetchAuctions();
   }, []);

   useEffect(() => {
      const timeoutId = setTimeout(() => {
         fetchAuctions(1);
      }, 500);

      return () => clearTimeout(timeoutId);
   }, [searchTerm, statusFilter, categoryFilter]);

   const handlePageChange = (page: number) => {
      fetchAuctions(page);
   };

   const clearFilters = () => {
      setSearchTerm("");
      setStatusFilter("all");
      setCategoryFilter("all");
   };

   const getStatusCount = (status: string) => {
      return auctions.filter((auction) => auction.status === status).length;
   };

   return (
      <div className="container mx-auto px-4 py-8">
         {/* Header */}
         <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
               <h1 className="text-3xl font-bold">Phiên đấu giá</h1>
               <p className="text-muted-foreground mt-2">
                  Khám phá và tham gia các phiên đấu giá độc đáo
               </p>
            </div>
            {session && (
               <Link href="/auctions/create">
                  <Button className="flex items-center gap-2">
                     <Plus className="h-4 w-4" />
                     Tạo phiên đấu giá
                  </Button>
               </Link>
            )}
         </div>

         {/* Stats */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
               <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                     {getStatusCount("pending")}
                  </div>
                  <p className="text-sm text-muted-foreground">Chờ duyệt</p>
               </CardContent>
            </Card>
            <Card>
               <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                     {getStatusCount("active")}
                  </div>
                  <p className="text-sm text-muted-foreground">Đang diễn ra</p>
               </CardContent>
            </Card>
            <Card>
               <CardContent className="p-4">
                  <div className="text-2xl font-bold text-red-600">
                     {getStatusCount("ended")}
                  </div>
                  <p className="text-sm text-muted-foreground">Đã kết thúc</p>
               </CardContent>
            </Card>
            <Card>
               <CardContent className="p-4">
                  <div className="text-2xl font-bold text-gray-600">
                     {pagination.total}
                  </div>
                  <p className="text-sm text-muted-foreground">Tổng cộng</p>
               </CardContent>
            </Card>
         </div>

         {/* Filters */}
         <Card className="mb-8">
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Bộ lọc
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input
                        placeholder="Tìm kiếm phiên đấu giá..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                     />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                     <SelectTrigger>
                        <SelectValue placeholder="Trạng thái" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                        {statuses.map((status) => (
                           <SelectItem key={status.value} value={status.value}>
                              {status.label}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>

                  <Select
                     value={categoryFilter}
                     onValueChange={setCategoryFilter}
                  >
                     <SelectTrigger>
                        <SelectValue placeholder="Danh mục" />
                     </SelectTrigger>
                     <SelectContent>
                        <SelectItem value="all">Tất cả danh mục</SelectItem>
                        {categories.map((category) => (
                           <SelectItem
                              key={category.value}
                              value={category.value}
                           >
                              {category.label}
                           </SelectItem>
                        ))}
                     </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={clearFilters}>
                     Xóa bộ lọc
                  </Button>
               </div>
            </CardContent>
         </Card>

         {/* Auctions Grid */}
         {loading ? (
            <div className="flex justify-center items-center py-12">
               <Loader2 className="h-8 w-8 animate-spin" />
            </div>
         ) : auctions.length === 0 ? (
            <Card>
               <CardContent className="text-center py-12">
                  <div className="text-muted-foreground">
                     <p className="text-lg mb-2">
                        Không tìm thấy phiên đấu giá nào
                     </p>
                     <p>Thử thay đổi bộ lọc hoặc tạo phiên đấu giá mới</p>
                  </div>
               </CardContent>
            </Card>
         ) : (
            <>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                  {auctions.map((auction) => (
                     <AuctionCard key={auction._id} auction={auction} />
                  ))}
               </div>

               {/* Pagination */}
               {pagination.pages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                     <Button
                        variant="outline"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1}
                     >
                        Trước
                     </Button>

                     {Array.from(
                        { length: pagination.pages },
                        (_, i) => i + 1
                     ).map((page) => (
                        <Button
                           key={page}
                           variant={
                              page === pagination.page ? "default" : "outline"
                           }
                           onClick={() => handlePageChange(page)}
                           size="sm"
                        >
                           {page}
                        </Button>
                     ))}

                     <Button
                        variant="outline"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={pagination.page >= pagination.pages}
                     >
                        Sau
                     </Button>
                  </div>
               )}
            </>
         )}
      </div>
   );
}
