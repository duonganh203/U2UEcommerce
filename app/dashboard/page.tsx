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
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
         </div>
      );
   }

   if (!session) {
      return null;
   }

   return (
      <div className="min-h-screen bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
               <div className="px-4 py-5 sm:p-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-6">
                     Dashboard
                  </h1>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                     <h2 className="text-lg font-semibold text-blue-900 mb-2">
                        Welcome, {session.user.firstName}{" "}
                        {session.user.lastName}!
                     </h2>
                     <p className="text-blue-700">
                        Email: {session.user.email}
                     </p>
                     <p className="text-blue-700">Role: {session.user.role}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                     <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="p-5">
                           <div className="flex items-center">
                              <div className="flex-shrink-0">
                                 <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                                    <span className="text-white font-semibold">
                                       O
                                    </span>
                                 </div>
                              </div>
                              <div className="ml-5 w-0 flex-1">
                                 <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                       Total Orders
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                       0
                                    </dd>
                                 </dl>
                              </div>
                           </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                           <div className="text-sm">
                              <Link
                                 href="/orders"
                                 className="font-medium text-indigo-600 hover:text-indigo-500"
                              >
                                 View all orders
                              </Link>
                           </div>
                        </div>
                     </div>

                     <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="p-5">
                           <div className="flex items-center">
                              <div className="flex-shrink-0">
                                 <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                                    <span className="text-white font-semibold">
                                       P
                                    </span>
                                 </div>
                              </div>
                              <div className="ml-5 w-0 flex-1">
                                 <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                       Products
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                       0
                                    </dd>
                                 </dl>
                              </div>
                           </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                           <div className="text-sm">
                              <Link
                                 href="/products"
                                 className="font-medium text-green-600 hover:text-green-500"
                              >
                                 Browse products
                              </Link>
                           </div>
                        </div>
                     </div>

                     <div className="bg-white overflow-hidden shadow rounded-lg border">
                        <div className="p-5">
                           <div className="flex items-center">
                              <div className="flex-shrink-0">
                                 <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                                    <span className="text-white font-semibold">
                                       U
                                    </span>
                                 </div>
                              </div>
                              <div className="ml-5 w-0 flex-1">
                                 <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">
                                       Profile
                                    </dt>
                                    <dd className="text-lg font-medium text-gray-900">
                                       Manage
                                    </dd>
                                 </dl>
                              </div>
                           </div>
                        </div>
                        <div className="bg-gray-50 px-5 py-3">
                           <div className="text-sm">
                              <Link
                                 href="/profile"
                                 className="font-medium text-purple-600 hover:text-purple-500"
                              >
                                 Update profile
                              </Link>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="mt-6">
                     <Link
                        href="/"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
