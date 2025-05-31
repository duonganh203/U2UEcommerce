"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
   ShoppingBag,
   Star,
   Shield,
   Truck,
   ArrowRight,
   Heart,
   Search,
   User,
   Menu,
} from "lucide-react";

export default function Home() {
   const { data: session, status } = useSession();

   if (status === "loading") {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-white">
         {/* Hero Section */}
         <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                     <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                        Discover Amazing Products for Your Lifestyle
                     </h1>
                     <p className="text-xl mb-8 text-indigo-100">
                        Shop from thousands of products with fast delivery,
                        secure payments, and unbeatable prices.
                     </p>
                     <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                           href="/products"
                           className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                        >
                           Shop Now
                           <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                        <Link
                           href="/deals"
                           className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors inline-flex items-center justify-center"
                        >
                           View Deals
                        </Link>
                     </div>
                  </div>
                  <div className="relative">
                     <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                        <div className="grid grid-cols-2 gap-4">
                           <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                              <div className="w-12 h-12 bg-white/30 rounded-lg mb-3"></div>
                              <h3 className="font-semibold mb-2">
                                 Premium Quality
                              </h3>
                              <p className="text-sm text-indigo-100">
                                 Carefully curated products
                              </p>
                           </div>
                           <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                              <div className="w-12 h-12 bg-white/30 rounded-lg mb-3"></div>
                              <h3 className="font-semibold mb-2">
                                 Fast Delivery
                              </h3>
                              <p className="text-sm text-indigo-100">
                                 Free shipping worldwide
                              </p>
                           </div>
                           <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                              <div className="w-12 h-12 bg-white/30 rounded-lg mb-3"></div>
                              <h3 className="font-semibold mb-2">
                                 Secure Payment
                              </h3>
                              <p className="text-sm text-indigo-100">
                                 100% secure transactions
                              </p>
                           </div>
                           <div className="bg-white/20 rounded-lg p-4 backdrop-blur-sm">
                              <div className="w-12 h-12 bg-white/30 rounded-lg mb-3"></div>
                              <h3 className="font-semibold mb-2">
                                 24/7 Support
                              </h3>
                              <p className="text-sm text-indigo-100">
                                 Always here to help
                              </p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </section>

         {/* Features Section */}
         <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-16">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                     Why Choose ShopHub?
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                     We make online shopping easy, secure, and enjoyable with
                     our commitment to quality and service.
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                     <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Truck className="h-8 w-8 text-indigo-600" />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Free Shipping
                     </h3>
                     <p className="text-gray-600">
                        Free worldwide shipping on all orders over $50. Fast and
                        reliable delivery to your doorstep.
                     </p>
                  </div>

                  <div className="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                     <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Shield className="h-8 w-8 text-indigo-600" />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Secure Shopping
                     </h3>
                     <p className="text-gray-600">
                        Your personal information and payment details are always
                        protected with bank-level security.
                     </p>
                  </div>

                  <div className="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                     <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Star className="h-8 w-8 text-indigo-600" />
                     </div>
                     <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Quality Guarantee
                     </h3>
                     <p className="text-gray-600">
                        All products come with our quality guarantee. Not
                        satisfied? Get your money back.
                     </p>
                  </div>
               </div>
            </div>
         </section>

         {/* Featured Products */}
         <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-16">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                     Featured Products
                  </h2>
                  <p className="text-xl text-gray-600">
                     Discover our hand-picked selection of trending products
                  </p>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {[1, 2, 3, 4].map((item) => (
                     <div key={item} className="group cursor-pointer">
                        <div className="bg-gray-200 rounded-lg aspect-square mb-4 overflow-hidden">
                           <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 group-hover:scale-105 transition-transform duration-300"></div>
                        </div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                           Premium Product {item}
                        </h3>
                        <p className="text-gray-600 mb-2">
                           High-quality product description
                        </p>
                        <div className="flex items-center justify-between">
                           <span className="text-xl font-bold text-indigo-600">
                              $99.99
                           </span>
                           <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="text-sm text-gray-600 ml-1">
                                 4.8
                              </span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

               <div className="text-center mt-12">
                  <Link
                     href="/products"
                     className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors inline-flex items-center"
                  >
                     View All Products
                     <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
               </div>
            </div>
         </section>

         {/* Testimonials */}
         <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="text-center mb-16">
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                     What Our Customers Say
                  </h2>
                  <p className="text-xl text-gray-600">
                     Join thousands of satisfied customers worldwide
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                     {
                        name: "Sarah Johnson",
                        review:
                           "Amazing quality and fast shipping! I've been shopping here for months and never disappointed.",
                        rating: 5,
                     },
                     {
                        name: "Mike Chen",
                        review:
                           "Great customer service and competitive prices. Highly recommend this store to everyone.",
                        rating: 5,
                     },
                     {
                        name: "Emma Williams",
                        review:
                           "Love the variety of products and the user-friendly website. Shopping here is a pleasure!",
                        rating: 5,
                     },
                  ].map((testimonial, index) => (
                     <div
                        key={index}
                        className="bg-white p-8 rounded-xl shadow-sm"
                     >
                        <div className="flex items-center mb-4">
                           {[...Array(testimonial.rating)].map((_, i) => (
                              <Star
                                 key={i}
                                 className="h-5 w-5 text-yellow-400 fill-current"
                              />
                           ))}
                        </div>
                        <p className="text-gray-600 mb-6">
                           "{testimonial.review}"
                        </p>
                        <div className="flex items-center">
                           <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                           <div>
                              <h4 className="font-semibold text-gray-900">
                                 {testimonial.name}
                              </h4>
                              <p className="text-gray-600 text-sm">
                                 Verified Customer
                              </p>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Newsletter */}
         <section className="py-20 bg-indigo-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
               <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                  Stay Updated with Our Latest Deals
               </h2>
               <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                  Subscribe to our newsletter and be the first to know about new
                  products, exclusive deals, and special offers.
               </p>
               <div className="max-w-md mx-auto flex gap-4">
                  <input
                     type="email"
                     placeholder="Enter your email"
                     className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                  />
                  <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                     Subscribe
                  </button>
               </div>
            </div>
         </section>

         {/* Footer */}
         <footer className="bg-gray-900 text-white py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                     <div className="flex items-center space-x-2 mb-6">
                        <ShoppingBag className="h-8 w-8 text-indigo-400" />
                        <span className="text-xl font-bold">ShopHub</span>
                     </div>
                     <p className="text-gray-400 mb-6">
                        Your trusted online shopping destination for quality
                        products and exceptional service.
                     </p>
                     <div className="flex space-x-4">
                        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                           <span className="text-sm">f</span>
                        </div>
                        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                           <span className="text-sm">t</span>
                        </div>
                        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                           <span className="text-sm">in</span>
                        </div>
                     </div>
                  </div>

                  <div>
                     <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
                     <ul className="space-y-3">
                        <li>
                           <Link
                              href="/products"
                              className="text-gray-400 hover:text-white transition-colors"
                           >
                              All Products
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="/categories"
                              className="text-gray-400 hover:text-white transition-colors"
                           >
                              Categories
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="/deals"
                              className="text-gray-400 hover:text-white transition-colors"
                           >
                              Special Deals
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="/new-arrivals"
                              className="text-gray-400 hover:text-white transition-colors"
                           >
                              New Arrivals
                           </Link>
                        </li>
                     </ul>
                  </div>

                  <div>
                     <h3 className="text-lg font-semibold mb-6">
                        Customer Service
                     </h3>
                     <ul className="space-y-3">
                        <li>
                           <Link
                              href="/contact"
                              className="text-gray-400 hover:text-white transition-colors"
                           >
                              Contact Us
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="/shipping"
                              className="text-gray-400 hover:text-white transition-colors"
                           >
                              Shipping Info
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="/returns"
                              className="text-gray-400 hover:text-white transition-colors"
                           >
                              Returns
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="/faq"
                              className="text-gray-400 hover:text-white transition-colors"
                           >
                              FAQ
                           </Link>
                        </li>
                     </ul>
                  </div>

                  <div>
                     <h3 className="text-lg font-semibold mb-6">Account</h3>
                     <ul className="space-y-3">
                        <li>
                           <Link
                              href="/login"
                              className="text-gray-400 hover:text-white transition-colors"
                           >
                              Sign In
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="/signup"
                              className="text-gray-400 hover:text-white transition-colors"
                           >
                              Create Account
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="/profile"
                              className="text-gray-400 hover:text-white transition-colors"
                           >
                              My Account
                           </Link>
                        </li>
                        <li>
                           <Link
                              href="/orders"
                              className="text-gray-400 hover:text-white transition-colors"
                           >
                              Order History
                           </Link>
                        </li>
                     </ul>
                  </div>
               </div>

               <div className="border-t border-gray-800 mt-12 pt-8 text-center">
                  <p className="text-gray-400">
                     © 2025 ShopHub. All rights reserved. | Privacy Policy |
                     Terms of Service
                  </p>
               </div>
            </div>
         </footer>
      </div>
   );
}
