"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import {
   Star,
   Heart,
   Share2,
   ShoppingCart,
   Minus,
   Plus,
   Shield,
   Truck,
   RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchProductById, transformProductForUI } from "@/lib/api";

// ProductColor type definition
type ProductColor = {
   name: string;
   value: string;
};

// Additional type definitions for map items
type ProductFeature = string;

type ProductSize = string;

type ProductSpecifications = Record<string, string>;

type ProductImage = string;

type ProductTab = "description" | "specifications" | "reviews";

type DummyReview = {
   id: number;
   user: string;
   rating: number;
   comment: string;
   date: string;
};

// Complete product interface for this page
interface ProductPageData {
   id: string;
   name: string;
   brand: string;
   price: number;
   originalPrice?: number;
   discount: number;
   rating: number;
   reviewCount: number;
   inStock: boolean;
   stockCount: number;
   images: ProductImage[];
   description: string;
   features: ProductFeature[];
   specifications: ProductSpecifications;
   colors: ProductColor[];
   sizes: ProductSize[];
}

// Dummy reviews data
const dummyReviews = [
   {
      id: 1,
      user: "John D.",
      rating: 5,
      comment:
         "Amazing sound quality! The noise cancellation is perfect for my daily commute.",
      date: "2024-05-15",
   },
   {
      id: 2,
      user: "Sarah M.",
      rating: 4,
      comment:
         "Great headphones, very comfortable for long listening sessions.",
      date: "2024-05-10",
   },
   {
      id: 3,
      user: "Mike R.",
      rating: 5,
      comment: "Worth every penny! The battery life is incredible.",
      date: "2024-05-08",
   },
];

