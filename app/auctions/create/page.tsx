"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
   Upload,
   X,
   Plus,
   AlertCircle,
   CheckCircle,
   Loader2,
   ArrowLeft,
} from "lucide-react";
import Link from "next/link";

interface AuctionFormData {
   title: string;
   description: string;
   startingPrice: number;
   minIncrement: number;
   category: string;
   condition: string;
   startTime: string;
   endTime: string;
   maxParticipants: number;
   images: string[];
}

export default function CreateAuctionPage() {
   const router = useRouter();
   const { data: session } = useSession();
   const [formData, setFormData] = useState<AuctionFormData>({
      title: "",
      description: "",
      startingPrice: 0,
      minIncrement: 1000,
      category: "",
      condition: "",
      startTime: "",
      endTime: "",
      maxParticipants: 10,
      images: [],
   });
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState("");
   const [success, setSuccess] = useState("");
   const [imageUrls, setImageUrls] = useState<string[]>([]);

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

   const conditions = [
      { value: "new", label: "Mới" },
      { value: "like-new", label: "Như mới" },
      { value: "good", label: "Tốt" },
      { value: "fair", label: "Khá" },
      { value: "poor", label: "Kém" },
   ];

   const handleInputChange = (field: keyof AuctionFormData, value: any) => {
      setFormData((prev) => ({
         ...prev,
         [field]: value,
      }));
   };

   const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const newImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
         const file = files[i];

         // Simple validation
         if (file.size > 5 * 1024 * 1024) {
            // 5MB limit
            setError("File quá lớn. Kích thước tối đa là 5MB");
            return;
         }

         if (!file.type.startsWith("image/")) {
            setError("Chỉ chấp nhận file hình ảnh");
            return;
         }

         // Convert to base64 for demo (in production, upload to cloud storage)
         const reader = new FileReader();
         reader.onload = (e) => {
            const result = e.target?.result as string;
            newImages.push(result);

            if (newImages.length === files.length) {
               setImageUrls((prev) => [...prev, ...newImages]);
               setFormData((prev) => ({
                  ...prev,
                  images: [...prev.images, ...newImages],
               }));
            }
         };
         reader.readAsDataURL(file);
      }
   };

   const removeImage = (index: number) => {
      setImageUrls((prev) => prev.filter((_, i) => i !== index));
      setFormData((prev) => ({
         ...prev,
         images: prev.images.filter((_, i) => i !== index),
      }));
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!session) {
         setError("Bạn cần đăng nhập để tạo phiên đấu giá");
         return;
      }

      // Validation
      if (!formData.title.trim()) {
         setError("Vui lòng nhập tiêu đề");
         return;
      }

      if (!formData.description.trim()) {
         setError("Vui lòng nhập mô tả");
         return;
      }

      if (formData.startingPrice <= 0) {
         setError("Giá khởi điểm phải lớn hơn 0");
         return;
      }

      if (!formData.category) {
         setError("Vui lòng chọn danh mục");
         return;
      }

      if (!formData.condition) {
         setError("Vui lòng chọn tình trạng");
         return;
      }

      if (!formData.startTime) {
         setError("Vui lòng chọn thời gian bắt đầu");
         return;
      }

      if (!formData.endTime) {
         setError("Vui lòng chọn thời gian kết thúc");
         return;
      }

      if (new Date(formData.startTime) <= new Date()) {
         setError("Thời gian bắt đầu phải trong tương lai");
         return;
      }

      if (new Date(formData.endTime) <= new Date(formData.startTime)) {
         setError("Thời gian kết thúc phải sau thời gian bắt đầu");
         return;
      }

      if (formData.images.length === 0) {
         setError("Vui lòng tải lên ít nhất một hình ảnh");
         return;
      }

      try {
         setLoading(true);
         setError("");
         setSuccess("");

         const response = await fetch("/api/auctions", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
         });

         const data = await response.json();

         if (response.ok) {
            setSuccess("Tạo phiên đấu giá thành công!");
            setTimeout(() => {
               router.push(`/auctions/${data._id}`);
            }, 2000);
         } else {
            throw new Error(data.error || "Có lỗi xảy ra");
         }
      } catch (err) {
         setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
      } finally {
         setLoading(false);
      }
   };

   if (!session) {
      return (
         <div className="container mx-auto px-4 py-8">
            <Card>
               <CardContent className="text-center py-12">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-orange-500" />
                  <p className="text-lg mb-4">
                     Bạn cần đăng nhập để tạo phiên đấu giá
                  </p>
                  <Link href="/login">
                     <Button>Đăng nhập</Button>
                  </Link>
               </CardContent>
            </Card>
         </div>
      );
   }

   return (
      <div className="container mx-auto px-4 py-8">
         {/* Header */}
         <div className="flex items-center gap-4 mb-8">
            <Link href="/auctions">
               <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại
               </Button>
            </Link>
            <div>
               <h1 className="text-3xl font-bold">Tạo phiên đấu giá mới</h1>
               <p className="text-muted-foreground mt-2">
                  Tạo phiên đấu giá cho những món đồ độc đáo của bạn
               </p>
            </div>
         </div>

         <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
            {/* Basic Information */}
            <Card>
               <CardHeader>
                  <CardTitle>Thông tin cơ bản</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="title">Tiêu đề *</Label>
                     <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                           handleInputChange("title", e.target.value)
                        }
                        placeholder="Nhập tiêu đề phiên đấu giá"
                        maxLength={100}
                     />
                  </div>

                  <div className="space-y-2">
                     <Label htmlFor="description">Mô tả *</Label>
                     <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) =>
                           handleInputChange("description", e.target.value)
                        }
                        placeholder="Mô tả chi tiết về sản phẩm"
                        rows={4}
                        maxLength={1000}
                     />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="category">Danh mục *</Label>
                        <Select
                           value={formData.category}
                           onValueChange={(value) =>
                              handleInputChange("category", value)
                           }
                        >
                           <SelectTrigger>
                              <SelectValue placeholder="Chọn danh mục" />
                           </SelectTrigger>
                           <SelectContent>
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
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="condition">Tình trạng *</Label>
                        <Select
                           value={formData.condition}
                           onValueChange={(value) =>
                              handleInputChange("condition", value)
                           }
                        >
                           <SelectTrigger>
                              <SelectValue placeholder="Chọn tình trạng" />
                           </SelectTrigger>
                           <SelectContent>
                              {conditions.map((condition) => (
                                 <SelectItem
                                    key={condition.value}
                                    value={condition.value}
                                 >
                                    {condition.label}
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
               <CardHeader>
                  <CardTitle>Thông tin giá</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="startingPrice">
                           Giá khởi điểm (VND) *
                        </Label>
                        <Input
                           id="startingPrice"
                           type="number"
                           value={formData.startingPrice}
                           onChange={(e) =>
                              handleInputChange(
                                 "startingPrice",
                                 parseFloat(e.target.value) || 0
                              )
                           }
                           placeholder="0"
                           min="0"
                        />
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="minIncrement">
                           Tăng giá tối thiểu (VND)
                        </Label>
                        <Input
                           id="minIncrement"
                           type="number"
                           value={formData.minIncrement}
                           onChange={(e) =>
                              handleInputChange(
                                 "minIncrement",
                                 parseFloat(e.target.value) || 0
                              )
                           }
                           placeholder="1000"
                           min="1"
                        />
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Auction Settings */}
            <Card>
               <CardHeader>
                  <CardTitle>Cài đặt phiên đấu giá</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="startTime">Thời gian bắt đầu *</Label>
                        <Input
                           id="startTime"
                           type="datetime-local"
                           value={formData.startTime}
                           onChange={(e) =>
                              handleInputChange("startTime", e.target.value)
                           }
                           min={new Date().toISOString().slice(0, 16)}
                        />
                     </div>

                     <div className="space-y-2">
                        <Label htmlFor="endTime">Thời gian kết thúc *</Label>
                        <Input
                           id="endTime"
                           type="datetime-local"
                           value={formData.endTime}
                           onChange={(e) =>
                              handleInputChange("endTime", e.target.value)
                           }
                           min={new Date().toISOString().slice(0, 16)}
                        />
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <Label htmlFor="maxParticipants">
                           Số người tham gia tối đa
                        </Label>
                        <Input
                           id="maxParticipants"
                           type="number"
                           value={formData.maxParticipants}
                           onChange={(e) =>
                              handleInputChange(
                                 "maxParticipants",
                                 parseInt(e.target.value) || 10
                              )
                           }
                           placeholder="10"
                           min="1"
                           max="10"
                        />
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* Images */}
            <Card>
               <CardHeader>
                  <CardTitle>Hình ảnh sản phẩm *</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <Label>Tải lên hình ảnh</Label>
                     <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-2">
                           Kéo thả hình ảnh vào đây hoặc click để chọn
                        </p>
                        <input
                           type="file"
                           multiple
                           accept="image/*"
                           onChange={handleImageUpload}
                           className="hidden"
                           id="image-upload"
                        />
                        <label htmlFor="image-upload">
                           <Button variant="outline" asChild>
                              <span>Chọn hình ảnh</span>
                           </Button>
                        </label>
                     </div>
                  </div>

                  {imageUrls.length > 0 && (
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {imageUrls.map((url, index) => (
                           <div key={index} className="relative">
                              <img
                                 src={url}
                                 alt={`Hình ảnh ${index + 1}`}
                                 className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                 type="button"
                                 onClick={() => removeImage(index)}
                                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                              >
                                 <X className="h-4 w-4" />
                              </button>
                           </div>
                        ))}
                     </div>
                  )}
               </CardContent>
            </Card>

            {/* Error and Success Messages */}
            {error && (
               <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-md">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-700">{error}</span>
               </div>
            )}

            {success && (
               <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-md">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-700">{success}</span>
               </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
               <Link href="/auctions">
                  <Button variant="outline" type="button">
                     Hủy
                  </Button>
               </Link>
               <Button type="submit" disabled={loading}>
                  {loading ? (
                     <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Đang tạo...
                     </>
                  ) : (
                     <>
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo phiên đấu giá
                     </>
                  )}
               </Button>
            </div>
         </form>
      </div>
   );
}
