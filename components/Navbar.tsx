"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";

export default function Navbar() {
   const { data: session, status } = useSession();
   const { totalItems } = useCart();
   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

   const navigation = [
      { name: "Home", href: "/" },
      { name: "Products", href: "/products" },
      { name: "Categories", href: "/categories" },
      { name: "About", href: "/about" },
      { name: "Contact", href: "/contact" },
   ];

   return (
      <nav className="bg-white shadow-lg border-b">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
               {/* Logo */}
               <div className="flex-shrink-0">
                  <Link href="/" className="text-2xl font-bold text-indigo-600">
                     ECommerce
                  </Link>
               </div>

               {/* Desktop Navigation */}
               <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                     {navigation.map((item) => (
                        <Link
                           key={item.name}
                           href={item.href}
                           className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                           {item.name}
                        </Link>
                     ))}
                  </div>
               </div>

               {/* Search Bar */}
               <div className="hidden md:flex flex-1 max-w-md mx-8">
                  <div className="relative w-full">
                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                     </div>
                     <input
                        type="text"
                        placeholder="Search products..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                     />
                  </div>
               </div>

               {/* Right side buttons */}
               <div className="hidden md:flex items-center space-x-4">
                  {/* Cart */}
                  <Link href="/cart">
                     <button className="relative p-2 text-gray-700 hover:text-indigo-600 transition-colors">
                        <ShoppingCart className="h-6 w-6" />
                        {totalItems > 0 && (
                           <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {totalItems}
                           </span>
                        )}
                     </button>
                  </Link>

                  {/* User Menu */}
                  {status === "loading" ? (
                     <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  ) : session ? (
                     <div className="flex items-center space-x-3">
                        <Link href="/dashboard" className="text-black">
                           <Button variant="ghost" size="sm">
                              Dashboard
                           </Button>
                        </Link>
                        <Button
                           variant="outline"
                           size="sm"
                           onClick={() => signOut()}
                        >
                           Sign Out
                        </Button>
                     </div>
                  ) : (
                     <div className="flex items-center space-x-2">
                        <Link href="/login">
                           <Button variant="ghost" size="sm">
                              Sign In
                           </Button>
                        </Link>
                        <Link href="/signup">
                           <Button size="sm">Sign Up</Button>
                        </Link>
                     </div>
                  )}
               </div>

               {/* Mobile menu button */}
               <div className="md:hidden">
                  <button
                     onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                     className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  >
                     {isMobileMenuOpen ? (
                        <X className="h-6 w-6" />
                     ) : (
                        <Menu className="h-6 w-6" />
                     )}
                  </button>
               </div>
            </div>

            {/* Mobile menu */}
            {isMobileMenuOpen && (
               <div className="md:hidden">
                  <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
                     {navigation.map((item) => (
                        <Link
                           key={item.name}
                           href={item.href}
                           className="text-gray-700 hover:text-indigo-600 block px-3 py-2 rounded-md text-base font-medium"
                           onClick={() => setIsMobileMenuOpen(false)}
                        >
                           {item.name}
                        </Link>
                     ))}

                     {/* Mobile Search */}
                     <div className="px-3 py-2">
                        <div className="relative">
                           <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Search className="h-5 w-5 text-gray-400" />
                           </div>
                           <input
                              type="text"
                              placeholder="Search products..."
                              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                           />
                        </div>
                     </div>

                     {/* Mobile Cart and Auth */}
                     <div className="px-3 py-2 space-y-2">
                        <Link href="/cart">
                           <button className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 w-full">
                              <ShoppingCart className="h-5 w-5" />
                              <span>Cart ({totalItems})</span>
                           </button>
                        </Link>

                        {session ? (
                           <div className="space-y-2">
                              <Link href="/dashboard" className="block">
                                 <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start"
                                 >
                                    Dashboard
                                 </Button>
                              </Link>
                              <Button
                                 variant="outline"
                                 size="sm"
                                 className="w-full"
                                 onClick={() => signOut()}
                              >
                                 Sign Out
                              </Button>
                           </div>
                        ) : (
                           <div className="space-y-2">
                              <Link href="/login" className="block">
                                 <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start"
                                 >
                                    Sign In
                                 </Button>
                              </Link>
                              <Link href="/signup" className="block">
                                 <Button size="sm" className="w-full">
                                    Sign Up
                                 </Button>
                              </Link>
                           </div>
                        )}
                     </div>
                  </div>
               </div>
            )}
         </div>
      </nav>
   );
}
