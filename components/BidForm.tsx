"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DollarSign, AlertCircle, CheckCircle } from "lucide-react";
import { useSession } from "next-auth/react";

interface BidFormProps {
   auctionId: string;
   currentPrice: number;
   minIncrement: number;
   isParticipant: boolean;
   onBidPlaced: () => void;
}

const BidForm: React.FC<BidFormProps> = ({
   auctionId,
   currentPrice,
   minIncrement,
   isParticipant,
   onBidPlaced,
}) => {
   const { data: session } = useSession();
   const [bidAmount, setBidAmount] = useState("");
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState("");
   const [success, setSuccess] = useState("");

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat("vi-VN", {
         style: "currency",
         currency: "VND",
      }).format(price);
   };

   const minBidAmount = currentPrice + minIncrement;

   const handleBidSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!session) {
         setError("Bạn cần đăng nhập để đấu giá");
         return;
      }

      if (!isParticipant) {
         setError("Bạn cần tham gia phiên đấu giá trước");
         return;
      }

      const amount = parseFloat(bidAmount);
      if (isNaN(amount) || amount < minBidAmount) {
         setError(`Giá đấu phải tối thiểu ${formatPrice(minBidAmount)}`);
         return;
      }

      setIsLoading(true);
      setError("");
      setSuccess("");

      try {
         const response = await fetch(`/api/auctions/${auctionId}/bid`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount }),
         });

         const data = await response.json();

         if (!response.ok) {
            throw new Error(data.error || "Có lỗi xảy ra");
         }

         setSuccess("Đặt giá thành công!");
         setBidAmount("");
         onBidPlaced();

         // Clear success message after 3 seconds
         setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
         setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      } finally {
         setIsLoading(false);
      }
   };

   const quickBidAmounts = [
      minBidAmount,
      minBidAmount + minIncrement,
      minBidAmount + minIncrement * 2,
      minBidAmount + minIncrement * 5,
   ];

   if (!session) {
      return (
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Đấu giá
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                  <p className="text-muted-foreground">
                     Bạn cần đăng nhập để tham gia đấu giá
                  </p>
               </div>
            </CardContent>
         </Card>
      );
   }

   if (!isParticipant) {
      return (
         <Card>
            <CardHeader>
               <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Đấu giá
               </CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                  <p className="text-muted-foreground mb-4">
                     Bạn cần tham gia phiên đấu giá trước
                  </p>
                  <Button variant="outline" disabled>
                     Tham gia phiên đấu giá
                  </Button>
               </div>
            </CardContent>
         </Card>
      );
   }

   return (
      <Card>
         <CardHeader>
            <CardTitle className="flex items-center gap-2">
               <DollarSign className="h-5 w-5" />
               Đặt giá
            </CardTitle>
         </CardHeader>
         <CardContent>
            <form onSubmit={handleBidSubmit} className="space-y-4">
               <div className="space-y-2">
                  <Label htmlFor="bidAmount">Số tiền đấu giá</Label>
                  <div className="relative">
                     <Input
                        id="bidAmount"
                        type="number"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                        placeholder={`Tối thiểu ${formatPrice(minBidAmount)}`}
                        min={minBidAmount}
                        step={minIncrement}
                        className="pr-20"
                     />
                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                        VND
                     </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                     Giá hiện tại:{" "}
                     <span className="font-semibold">
                        {formatPrice(currentPrice)}
                     </span>
                  </p>
               </div>

               <div className="space-y-2">
                  <Label>Đặt giá nhanh</Label>
                  <div className="grid grid-cols-2 gap-2">
                     {quickBidAmounts.map((amount) => (
                        <Button
                           key={amount}
                           type="button"
                           variant="outline"
                           size="sm"
                           onClick={() => setBidAmount(amount.toString())}
                           className="justify-start"
                        >
                           {formatPrice(amount)}
                        </Button>
                     ))}
                  </div>
               </div>

               {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
                     <AlertCircle className="h-4 w-4 text-red-500" />
                     <span className="text-sm text-red-700">{error}</span>
                  </div>
               )}

               {success && (
                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                     <CheckCircle className="h-4 w-4 text-green-500" />
                     <span className="text-sm text-green-700">{success}</span>
                  </div>
               )}

               <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !bidAmount}
               >
                  {isLoading ? "Đang đặt giá..." : "Đặt giá"}
               </Button>
            </form>
         </CardContent>
      </Card>
   );
};

export default BidForm;
