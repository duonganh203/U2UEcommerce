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
   Search,
   Package,
   DollarSign,
   Clock,
   AlertCircle,
   CheckCircle2,
   Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Product {
   _id: string;
   name: string;
   category: string;
   price: number;
   condition: string;
   status: "pending" | "approved" | "rejected";
   images: string[];
   createdAt: string;
   brand?: string;
   countInStock: number;
   description?: string;
   rating?: number;
   numReviews?: number;
}

interface Stats {
   totalListings: number;
   activeListings: number;
   pendingListings: number;
   rejectedListings: number;
   totalValue: number;
   avgPrice: number;
}

export default function ManageProductsPage() {
   const { data: session, status } = useSession();
   const router = useRouter();
   const [listings, setListings] = useState<Product[]>([]);
   const [stats, setStats] = useState<Stats>({
      totalListings: 0,
      activeListings: 0,
      pendingListings: 0,
      rejectedListings: 0,
      totalValue: 0,
      avgPrice: 0,
   });
   const [loading, setLoading] = useState(true);
   const [searchTerm, setSearchTerm] = useState("");
   const [filterStatus, setFilterStatus] = useState("all");
   const [sortBy, setSortBy] = useState("newest");

   // Fetch listings data
   const fetchListings = async () => {
      try {
         setLoading(true);
         const response = await fetch("/api/products/my-listings");
         if (response.ok) {
            const data = await response.json();
            console.log("Fetched listings:", data);
            setListings(data.data || []);
            setStats(
               data.stats || {
                  totalListings: 0,
                  activeListings: 0,
                  pendingListings: 0,
                  rejectedListings: 0,
                  totalValue: 0,
                  avgPrice: 0,
               }
            );
         } else {
            console.error("Failed to fetch listings");
         }
      } catch (error) {
         console.error("Error fetching listings:", error);
      } finally {
         setLoading(false);
      }
   };

   // Handle delete listing
   const handleDelete = async (productId: string) => {
      if (!confirm("Are you sure you want to delete this listing?")) return;

      try {
         const response = await fetch(`/api/products/${productId}`, {
            method: "DELETE",
         });

         if (response.ok) {
            // Refresh listings after successful delete
            fetchListings();
         } else {
            alert("Failed to delete listing");
         }
      } catch (error) {
         console.error("Error deleting listing:", error);
         alert("Error deleting listing");
      }
   };

   useEffect(() => {
      if (status === "loading") return;
      if (!session) {
         router.push("/login");
         return;
      }
      fetchListings();
   }, [session, status, router]);

   if (status === "loading" || loading) {
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
         case "approved":
            return <CheckCircle2 className="h-4 w-4 text-green-500" />;
         case "pending":
            return <Clock className="h-4 w-4 text-yellow-500" />;
         case "rejected":
            return <AlertCircle className="h-4 w-4 text-red-500" />;
         default:
            return <AlertCircle className="h-4 w-4 text-muted-foreground" />;
      }
   };

   const getStatusColor = (status: string) => {
      switch (status) {
         case "approved":
            return "bg-green-100 text-green-800 border-green-200";
         case "pending":
            return "bg-yellow-100 text-yellow-800 border-yellow-200";
         case "rejected":
            return "bg-red-100 text-red-800 border-red-200";
         default:
            return "bg-gray-100 text-gray-800 border-gray-200";
      }
   };

   const filteredListings = listings.filter((listing: Product) => {
      const matchesSearch =
         listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
         listing.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
         filterStatus === "all" || listing.status === filterStatus;
      return matchesSearch && matchesFilter;
   });

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
                           Total Listings
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                           {stats.totalListings}
                        </p>
                     </div>
                     <Package className="h-8 w-8 text-primary" />
                  </div>
               </div>

               <div className="bg-card rounded-2xl p-6 shadow-lg border">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">
                           Approved
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                           {stats.activeListings}
                        </p>
                     </div>
                     <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
               </div>

               <div className="bg-card rounded-2xl p-6 shadow-lg border">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">
                           Pending
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                           {stats.pendingListings}
                        </p>
                     </div>
                     <Clock className="h-8 w-8 text-yellow-500" />
                  </div>
               </div>

               <div className="bg-card rounded-2xl p-6 shadow-lg border">
                  <div className="flex items-center justify-between">
                     <div>
                        <p className="text-sm font-medium text-muted-foreground">
                           Total Value
                        </p>
                        <p className="text-2xl font-bold text-foreground">
                           ${stats.totalValue.toLocaleString()}
                        </p>
                     </div>
                     <DollarSign className="h-8 w-8 text-blue-500" />
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
                     <option value="approved">Approved</option>
                     <option value="pending">Pending</option>
                     <option value="rejected">Rejected</option>
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
                  {filteredListings.map((listing: Product) => (
                     <div
                        key={listing._id}
                        className="bg-card rounded-2xl shadow-lg border overflow-hidden hover:shadow-xl transition-shadow"
                     >
                        {/* Image */}
                        <div className="relative h-48 bg-muted">
                           {listing.images && listing.images.length > 0 ? (
                              <Image
                                 src={listing.images[0]}
                                 alt={listing.name}
                                 fill
                                 className="object-cover"
                              />
                           ) : (
                              <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/20 flex items-center justify-center">
                                 <Package className="h-12 w-12 text-muted-foreground" />
                              </div>
                           )}
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
                                 {listing.name}
                              </h3>
                              <div className="relative group">
                                 <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => handleDelete(listing._id)}
                                 >
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                 </Button>
                              </div>
                           </div>

                           <p className="text-sm text-muted-foreground mb-2">
                              {listing.category} • {listing.condition}
                           </p>

                           <div className="flex justify-between items-center mb-3">
                              <span className="text-2xl font-bold text-foreground">
                                 ${listing.price.toLocaleString()}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                 Stock: {listing.countInStock}
                              </span>
                           </div>

                           <div className="text-xs text-muted-foreground mb-4">
                              Listed{" "}
                              {new Date(listing.createdAt).toLocaleDateString()}
                           </div>

                           {/* Actions */}
                           <div className="flex gap-2">
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
                                 className="flex-1"
                              >
                                 <Eye className="h-3 w-3 mr-1" />
                                 View
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
                        className="w-full flex items-center gap-2 h-12"
                     >
                        <Plus className="h-4 w-4" />
                        <div className="text-left">
                           <div className="font-medium">List New Item</div>
                           <div className="text-xs text-muted-foreground">
                              Create a new product listing
                           </div>
                        </div>
                     </Button>
                  </Link>

                  <Button
                     variant="outline"
                     className="w-full flex items-center gap-2 h-12"
                  >
                     <Package className="h-4 w-4" />
                     <div className="text-left">
                        <div className="font-medium">Bulk Edit</div>
                        <div className="text-xs text-muted-foreground">
                           Update multiple listings
                        </div>
                     </div>
                  </Button>

                  <Button
                     variant="outline"
                     className="w-full flex items-center gap-2 h-12"
                  >
                     <DollarSign className="h-4 w-4" />
                     <div className="text-left">
                        <div className="font-medium">Analytics</div>
                        <div className="text-xs text-muted-foreground">
                           View performance metrics
                        </div>
                     </div>
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}
