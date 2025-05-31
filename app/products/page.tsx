"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Heart, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dummy products data
const dummyProducts = [
   {
      id: "1",
      name: "Premium Wireless Headphones",
      brand: "AudioTech",
      price: 299.99,
      originalPrice: 399.99,
      discount: 25,
      rating: 4.5,
      reviewCount: 128,
      image: "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg",
      category: "Electronics",
      inStock: true,
   },
   {
      id: "2",
      name: "Smart Fitness Watch",
      brand: "FitTech",
      price: 199.99,
      originalPrice: 249.99,
      discount: 20,
      rating: 4.3,
      reviewCount: 89,
      image: "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg",
      category: "Electronics",
      inStock: true,
   },
   {
      id: "3",
      name: "Professional Camera Lens",
      brand: "PhotoPro",
      price: 849.99,
      originalPrice: 999.99,
      discount: 15,
      rating: 4.8,
      reviewCount: 234,
      image: "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg",
      category: "Photography",
      inStock: true,
   },
   {
      id: "4",
      name: "Bluetooth Speaker",
      brand: "SoundWave",
      price: 89.99,
      originalPrice: 119.99,
      discount: 25,
      rating: 4.2,
      reviewCount: 156,
      image: "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg",
      category: "Electronics",
      inStock: false,
   },
   {
      id: "5",
      name: "Gaming Mechanical Keyboard",
      brand: "GameTech",
      price: 159.99,
      originalPrice: 199.99,
      discount: 20,
      rating: 4.6,
      reviewCount: 98,
      image: "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg",
      category: "Gaming",
      inStock: true,
   },
   {
      id: "6",
      name: "Wireless Mouse",
      brand: "TechMouse",
      price: 49.99,
      originalPrice: 69.99,
      discount: 28,
      rating: 4.1,
      reviewCount: 67,
      image: "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg",
      category: "Electronics",
      inStock: true,
   },
];

const categories = ["All", "Electronics", "Photography", "Gaming"];
const sortOptions = [
   { value: "featured", label: "Featured" },
   { value: "price-low", label: "Price: Low to High" },
   { value: "price-high", label: "Price: High to Low" },
   { value: "rating", label: "Highest Rated" },
   { value: "newest", label: "Newest" },
];

