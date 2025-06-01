"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function Dashboard() {
   const { data: session, status } = useSession();
   const router = useRouter();

   useEffect(() => {
      if (status === "loading") return; // Still loading
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

   return (
      <div className="min-h-screen bg-background">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
               <div className="px-4 py-5 sm:p-6">
                  <h1 className="text-3xl font-bold text-foreground mb-6">
                     Dashboard
                  </h1>
                  <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
                     <h2 className="text-lg font-semibold text-foreground mb-2">
                        Welcome, {session.user.firstName}{" "}
                        {session.user.lastName}!
                     </h2>
                     <p className="text-muted-foreground">
                        Email: {session.user.email}
                     </p>
                     <p className="text-muted-foreground">
                        Role: {session.user.role}
                     </p>
                  </div>{" "}
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                     <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
                        <div className="p-5">
                           <div className="flex items-center">
                              <div className="flex-shrink-0">
                                 <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                                    <span className="text-primary-foreground font-semibold">
                                       O
                                    </span>
                                 </div>
                              </div>
                              <div className="ml-5 w-0 flex-1">
                                 <dl>
                                    <dt className="text-sm font-medium text-muted-foreground truncate">
                                       Total Orders
                                    </dt>
                                    <dd className="text-lg font-medium text-foreground">
                                       0
                                    </dd>
                                 </dl>
                              </div>
                           </div>
                        </div>
                        <div className="bg-muted px-5 py-3">
                           <div className="text-sm">
                              <Link
                                 href="/orders"
                                 className="font-medium text-primary hover:text-primary/80"
                              >
                                 View all orders
                              </Link>
                           </div>
                        </div>
                     </div>

                     <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
                        <div className="p-5">
                           <div className="flex items-center">
                              <div className="flex-shrink-0">
                                 <div className="w-8 h-8 bg-secondary rounded-md flex items-center justify-center">
                                    <span className="text-secondary-foreground font-semibold">
                                       P
                                    </span>
                                 </div>
                              </div>
                              <div className="ml-5 w-0 flex-1">
                                 <dl>
                                    <dt className="text-sm font-medium text-muted-foreground truncate">
                                       Products
                                    </dt>
                                    <dd className="text-lg font-medium text-foreground">
                                       0
                                    </dd>
                                 </dl>
                              </div>
                           </div>
                        </div>
                        <div className="bg-muted px-5 py-3">
                           <div className="text-sm">
                              <Link
                                 href="/products"
                                 className="font-medium text-primary hover:text-primary/80"
                              >
                                 Browse products
                              </Link>
                           </div>
                        </div>
                     </div>

                     <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
                        <div className="p-5">
                           <div className="flex items-center">
                              <div className="flex-shrink-0">
                                 <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
                                    <span className="text-accent-foreground font-semibold">
                                       S
                                    </span>
                                 </div>
                              </div>
                              <div className="ml-5 w-0 flex-1">
                                 <dl>
                                    <dt className="text-sm font-medium text-muted-foreground truncate">
                                       My Listings
                                    </dt>
                                    <dd className="text-lg font-medium text-foreground">
                                       0 Active
                                    </dd>
                                 </dl>
                              </div>
                           </div>
                        </div>
                        <div className="bg-muted px-5 py-3">
                           <div className="text-sm flex gap-2">
                              <Link
                                 href="/sell-item"
                                 className="font-medium text-primary hover:text-primary/80"
                              >
                                 Sell Item
                              </Link>
                              <span className="text-muted-foreground">•</span>
                              <Link
                                 href="/manage-products"
                                 className="font-medium text-primary hover:text-primary/80"
                              >
                                 Manage
                              </Link>
                           </div>
                        </div>
                     </div>

                     <div className="bg-card overflow-hidden shadow rounded-lg border border-border">
                        <div className="p-5">
                           <div className="flex items-center">
                              <div className="flex-shrink-0">
                                 <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
                                    <span className="text-accent-foreground font-semibold">
                                       U
                                    </span>
                                 </div>
                              </div>
                              <div className="ml-5 w-0 flex-1">
                                 <dl>
                                    <dt className="text-sm font-medium text-muted-foreground truncate">
                                       Profile
                                    </dt>
                                    <dd className="text-lg font-medium text-foreground">
                                       Manage
                                    </dd>
                                 </dl>
                              </div>
                           </div>
                        </div>
                        <div className="bg-muted px-5 py-3">
                           <div className="text-sm">
                              <Link
                                 href="/profile"
                                 className="font-medium text-primary hover:text-primary/80"
                              >
                                 Update profile
                              </Link>
                           </div>
                        </div>
                     </div>
                  </div>{" "}
                  <div className="mt-6">
                     <Link
                        href="/"
                        className="inline-flex items-center px-4 py-2 border border-border rounded-md shadow-sm text-sm font-medium text-foreground bg-card hover:bg-muted focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring"
                     >
                        ← Back to Home
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
