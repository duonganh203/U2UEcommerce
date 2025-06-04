"use client";

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
   Upload,
   X,
   DollarSign,
   Package,
   Tag,
   FileText,
   Camera,
   Plus,
   AlertCircle,
   Info,
   Eye,
   Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadMultipleImages } from "@/lib/cloudinary";

export default function SellItemPage() {
   const { data: session, status } = useSession();
   const router = useRouter();
   const [images, setImages] = useState<File[]>([]);
   const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
   const [dragActive, setDragActive] = useState(false);
   const [selectedCategory, setSelectedCategory] = useState("");
   const [selectedCondition, setSelectedCondition] = useState("");
   const [showPreview, setShowPreview] = useState(false);
   const [isSubmitting, setIsSubmitting] = useState(false);
   const [isSubmitted, setIsSubmitted] = useState(false);
   const [isUploadingImages, setIsUploadingImages] = useState(false);
   const [errors, setErrors] = useState<Record<string, string>>({});
   const [formData, setFormData] = useState({
      title: "",
      description: "",
      price: "",
      brand: "",
      quantity: "1",
      tags: "",
      city: "",
      state: "",
      freeShipping: false,
      localPickup: false,
      calculatedShipping: false,
      discountPercentage: "0",
   });

   const categories = [
      "Electronics",
      "Clothing & Fashion",
      "Home & Garden",
      "Sports & Outdoors",
      "Books & Education",
      "Toys & Games",
      "Beauty & Health",
      "Automotive",
      "Art & Collectibles",
      "Other",
   ];

   const conditions = [
      { value: "new", label: "New", description: "Brand new, unused item" },
      {
         value: "like-new",
         label: "Like New",
         description: "Used once or twice, excellent condition",
      },
      {
         value: "good",
         label: "Good",
         description: "Used with minor signs of wear",
      },
      {
         value: "fair",
         label: "Fair",
         description: "Used with noticeable signs of wear",
      },
      {
         value: "poor",
         label: "Poor",
         description: "Heavily used, functional but worn",
      },
   ];

   const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
         setDragActive(true);
      } else if (e.type === "dragleave") {
         setDragActive(false);
      }
   };

   const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
         const files = Array.from(e.dataTransfer.files);
         setImages((prev) => [...prev, ...files].slice(0, 10)); // Max 10 images
      }
   };

   const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
         const files = Array.from(e.target.files);
         setImages((prev) => [...prev, ...files].slice(0, 10)); // Max 10 images
      }
   };

   const removeImage = (index: number) => {
      setImages((prev) => prev.filter((_, i) => i !== index));
   };
   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setErrors({});

      // Basic validation
      const newErrors: Record<string, string> = {};
      if (!formData.title) {
         newErrors.title = "Title is required";
      }
      if (!selectedCategory) {
         newErrors.category = "Category is required";
      }
      if (!selectedCondition) {
         newErrors.condition = "Condition is required";
      }
      if (!formData.price) {
         newErrors.price = "Price is required";
      }
      if (images.length === 0) {
         newErrors.images = "At least one image is required";
      }

      if (Object.keys(newErrors).length > 0) {
         setErrors(newErrors);
         return;
      }

      setIsSubmitting(true);
      setIsUploadingImages(true);

      try {
         // Upload images to Cloudinary
         const uploadedImages = await uploadMultipleImages(images);
         const imageUrls = uploadedImages.map((img) => img.secure_url);
         setUploadedImageUrls(imageUrls);
         setIsUploadingImages(false); // Create product data
         const productData = {
            name: formData.title,
            description: formData.description,
            price: formData.price,
            category: selectedCategory,
            brand: formData.brand,
            images: imageUrls,
            countInStock: formData.quantity,
            condition: selectedCondition,
            tags: formData.tags,
            discountPercentage: parseFloat(formData.discountPercentage) || 0,
            shipping: {
               freeShipping: formData.freeShipping,
               localPickup: formData.localPickup,
               calculatedShipping: formData.calculatedShipping,
            },
            location: {
               city: formData.city,
               state: formData.state,
            },
         };

         // Submit product to API
         const response = await fetch("/api/products", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(productData),
         });

         const result = await response.json();

         if (result.success) {
            setIsSubmitted(true); // Reset form
            setFormData({
               title: "",
               description: "",
               price: "",
               brand: "",
               quantity: "1",
               tags: "",
               city: "",
               state: "",
               freeShipping: false,
               localPickup: false,
               calculatedShipping: false,
               discountPercentage: "0",
            });
            setImages([]);
            setSelectedCategory("");
            setSelectedCondition("");
         } else {
            setErrors({ submit: result.error || "Failed to create listing" });
         }
      } catch (error) {
         console.error("Error submitting form:", error);
         setErrors({ submit: "An error occurred while creating your listing" });
      } finally {
         setIsSubmitting(false);
         setIsUploadingImages(false);
      }
   };

   const handleInputChange = (field: string, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
   };

   const getPriceSuggestion = (category: string) => {
      const suggestions: Record<string, string> = {
         Electronics: "Check similar items: $50-500",
         "Clothing & Fashion": "Typical range: $10-200",
         "Home & Garden": "Common prices: $20-300",
         "Sports & Outdoors": "Average range: $25-400",
         "Books & Education": "Usually: $5-50",
         "Toys & Games": "Typical: $10-100",
         "Beauty & Health": "Range: $15-150",
         Automotive: "Varies widely: $20-2000",
         "Art & Collectibles": "Research required: $10-1000+",
      };
      return suggestions[category] || "Research similar items for pricing";
   };

   // Redirect if not authenticated
   if (status === "loading") {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
         </div>
      );
   }

   if (status === "unauthenticated") {
      router.push("/login");
      return null;
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
         <div className="container mx-auto px-4 py-8 max-w-4xl">
            {/* Header */}
            <div className="text-center mb-8">
               <h1 className="text-4xl font-bold text-foreground mb-2">
                  Sell Your Item
               </h1>
               <p className="text-muted-foreground text-lg">
                  Create a listing and reach thousands of potential buyers
               </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
               {/* Image Upload Section */}
               <div className="bg-card rounded-2xl p-6 shadow-lg border">
                  <div className="flex items-center gap-2 mb-4">
                     <Camera className="h-5 w-5 text-primary" />
                     <h2 className="text-xl font-semibold">Photos</h2>
                     <span className="text-sm text-muted-foreground ml-auto">
                        {images.length}/10 photos
                     </span>
                  </div>{" "}
                  <div
                     className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                        dragActive
                           ? "border-primary bg-primary/5"
                           : "border-muted-foreground/30 hover:border-primary/50"
                     }`}
                     onDragEnter={handleDrag}
                     onDragLeave={handleDrag}
                     onDragOver={handleDrag}
                     onDrop={handleDrop}
                  >
                     {isUploadingImages ? (
                        <div className="flex flex-col items-center">
                           <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                           <h3 className="text-lg font-medium mb-2">
                              Uploading images...
                           </h3>
                           <p className="text-muted-foreground">
                              Please wait while we upload your images to the
                              cloud
                           </p>
                        </div>
                     ) : (
                        <>
                           <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                           <h3 className="text-lg font-medium mb-2">
                              Drop your photos here or click to browse
                           </h3>
                           <p className="text-muted-foreground mb-4">
                              Add up to 10 photos. First photo will be your
                              cover image.
                           </p>
                           <input
                              type="file"
                              multiple
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              disabled={isUploadingImages}
                           />
                           <Button
                              type="button"
                              variant="outline"
                              disabled={isUploadingImages}
                           >
                              <Plus className="h-4 w-4 mr-2" />
                              Choose Photos
                           </Button>
                        </>
                     )}
                  </div>
                  {errors.images && (
                     <p className="text-destructive text-xs mt-2">
                        {errors.images}
                     </p>
                  )}
                  {/* Image Preview Grid */}
                  {images.length > 0 && (
                     <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
                        {images.map((image, index) => (
                           <div key={index} className="relative group">
                              <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                                 <Image
                                    src={URL.createObjectURL(image)}
                                    alt={`Upload ${index + 1}`}
                                    width={150}
                                    height={150}
                                    className="w-full h-full object-cover"
                                 />
                              </div>
                              {index === 0 && (
                                 <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                                    Cover
                                 </div>
                              )}
                              <button
                                 type="button"
                                 onClick={() => removeImage(index)}
                                 className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                 <X className="h-3 w-3" />
                              </button>
                           </div>
                        ))}
                     </div>
                  )}
               </div>

               {/* Basic Information */}
               <div className="bg-card rounded-2xl p-6 shadow-lg border">
                  <div className="flex items-center gap-2 mb-6">
                     <FileText className="h-5 w-5 text-primary" />
                     <h2 className="text-xl font-semibold">
                        Basic Information
                     </h2>
                  </div>

                  <div className="space-y-6">
                     {/* Title */}
                     <div>
                        <Label
                           htmlFor="title"
                           className="text-sm font-medium mb-2 block"
                        >
                           Title <span className="text-destructive">*</span>
                        </Label>
                        <Input
                           id="title"
                           placeholder="What are you selling?"
                           className="text-base"
                           value={formData.title}
                           onChange={(e) =>
                              handleInputChange("title", e.target.value)
                           }
                           required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                           Be specific and include important details like brand,
                           model, size, etc.
                        </p>
                        {errors.title && (
                           <p className="text-destructive text-xs mt-1">
                              {errors.title}
                           </p>
                        )}
                     </div>

                     {/* Category */}
                     <div>
                        <Label
                           htmlFor="category"
                           className="text-sm font-medium mb-2 block"
                        >
                           Category <span className="text-destructive">*</span>
                        </Label>
                        <select
                           id="category"
                           value={selectedCategory}
                           onChange={(e) => setSelectedCategory(e.target.value)}
                           className="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                           required
                        >
                           <option value="">Select a category</option>
                           {categories.map((category) => (
                              <option key={category} value={category}>
                                 {category}
                              </option>
                           ))}
                        </select>
                        {errors.category && (
                           <p className="text-destructive text-xs mt-1">
                              {errors.category}
                           </p>
                        )}
                     </div>

                     {/* Condition */}
                     <div>
                        <Label className="text-sm font-medium mb-3 block">
                           Condition <span className="text-destructive">*</span>
                        </Label>
                        <div className="space-y-3">
                           {conditions.map((condition) => (
                              <div
                                 key={condition.value}
                                 className={`border rounded-lg p-4 cursor-pointer transition-all ${
                                    selectedCondition === condition.value
                                       ? "border-primary bg-primary/5"
                                       : "border-muted hover:border-muted-foreground/50"
                                 }`}
                                 onClick={() =>
                                    setSelectedCondition(condition.value)
                                 }
                              >
                                 <div className="flex items-start gap-3">
                                    <input
                                       type="radio"
                                       name="condition"
                                       value={condition.value}
                                       checked={
                                          selectedCondition === condition.value
                                       }
                                       onChange={() =>
                                          setSelectedCondition(condition.value)
                                       }
                                       className="mt-1"
                                       required
                                    />
                                    <div>
                                       <div className="font-medium text-sm">
                                          {condition.label}
                                       </div>
                                       <div className="text-xs text-muted-foreground">
                                          {condition.description}
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           ))}
                        </div>
                        {errors.condition && (
                           <p className="text-destructive text-xs mt-1">
                              {errors.condition}
                           </p>
                        )}
                     </div>

                     {/* Description */}
                     <div>
                        <Label
                           htmlFor="description"
                           className="text-sm font-medium mb-2 block"
                        >
                           Description
                        </Label>
                        <textarea
                           id="description"
                           rows={5}
                           placeholder="Describe your item in detail..."
                           value={formData.description}
                           onChange={(e) =>
                              handleInputChange("description", e.target.value)
                           }
                           className="w-full px-3 py-2 text-sm bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                           Include details about features, defects, included
                           accessories, etc.
                        </p>
                     </div>
                  </div>
               </div>

               {/* Pricing & Details */}
               <div className="bg-card rounded-2xl p-6 shadow-lg border">
                  <div className="flex items-center gap-2 mb-6">
                     <DollarSign className="h-5 w-5 text-primary" />
                     <h2 className="text-xl font-semibold">
                        Pricing & Details
                     </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                     {/* Price */}
                     <div>
                        <Label
                           htmlFor="price"
                           className="text-sm font-medium mb-2 block"
                        >
                           Price <span className="text-destructive">*</span>
                        </Label>
                        <div className="relative">
                           <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <Input
                              id="price"
                              type="number"
                              placeholder="0.00"
                              className="pl-10 text-base"
                              step="0.01"
                              min="0"
                              value={formData.price}
                              onChange={(e) =>
                                 handleInputChange("price", e.target.value)
                              }
                              required
                           />
                        </div>
                        {selectedCategory && (
                           <p className="text-xs text-muted-foreground mt-1">
                              💡 {getPriceSuggestion(selectedCategory)}
                           </p>
                        )}
                        {errors.price && (
                           <p className="text-destructive text-xs mt-1">
                              {errors.price}
                           </p>
                        )}
                     </div>

                     {/* Brand */}
                     <div>
                        <Label
                           htmlFor="brand"
                           className="text-sm font-medium mb-2 block"
                        >
                           Brand
                        </Label>
                        <Input
                           id="brand"
                           placeholder="e.g., Apple, Nike, Samsung"
                           className="text-base"
                           value={formData.brand}
                           onChange={(e) =>
                              handleInputChange("brand", e.target.value)
                           }
                        />
                     </div>

                     {/* Quantity */}
                     <div>
                        <Label
                           htmlFor="quantity"
                           className="text-sm font-medium mb-2 block"
                        >
                           Quantity Available
                        </Label>
                        <div className="relative">
                           <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <Input
                              id="quantity"
                              type="number"
                              placeholder="1"
                              className="pl-10 text-base"
                              min="1"
                              value={formData.quantity}
                              onChange={(e) =>
                                 handleInputChange("quantity", e.target.value)
                              }
                           />
                        </div>
                     </div>

                     {/* Discount Percentage */}
                     <div>
                        <Label
                           htmlFor="discountPercentage"
                           className="text-sm font-medium mb-2 block"
                        >
                           Discount Percentage
                        </Label>
                        <div className="relative">
                           <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                              %
                           </span>
                           <Input
                              id="discountPercentage"
                              type="number"
                              placeholder="0"
                              className="pl-10 text-base"
                              min="0"
                              max="100"
                              step="1"
                              value={formData.discountPercentage}
                              onChange={(e) =>
                                 handleInputChange(
                                    "discountPercentage",
                                    e.target.value
                                 )
                              }
                           />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                           Optional: Set a discount percentage (0-100%)
                        </p>
                     </div>

                     {/* Tags */}
                     <div>
                        <Label
                           htmlFor="tags"
                           className="text-sm font-medium mb-2 block"
                        >
                           Tags
                        </Label>
                        <div className="relative">
                           <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <Input
                              id="tags"
                              placeholder="vintage, rare, collectible"
                              className="pl-10 text-base"
                              value={formData.tags}
                              onChange={(e) =>
                                 handleInputChange("tags", e.target.value)
                              }
                           />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                           Separate tags with commas to help buyers find your
                           item
                        </p>
                     </div>
                  </div>
               </div>

               {/* Shipping & Location */}
               <div className="bg-card rounded-2xl p-6 shadow-lg border">
                  <div className="flex items-center gap-2 mb-6">
                     <Package className="h-5 w-5 text-primary" />
                     <h2 className="text-xl font-semibold">
                        Shipping & Location
                     </h2>
                  </div>

                  <div className="space-y-6">
                     {/* Shipping Options */}
                     <div>
                        <Label className="text-sm font-medium mb-3 block">
                           Shipping Options
                        </Label>
                        <div className="space-y-3">
                           <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                              <input
                                 type="checkbox"
                                 className="rounded"
                                 checked={formData.freeShipping}
                                 onChange={(e) =>
                                    handleInputChange(
                                       "freeShipping",
                                       e.target.checked
                                    )
                                 }
                              />
                              <div>
                                 <div className="font-medium text-sm">
                                    Free shipping
                                 </div>
                                 <div className="text-xs text-muted-foreground">
                                    I'll cover the shipping cost
                                 </div>
                              </div>
                           </label>
                           <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                              <input
                                 type="checkbox"
                                 className="rounded"
                                 checked={formData.localPickup}
                                 onChange={(e) =>
                                    handleInputChange(
                                       "localPickup",
                                       e.target.checked
                                    )
                                 }
                              />
                              <div>
                                 <div className="font-medium text-sm">
                                    Local pickup
                                 </div>
                                 <div className="text-xs text-muted-foreground">
                                    Buyer can pick up in person
                                 </div>
                              </div>
                           </label>
                           <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-muted/50">
                              <input
                                 type="checkbox"
                                 className="rounded"
                                 checked={formData.calculatedShipping}
                                 onChange={(e) =>
                                    handleInputChange(
                                       "calculatedShipping",
                                       e.target.checked
                                    )
                                 }
                              />
                              <div>
                                 <div className="font-medium text-sm">
                                    Calculated shipping
                                 </div>
                                 <div className="text-xs text-muted-foreground">
                                    Shipping cost calculated at checkout
                                 </div>
                              </div>
                           </label>
                        </div>
                     </div>

                     {/* Location */}
                     <div className="grid md:grid-cols-2 gap-4">
                        <div>
                           <Label
                              htmlFor="city"
                              className="text-sm font-medium mb-2 block"
                           >
                              City
                           </Label>
                           <Input
                              id="city"
                              placeholder="Your city"
                              className="text-base"
                              value={formData.city}
                              onChange={(e) =>
                                 handleInputChange("city", e.target.value)
                              }
                           />
                        </div>
                        <div>
                           <Label
                              htmlFor="state"
                              className="text-sm font-medium mb-2 block"
                           >
                              State/Province
                           </Label>
                           <Input
                              id="state"
                              placeholder="Your state or province"
                              className="text-base"
                              value={formData.state}
                              onChange={(e) =>
                                 handleInputChange("state", e.target.value)
                              }
                           />
                        </div>
                     </div>
                  </div>
               </div>

               {/* Preview Card */}
               {(formData.title || images.length > 0) && (
                  <div className="bg-card rounded-2xl p-6 shadow-lg border">
                     <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold">Preview</h2>
                        <Button
                           type="button"
                           variant="outline"
                           size="sm"
                           onClick={() => setShowPreview(!showPreview)}
                        >
                           <Eye className="h-4 w-4 mr-1" />
                           {showPreview ? "Hide" : "Show"} Preview
                        </Button>
                     </div>

                     {showPreview && (
                        <div className="border rounded-lg p-4 bg-muted/20">
                           <div className="flex gap-4">
                              {images.length > 0 && (
                                 <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                    <Image
                                       src={URL.createObjectURL(images[0])}
                                       alt="Preview"
                                       width={96}
                                       height={96}
                                       className="w-full h-full object-cover"
                                    />
                                 </div>
                              )}
                              <div className="flex-1 min-w-0">
                                 <h3 className="font-medium text-base truncate">
                                    {formData.title || "Item Title"}
                                 </h3>
                                 <p className="text-sm text-muted-foreground">
                                    {selectedCondition || "Condition"} •{" "}
                                    {selectedCategory || "Category"}
                                 </p>
                                 <p className="text-lg font-bold text-primary mt-1">
                                    ${formData.price || "0.00"}
                                 </p>
                                 {formData.description && (
                                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                                       {formData.description}
                                    </p>
                                 )}
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               )}

               {/* Terms and Submit */}
               <div className="bg-card rounded-2xl p-6 shadow-lg border">
                  <div className="space-y-4">
                     {/* Terms */}
                     <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg">
                        <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="text-sm">
                           <p className="font-medium mb-1">
                              Before you list your item:
                           </p>
                           <ul className="text-muted-foreground space-y-1 text-xs">
                              <li>
                                 • Make sure your photos clearly show the item
                              </li>
                              <li>
                                 • Be honest about the condition and any defects
                              </li>
                              <li>
                                 • Research similar items to price competitively
                              </li>
                              <li>• Respond promptly to buyer inquiries</li>
                           </ul>
                        </div>
                     </div>
                     <label className="flex items-start gap-3 cursor-pointer">
                        <input
                           type="checkbox"
                           className="mt-1 rounded"
                           required
                        />
                        <div className="text-sm">
                           I agree to the{" "}
                           <a href="#" className="text-primary hover:underline">
                              Terms of Service
                           </a>{" "}
                           and{" "}
                           <a href="#" className="text-primary hover:underline">
                              Community Guidelines
                           </a>
                           . I confirm that this listing is accurate and that I
                           have the right to sell this item.
                        </div>
                     </label>{" "}
                     {/* Submit Buttons */}
                     <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                           type="submit"
                           className="flex-1 h-12 text-base"
                           disabled={isSubmitting || isUploadingImages}
                        >
                           {isSubmitting ? (
                              <div className="flex items-center gap-2">
                                 <Loader2 className="h-4 w-4 animate-spin" />
                                 {isUploadingImages
                                    ? "Uploading Images..."
                                    : "Creating Listing..."}
                              </div>
                           ) : (
                              "List Item for Sale"
                           )}
                        </Button>
                        <Button
                           type="button"
                           variant="outline"
                           className="flex-1 h-12 text-base"
                           disabled={isSubmitting}
                        >
                           Save as Draft
                        </Button>
                     </div>
                     {/* Error Display */}
                     {errors.submit && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                           {errors.submit}
                        </div>
                     )}
                     {/* Submission Feedback */}
                     {isSubmitted && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                           Your item has been listed successfully and is now
                           pending approval! 🎉
                           <br />
                           <span className="text-xs">
                              You'll be notified once it's reviewed and goes
                              live.
                           </span>
                        </div>
                     )}
                  </div>
               </div>
            </form>
         </div>
      </div>
   );
}