export default function ProductPage({
   params,
}: {
   params: Promise<{ id: string }>;
}) {
   const resolvedParams = use(params);
   const [product, setProduct] = useState<ProductPageData | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [selectedImage, setSelectedImage] = useState(0);
   const [selectedColor, setSelectedColor] = useState(0);
   const [selectedSize, setSelectedSize] = useState(0);
   const [quantity, setQuantity] = useState(1);
   const [isWishlisted, setIsWishlisted] = useState(false);
   const [activeTab, setActiveTab] = useState<ProductTab>("description");

   // Fetch product data
   useEffect(() => {
      const loadProduct = async () => {
         try {
            setLoading(true);
            const response = await fetchProductById(resolvedParams.id);
            const transformedProduct = transformProductForUI(response.data);

            // Add some default values for UI compatibility
            const productWithDefaults = {
               ...transformedProduct,
               features: [
                  "High quality materials",
                  "Premium build",
                  "Excellent performance",
                  "Great value for money",
               ],
               specifications: {
                  Brand: transformedProduct.brand,
                  Category: transformedProduct.category,
                  "In Stock": transformedProduct.stockCount.toString(),
               },
               colors: [{ name: "Default", value: "#000000" }],
               sizes: ["One Size"],
            };

            setProduct(productWithDefaults);
         } catch (err) {
            setError("Failed to load product");
            console.error("Error loading product:", err);
         } finally {
            setLoading(false);
         }
      };

      loadProduct();
   }, [resolvedParams.id]);

   if (loading) {
      return (
         <div className="min-h-screen bg-white flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-gray-600">Loading product...</span>
         </div>
      );
   }

   if (error || !product) {
      return (
         <div className="min-h-screen bg-white flex justify-center items-center">
            <div className="text-center">
               <p className="text-red-600 text-lg mb-4">
                  {error || "Product not found"}
               </p>
               <Button onClick={() => window.history.back()}>Go Back</Button>
            </div>
         </div>
      );
   }

   const handleQuantityChange = (change: number) => {
      setQuantity(Math.max(1, Math.min(product.stockCount, quantity + change)));
   };

   const renderStars = (rating: number) => {
      return Array.from({ length: 5 }, (_, i) => (
         <Star
            key={i}
            className={`w-4 h-4 ${
               i < Math.floor(rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
            }`}
         />
      ));
   };

   return (
      <div className="min-h-screen bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <nav className="flex text-sm text-gray-600 mb-8">
               <a href="/" className="hover:text-indigo-600">
                  Home
               </a>
               <span className="mx-2">/</span>
               <a href="/products" className="hover:text-indigo-600">
                  Products
               </a>
               <span className="mx-2">/</span>
               <span className="text-gray-900">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               {/* Product Images */}
               <div className="space-y-4">
                  <div className="aspect-square relative bg-white rounded-lg overflow-hidden shadow-lg">
                     <Image
                        src={product.images[selectedImage]}
                        alt={product.name}
                        fill
                        className="object-cover"
                     />
                     {product.discount > 0 && (
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                           -{product.discount}%
                        </div>
                     )}
                     <button
                        onClick={() => setIsWishlisted(!isWishlisted)}
                        className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                     >
                        <Heart
                           className={`w-5 h-5 ${
                              isWishlisted
                                 ? "fill-red-500 text-red-500"
                                 : "text-gray-400"
                           }`}
                        />
                     </button>
                  </div>

                  {/* Thumbnail Images */}
                  <div className="grid grid-cols-4 gap-2">
                     {product.images.map(
                        (image: ProductImage, index: number) => (
                           <button
                              key={index}
                              onClick={() => setSelectedImage(index)}
                              className={`aspect-square relative bg-white rounded overflow-hidden border-2 ${
                                 selectedImage === index
                                    ? "border-indigo-500"
                                    : "border-gray-200"
                              }`}
                           >
                              <Image
                                 src={image}
                                 alt={`${product.name} ${index + 1}`}
                                 fill
                                 className="object-cover"
                              />
                           </button>
                        )
                     )}
                  </div>
               </div>

               {/* Product Details */}
               <div className="space-y-6">
                  <div>
                     <p className="text-sm text-gray-600 mb-1">
                        {product.brand}
                     </p>
                     <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {product.name}
                     </h1>

                     {/* Rating */}
                     <div className="flex items-center space-x-2 mb-4">
                        <div className="flex">
                           {renderStars(product.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                           ({product.reviewCount} reviews)
                        </span>
                     </div>

                     {/* Price */}
                     <div className="flex items-baseline space-x-2 mb-6">
                        <span className="text-3xl font-bold text-gray-900">
                           ${product.price}
                        </span>
                        {product.originalPrice &&
                           product.originalPrice > product.price && (
                              <span className="text-lg text-gray-500 line-through">
                                 ${product.originalPrice}
                              </span>
                           )}
                     </div>
                  </div>

                  {/* Stock Status */}
                  <div className="flex items-center space-x-2">
                     <div
                        className={`w-3 h-3 rounded-full ${
                           product.inStock ? "bg-green-500" : "bg-red-500"
                        }`}
                     ></div>
                     <span
                        className={`text-sm font-medium ${
                           product.inStock ? "text-green-600" : "text-red-600"
                        }`}
                     >
                        {product.inStock
                           ? `In Stock (${product.stockCount} left)`
                           : "Out of Stock"}
                     </span>
                  </div>

                  {/* Color Selection */}
                  <div>
                     <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Color
                     </h3>
                     <div className="flex space-x-3">
                        {product.colors.map(
                           (color: ProductColor, index: number) => (
                              <button
                                 key={index}
                                 onClick={() => setSelectedColor(index)}
                                 className={`w-8 h-8 rounded-full border-2 ${
                                    selectedColor === index
                                       ? "border-gray-900"
                                       : "border-gray-300"
                                 }`}
                                 style={{ backgroundColor: color.value }}
                                 title={color.name}
                              />
                           )
                        )}
                     </div>
                  </div>

                  {/* Size Selection */}
                  <div>
                     <h3 className="text-sm font-medium text-gray-900 mb-3">
                        Size
                     </h3>
                     <div className="flex space-x-2">
                        {product.sizes.map((size: string, index: number) => (
                           <button
                              key={index}
                              onClick={() => setSelectedSize(index)}
                              className={`px-4 py-2 border rounded-md text-sm font-medium ${
                                 selectedSize === index
                                    ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                                    : "border-gray-300 text-gray-700 hover:border-gray-400"
                              }`}
                           >
                              {size}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Quantity and Add to Cart */}
                  <div className="space-y-4">
                     <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-3">
                           Quantity
                        </h3>
                        <div className="flex items-center space-x-3">
                           <button
                              onClick={() => handleQuantityChange(-1)}
                              disabled={quantity <= 1}
                              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                           >
                              <Minus className="w-4 h-4" />
                           </button>
                           <span className="w-12 text-center font-medium">
                              {quantity}
                           </span>
                           <button
                              onClick={() => handleQuantityChange(1)}
                              disabled={quantity >= product.stockCount}
                              className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                           >
                              <Plus className="w-4 h-4" />
                           </button>
                        </div>
                     </div>

                     <div className="flex space-x-3">
                        <Button
                           className="flex-1"
                           size="lg"
                           disabled={!product.inStock}
                        >
                           <ShoppingCart className="w-5 h-5 mr-2" />
                           Add to Cart
                        </Button>
                        <Button variant="outline" size="lg">
                           <Share2 className="w-5 h-5" />
                        </Button>
                     </div>
                  </div>

                  {/* Features */}
                  <div className="border-t pt-6">
                     <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Key Features
                     </h3>
                     <ul className="space-y-2">
                        {product.features.map(
                           (feature: ProductFeature, index: number) => (
                              <li
                                 key={index}
                                 className="flex items-center text-sm text-gray-600"
                              >
                                 <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                                 {feature}
                              </li>
                           )
                        )}
                     </ul>
                  </div>

                  {/* Trust Badges */}
                  <div className="border-t pt-6">
                     <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="flex flex-col items-center">
                           <Shield className="w-8 h-8 text-green-500 mb-2" />
                           <span className="text-xs text-gray-600">
                              2 Year Warranty
                           </span>
                        </div>
                        <div className="flex flex-col items-center">
                           <Truck className="w-8 h-8 text-blue-500 mb-2" />
                           <span className="text-xs text-gray-600">
                              Free Shipping
                           </span>
                        </div>
                        <div className="flex flex-col items-center">
                           <RotateCcw className="w-8 h-8 text-purple-500 mb-2" />
                           <span className="text-xs text-gray-600">
                              30-Day Returns
                           </span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Product Information Tabs */}
            <div className="mt-16">
               <div className="border-b border-gray-200">
                  <nav className="flex space-x-8">
                     {(
                        [
                           "description",
                           "specifications",
                           "reviews",
                        ] as ProductTab[]
                     ).map((tab: ProductTab) => (
                        <button
                           key={tab}
                           onClick={() => setActiveTab(tab)}
                           className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                              activeTab === tab
                                 ? "border-indigo-500 text-indigo-600"
                                 : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                           }`}
                        >
                           {tab}
                        </button>
                     ))}
                  </nav>
               </div>

               <div className="py-8">
                  {activeTab === "description" && (
                     <div className="prose max-w-none">
                        <p className="text-gray-600 leading-relaxed">
                           {product.description}
                        </p>
                     </div>
                  )}

                  {activeTab === "specifications" && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(
                           product.specifications as ProductSpecifications
                        ).map(([key, value]) => (
                           <div
                              key={key}
                              className="flex justify-between py-2 border-b border-gray-200"
                           >
                              <span className="font-medium text-gray-900">
                                 {key}
                              </span>
                              <span className="text-gray-600">{value}</span>
                           </div>
                        ))}
                     </div>
                  )}

                  {activeTab === "reviews" && (
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <h3 className="text-lg font-medium text-gray-900">
                              Customer Reviews
                           </h3>
                           <Button variant="outline">Write a Review</Button>
                        </div>

                        <div className="space-y-6">
                           {dummyReviews.map((review: DummyReview) => (
                              <div
                                 key={review.id}
                                 className="border-b border-gray-200 pb-6"
                              >
                                 <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center space-x-2">
                                       <span className="font-medium text-gray-900">
                                          {review.user}
                                       </span>
                                       <div className="flex">
                                          {renderStars(review.rating)}
                                       </div>
                                    </div>
                                    <span className="text-sm text-gray-500">
                                       {review.date}
                                    </span>
                                 </div>
                                 <p className="text-gray-600">
                                    {review.comment}
                                 </p>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
