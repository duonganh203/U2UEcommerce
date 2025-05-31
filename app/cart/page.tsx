"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

// Dummy cart data
const dummyCartItems = [
   {
      id: "1",
      name: "Premium Wireless Headphones",
      price: 299.99,
      quantity: 1,
      image: "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg",
   },
   {
      id: "2",
      name: "Smart Fitness Watch",
      price: 199.99,
      quantity: 2,
      image: "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/primary/ProductShowcasesampleimages/JPEG/Product+Showcase-1.jpg",
   },
];

export default function CartPage() {
   const [cartItems, setCartItems] = useState(dummyCartItems);

   const updateQuantity = (id: string, change: number) => {
      setCartItems((prev) =>
         prev
            .map((item) =>
               item.id === id
                  ? { ...item, quantity: Math.max(0, item.quantity + change) }
                  : item
            )
            .filter((item) => item.quantity > 0)
      );
   };

   const removeItem = (id: string) => {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
   };

   const subtotal = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
   );
   const shipping = subtotal > 50 ? 0 : 9.99;
   const tax = subtotal * 0.08;
   const total = subtotal + shipping + tax;

   if (cartItems.length === 0) {
      return (
         <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
               <div className="text-center">
                  <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                     Your cart is empty
                  </h1>
                  <p className="text-gray-600 mb-8">
                     Looks like you haven't added anything to your cart yet.
                  </p>
                  <Link href="/products">
                     <Button size="lg">Continue Shopping</Button>
                  </Link>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gray-50">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
               Shopping Cart
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Cart Items */}
               <div className="lg:col-span-2">
                  <div className="bg-white rounded-lg shadow-md">
                     <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6">
                           Cart Items ({cartItems.length})
                        </h2>

                        <div className="space-y-6">
                           {cartItems.map((item) => (
                              <div
                                 key={item.id}
                                 className="flex items-center space-x-4 pb-6 border-b border-gray-200 last:border-b-0"
                              >
                                 <div className="w-20 h-20 relative bg-gray-100 rounded-lg overflow-hidden">
                                    <Image
                                       src={item.image}
                                       alt={item.name}
                                       fill
                                       className="object-cover"
                                    />
                                 </div>

                                 <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">
                                       {item.name}
                                    </h3>
                                    <p className="text-gray-600">
                                       ${item.price}
                                    </p>
                                 </div>

                                 <div className="flex items-center space-x-2">
                                    <button
                                       onClick={() =>
                                          updateQuantity(item.id, -1)
                                       }
                                       className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                                    >
                                       <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center">
                                       {item.quantity}
                                    </span>
                                    <button
                                       onClick={() =>
                                          updateQuantity(item.id, 1)
                                       }
                                       className="p-1 border border-gray-300 rounded hover:bg-gray-50"
                                    >
                                       <Plus className="w-4 h-4" />
                                    </button>
                                 </div>

                                 <div className="text-right">
                                    <p className="font-semibold text-gray-900">
                                       $
                                       {(item.price * item.quantity).toFixed(2)}
                                    </p>
                                    <button
                                       onClick={() => removeItem(item.id)}
                                       className="text-red-500 hover:text-red-700 text-sm mt-1"
                                    >
                                       Remove
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="mt-6">
                     <Link href="/products">
                        <Button variant="outline">Continue Shopping</Button>
                     </Link>
                  </div>
               </div>

               {/* Order Summary */}
               <div className="lg:col-span-1">
                  <div className="bg-white rounded-lg shadow-md p-6">
                     <h2 className="text-lg font-semibold text-gray-900 mb-6">
                        Order Summary
                     </h2>

                     <div className="space-y-4">
                        <div className="flex justify-between">
                           <span className="text-gray-600">Subtotal</span>
                           <span className="font-semibold">
                              ${subtotal.toFixed(2)}
                           </span>
                        </div>

                        <div className="flex justify-between">
                           <span className="text-gray-600">Shipping</span>
                           <span className="font-semibold">
                              {shipping === 0
                                 ? "Free"
                                 : `$${shipping.toFixed(2)}`}
                           </span>
                        </div>

                        <div className="flex justify-between">
                           <span className="text-gray-600">Tax</span>
                           <span className="font-semibold">
                              ${tax.toFixed(2)}
                           </span>
                        </div>

                        <div className="border-t pt-4">
                           <div className="flex justify-between">
                              <span className="text-lg font-semibold text-gray-900">
                                 Total
                              </span>
                              <span className="text-lg font-semibold text-gray-900">
                                 ${total.toFixed(2)}
                              </span>
                           </div>
                        </div>
                     </div>

                     <div className="mt-6 space-y-3">
                        <Button className="w-full" size="lg">
                           Proceed to Checkout
                        </Button>

                        <div className="text-sm text-gray-600 text-center">
                           {shipping > 0 && (
                              <p>
                                 Add ${(50 - subtotal).toFixed(2)} more for free
                                 shipping!
                              </p>
                           )}
                        </div>
                     </div>

                     {/* Security badges */}
                     <div className="mt-6 pt-6 border-t">
                        <div className="text-center">
                           <p className="text-sm text-gray-600 mb-2">
                              Secure Checkout
                           </p>
                           <div className="flex justify-center space-x-2 text-xs text-gray-500">
                              <span>🔒 SSL Encrypted</span>
                              <span>•</span>
                              <span>💳 Safe Payment</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