export default function ProductsPage() {
   const [selectedCategory, setSelectedCategory] = useState("All");
   const [sortBy, setSortBy] = useState("featured");
   const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
   const [wishlistedItems, setWishlistedItems] = useState<string[]>([]);

   const filteredProducts = dummyProducts.filter(
      (product) =>
         selectedCategory === "All" || product.category === selectedCategory
   );

   const sortedProducts = [...filteredProducts].sort((a, b) => {
      switch (sortBy) {
         case "price-low":
            return a.price - b.price;
         case "price-high":
            return b.price - a.price;
         case "rating":
            return b.rating - a.rating;
         default:
            return 0;
      }
   });

   const toggleWishlist = (productId: string) => {
      setWishlistedItems((prev) =>
         prev.includes(productId)
            ? prev.filter((id) => id !== productId)
            : [...prev, productId]
      );
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

   const ProductCard = ({
      product,
   }: {
      product: (typeof dummyProducts)[0];
   }) => {
      const isWishlisted = wishlistedItems.includes(product.id);

      if (viewMode === "list") {
         return (
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
               <div className="flex">
                  <div className="w-48 h-48 relative">
                     <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover"
                     />
                     {product.discount > 0 && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                           -{product.discount}%
                        </div>
                     )}
                  </div>
                  <div className="flex-1 p-6">
                     <div className="flex justify-between items-start mb-2">
                        <div>
                           <p className="text-sm text-gray-600">
                              {product.brand}
                           </p>
                           <h3 className="text-lg font-semibold text-gray-900 hover:text-indigo-600">
                              <Link href={`/products/${product.id}`}>
                                 {product.name}
                              </Link>
                           </h3>
                        </div>
                        <button
                           onClick={() => toggleWishlist(product.id)}
                           className="p-2 hover:bg-gray-100 rounded-full"
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

                     <div className="flex items-center space-x-2 mb-3">
                        <div className="flex">
                           {renderStars(product.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                           ({product.reviewCount})
                        </span>
                     </div>

                     <div className="flex items-center justify-between">
                        <div className="flex items-baseline space-x-2">
                           <span className="text-xl font-bold text-gray-900">
                              ${product.price}
                           </span>
                           {product.originalPrice > product.price && (
                              <span className="text-sm text-gray-500 line-through">
                                 ${product.originalPrice}
                              </span>
                           )}
                        </div>
                        <div className="flex items-center space-x-2">
                           <span
                              className={`text-sm ${
                                 product.inStock
                                    ? "text-green-600"
                                    : "text-red-600"
                              }`}
                           >
                              {product.inStock ? "In Stock" : "Out of Stock"}
                           </span>
                           <Button size="sm" disabled={!product.inStock}>
                              Add to Cart
                           </Button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         );
      }

      return (
         <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden group">
            <div className="aspect-square relative">
               <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
               />
               {product.discount > 0 && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                     -{product.discount}%
                  </div>
               )}
               <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
               >
                  <Heart
                     className={`w-4 h-4 ${
                        isWishlisted
                           ? "fill-red-500 text-red-500"
                           : "text-gray-400"
                     }`}
                  />
               </button>
            </div>

            <div className="p-4">
               <p className="text-sm text-gray-600 mb-1">{product.brand}</p>
               <h3 className="font-semibold text-gray-900 mb-2 hover:text-indigo-600">
                  <Link href={`/products/${product.id}`}>{product.name}</Link>
               </h3>

               <div className="flex items-center space-x-1 mb-2">
                  <div className="flex">{renderStars(product.rating)}</div>
                  <span className="text-sm text-gray-600">
                     ({product.reviewCount})
                  </span>
               </div>

               <div className="flex items-center justify-between mb-3">
                  <div className="flex items-baseline space-x-2">
                     <span className="text-lg font-bold text-gray-900">
                        ${product.price}
                     </span>
                     {product.originalPrice > product.price && (
                        <span className="text-sm text-gray-500 line-through">
                           ${product.originalPrice}
                        </span>
                     )}
                  </div>
                  <span
                     className={`text-sm ${
                        product.inStock ? "text-green-600" : "text-red-600"
                     }`}
                  >
                     {product.inStock ? "In Stock" : "Out of Stock"}
                  </span>
               </div>

               <Button className="w-full" size="sm" disabled={!product.inStock}>
                  Add to Cart
               </Button>
            </div>
         </div>
      );
   };

   return (
      <div className="min-h-screen bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
               <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Products
               </h1>
               <p className="text-gray-600">
                  Discover our amazing collection of products
               </p>
            </div>

            {/* Filters and Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 space-y-4 lg:space-y-0">
               {/* Categories */}
               <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                     <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                           selectedCategory === category
                              ? "bg-indigo-600 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                        }`}
                     >
                        {category}
                     </button>
                  ))}
               </div>

               {/* Controls */}
               <div className="flex items-center space-x-4">
                  <select
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value)}
                     className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
                  >
                     {sortOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                           {option.label}
                        </option>
                     ))}
                  </select>

                  <div className="flex items-center border border-gray-300 rounded-md">
                     <button
                        onClick={() => setViewMode("grid")}
                        className={`p-2 ${
                           viewMode === "grid"
                              ? "bg-indigo-50 text-indigo-600"
                              : "text-gray-400"
                        }`}
                     >
                        <Grid className="w-4 h-4" />
                     </button>
                     <button
                        onClick={() => setViewMode("list")}
                        className={`p-2 ${
                           viewMode === "list"
                              ? "bg-indigo-50 text-indigo-600"
                              : "text-gray-400"
                        }`}
                     >
                        <List className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
               <p className="text-gray-600">
                  Showing {sortedProducts.length} of {dummyProducts.length}{" "}
                  products
               </p>
            </div>

            {/* Products Grid/List */}
            <div
               className={
                  viewMode === "grid"
                     ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                     : "space-y-4"
               }
            >
               {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
               ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-12">
               <Button variant="outline" size="lg">
                  Load More Products
               </Button>
            </div>
         </div>
      </div>
   );
}
