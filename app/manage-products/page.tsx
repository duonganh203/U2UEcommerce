"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
   Plus,
   Edit3,
   Trash2,
   Eye,
   MoreHorizontal,
   Search,
   Filter,
   Package,
   DollarSign,
   TrendingUp,
   Clock,
   AlertCircle,
   CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Mock data for demonstration
const mockListings = [
   {
      id: "1",
      title: "MacBook Pro M2 16-inch",
      category: "Electronics",
      price: 2299.99,
      condition: "like-new",
      status: "active",
      views: 124,
      inquiries: 8,
      dateCreated: "2025-05-28",
      images: ["/api/placeholder/300/300"],
   },
   {
      id: "2",
      title: "Vintage Leather Jacket",
      category: "Clothing & Fashion",
      price: 149.99,
      condition: "good",
      status: "sold",
      views: 89,
      inquiries: 15,
      dateCreated: "2025-05-25",
      images: ["/api/placeholder/300/300"],
   },
   {
      id: "3",
      title: "Professional Camera Lens",
      category: "Photography",
      price: 899.99,
      condition: "new",
      status: "pending",
      views: 45,
      inquiries: 3,
      dateCreated: "2025-05-30",
      images: ["/api/placeholder/300/300"],
   },
];

export default function ManageProductsPage() {
   const { data: session, status } = useSession();
   const router = useRouter();
   const [listings, setListings] = useState(mockListings);
   const [searchTerm, setSearchTerm] = useState("");
   const [filterStatus, setFilterStatus] = useState("all");
   const [sortBy, setSortBy] = useState("newest");

   useEffect(() => {
      if (status === "loading") return;
      if (!session) {
         router.push("/login");
         return;
      }
   }, [session, status, router]);

   if (status === "loading") {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
         </div>
      );
   }

   if (!session) {
      return null;
   }

   const getStatusIcon = (status: string) => {
      switch (status) {
         case "active":
            return <CheckCircle2 className="h-4 w-4 text-green-500" />;
         case "pending":
            return <Clock className="h-4 w-4 text-yellow-500" />;
         case "sold":
            return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
         case "paused":
            return <AlertCircle className="h-4 w-4 text-orange-500" />;
         default:
            return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      }
   };

   const getStatusColor = (status: string) => {
      switch (status) {
         case "active":
            return "bg-green-100 text-green-800 border-green-200";
         case "pending":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
         case "sold":
            return "bg-blue-100 text-blue-800 border-blue-200";
         case "paused":
            return "bg-orange-100 text-orange-800 border-orange-200";
         default:
            return "bg-gray-100 text-gray-800 border-gray-200";
      }
   };

   const filteredListings = listings.filter((listing) => {
      const matchesSearch =
         listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
         listing.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
         filterStatus === "all" || listing.status === filterStatus;
      return matchesSearch && matchesFilter;
   });

   const totalValue = listings.reduce((sum, listing) => sum + listing.price, 0);
   const activeListings = listings.filter((l) => l.status === "active").length;
   const soldListings = listings.filter((l) => l.status === "sold").length;
   const totalViews = listings.reduce((sum, listing) => sum + listing.views, 0);

   return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
         <div className="container mx-auto px-4 py-8 max-w-7xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
               <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">
                     My Listings
                  </h1>
                  <p className="text-muted-foreground text-lg">
                     Manage your products and track performance
                  </p>
               </div>
               <Link href="/sell-item">
                  <Button className="flex items-center gap-2">
                     <Plus className="h-4 w-4" />
                     List New Item
                  </Button>
               </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
               <div className="bg-card rounded-2xl p-6 shadow-lg border">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">
                           Active Listings
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                           {activeListings}
                        </p>
                     </div>
                     <Package className="h-8 w-8 text-primary" />
                  </div>
               </div>

               <div className="bg-card rounded-2xl p-6 shadow-lg border">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">
                           Items Sold
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                           {soldListings}
                        </p>
                     </div>
                     <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
               </div>

               <div className="bg-card rounded-2xl p-6 shadow-lg border">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">
                           Total Value
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                           ${totalValue.toLocaleString()}
                        </p>
                     </div>
                     <DollarSign className="h-8 w-8 text-blue-500" />
                  </div>
               </div>

               <div className="bg-card rounded-2xl p-6 shadow-lg border">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">
                           Total Views
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                           {totalViews}
                        </p>
                     </div>
                     <TrendingUp className="h-8 w-8 text-purple-500" />
                  </div>
               </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-card rounded-2xl p-6 shadow-lg border mb-8">
               <div className="flex flex-col md:flex-row gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                     <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                     <Input
                        placeholder="Search your listings..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                     />
                  </div>

                  {/* Status Filter */}
                  <select
                     value={filterStatus}
                     onChange={(e) => setFilterStatus(e.target.value)}
                     className="px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                     <option value="all">All Status</option>
                     <option value="active">Active</option>
                     <option value="pending">Pending</option>
                     <option value="sold">Sold</option>
                     <option value="paused">Paused</option>
                  </select>

                  {/* Sort */}
                  <select
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value)}
                     className="px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                     <option value="newest">Newest First</option>
                     <option value="oldest">Oldest First</option>
                     <option value="price-high">Price: High to Low</option>
                     <option value="price-low">Price: Low to High</option>
                     <option value="views">Most Views</option>
                  </select>
               </div>
            </div>

            {/* Listings Grid */}
            {filteredListings.length === 0 ? (
               <div className="bg-card rounded-2xl p-12 shadow-lg border text-center">
                  <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                     {searchTerm || filterStatus !== "all"
                        ? "No listings found"
                        : "No listings yet"}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                     {searchTerm || filterStatus !== "all"
                        ? "Try adjusting your search or filters"
                        : "Start selling by creating your first listing"}
                  </p>
                  {!searchTerm && filterStatus === "all" && (
                     <Link href="/sell-item">
                        <Button>
                           <Plus className="h-4 w-4 mr-2" />
                           Create Your First Listing
                        </Button>
                     </Link>
                  )}
               </div>
            ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map((listing) => (
                     <div
                        key={listing.id}
                        className="bg-card rounded-2xl shadow-lg border overflow-hidden hover:shadow-xl transition-shadow"
                     >
                        {/* Image */}
                        <div className="relative h-48 bg-muted">
                           <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                              <Package className="h-12 w-12 text-muted-foreground" />
                           </div>
                           <div
                              className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${getStatusColor(
                                 listing.status
                              )}`}
                           >
                              {getStatusIcon(listing.status)}
                              {listing.status.charAt(0).toUpperCase() +
                                 listing.status.slice(1)}
                           </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                           <div className="flex justify-between items-start mb-2">
                              <h3 className="font-semibold text-foreground line-clamp-1">
                                 {listing.title}
                              </h3>
                              <div className="relative group">
                                 <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                 >
                                    <MoreHorizontal className="h-4 w-4" />
                                 </Button>
                              </div>
                           </div>

                           <p className="text-sm text-muted-foreground mb-2">
                              {listing.category} • {listing.condition}
                           </p>

                           <p className="text-xl font-bold text-primary mb-3">
                              ${listing.price.toLocaleString()}
                           </p>

                           {/* Stats */}
                           <div className="flex justify-between text-sm text-muted-foreground mb-4">
                              <span className="flex items-center gap-1">
                                 <Eye className="h-3 w-3" />
                                 {listing.views} views
                              </span>
                              <span>{listing.inquiries} inquiries</span>
                           </div>

                           {/* Actions */}
                           <div className="flex gap-2">
                              <Button
                                 variant="outline"
                                 size="sm"
                                 className="flex-1"
                              >
                                 <Eye className="h-3 w-3 mr-1" />
                                 View
                              </Button>
                              <Button
                                 variant="outline"
                                 size="sm"
                                 className="flex-1"
                              >
                                 <Edit3 className="h-3 w-3 mr-1" />
                                 Edit
                              </Button>
                              <Button
                                 variant="outline"
                                 size="sm"
                                 className="px-2"
                              >
                                 <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}

            {/* Quick Actions */}
            <div className="mt-8 bg-card rounded-2xl p-6 shadow-lg border">
               <h3 className="text-lg font-semibold text-foreground mb-4">
                  Quick Actions
               </h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Link href="/sell-item">
                     <Button
                        variant="outline"
                        className="w-full h-auto p-4 flex flex-col items-center gap-2"
                     >
                        <Plus className="h-6 w-6 text-primary" />
                        <span className="font-medium">List New Item</span>
                        <span className="text-xs text-muted-foreground">
                           Add another product to sell
                        </span>
                     </Button>
                  </Link>

                  <Button
                     variant="outline"
                     className="w-full h-auto p-4 flex flex-col items-center gap-2"
                  >
                     <TrendingUp className="h-6 w-6 text-green-500" />
                     <span className="font-medium">View Analytics</span>
                     <span className="text-xs text-muted-foreground">
                        See detailed performance data
                     </span>
                  </Button>

                  <Link href="/profile">
                     <Button
                        variant="outline"
                        className="w-full h-auto p-4 flex flex-col items-center gap-2"
                     >
                        <Package className="h-6 w-6 text-blue-500" />
                        <span className="font-medium">Seller Profile</span>
                        <span className="text-xs text-muted-foreground">
                           Manage your seller information
                        </span>
                     </Button>
                  </Link>
               </div>
            </div>
         </div>
      </div>
   );
}
