"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import PaymentForm from "@/components/PaymentForm";

export default function CartPage() {
   const {
      items: cartItems,
      updateQuantity,
      removeFromCart,
      totalPrice,
   } = useCart();

   // Calculate additional costs based on cart total
   const subtotal = totalPrice;
   const shipping = subtotal > 50 ? 0 : 9.99;
   const tax = subtotal * 0.08;
   const total = subtotal + shipping + tax;
   if (cartItems.length === 0) {
      return (
         <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
               <div className="text-center">
                  <ShoppingBag className="w-24 h-24 text-muted-foreground/50 mx-auto mb-6" />
                  <h1 className="text-3xl font-bold text-foreground mb-4">
                     Giỏ hàng của bạn đang trống
                  </h1>
                  <p className="text-muted-foreground mb-8">
                     Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.
                  </p>
                  <Link href="/products">
                     <Button size="lg">Tiếp tục mua sắm</Button>
                  </Link>
               </div>
            </div>
         </div>
      );
   }
   return (
      <div className="min-h-screen bg-background">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">
               Giỏ hàng
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Cart Items */}
               <div className="lg:col-span-2">
                  <div className="bg-card rounded-lg shadow-md">
                     <div className="p-6">
                        <h2 className="text-lg font-semibold text-foreground mb-6">
                           Sản phẩm trong giỏ ({cartItems.length})
                        </h2>

                        <div className="space-y-6">
                           {cartItems.map((item) => (
                              <div
                                 key={item.id}
                                 className="flex items-center space-x-4 pb-6 border-b border-border last:border-b-0"
                              >
                                 <div className="w-20 h-20 relative bg-muted rounded-lg overflow-hidden">
                                    <Image
                                       src={item.image}
                                       alt={item.name}
                                       fill
                                       className="object-cover"
                                    />
                                 </div>

                                 <div className="flex-1">
                                    <h3 className="font-semibold text-foreground">
                                       {item.name}
                                    </h3>
                                    <p className="text-muted-foreground">
                                       {item.price.toLocaleString()}₫
                                    </p>
                                 </div>

                                 <div className="flex items-center space-x-2">
                                    <button
                                       onClick={() =>
                                          updateQuantity(
                                             item.id,
                                             item.quantity - 1
                                          )
                                       }
                                       className="p-1 border border-input rounded hover:bg-muted"
                                    >
                                       <Minus className="w-4 h-4" />
                                    </button>
                                    <span className="w-8 text-center text-foreground">
                                       {item.quantity}
                                    </span>
                                    <button
                                       onClick={() =>
                                          updateQuantity(
                                             item.id,
                                             item.quantity + 1
                                          )
                                       }
                                       className="p-1 border border-input rounded hover:bg-muted"
                                    >
                                       <Plus className="w-4 h-4" />
                                    </button>
                                 </div>

                                 <div className="text-right">
                                    <p className="font-semibold text-foreground">
                                       {(
                                          item.price * item.quantity
                                       ).toLocaleString()}
                                       ₫
                                    </p>
                                    <button
                                       onClick={() => removeFromCart(item.id)}
                                       className="text-destructive hover:text-destructive/80 text-sm mt-1"
                                    >
                                       Xóa
                                    </button>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="mt-6">
                     <Link href="/products">
                        <Button variant="outline">Tiếp tục mua sắm</Button>
                     </Link>
                  </div>
               </div>{" "}
               {/* Order Summary */}
               <div className="lg:col-span-1">
                  <div className="bg-card rounded-lg shadow-md p-6">
                     <h2 className="text-lg font-semibold text-foreground mb-6">
                        Thông tin đơn hàng
                     </h2>

                     <div className="space-y-4">
                        <div className="flex justify-between">
                           <span className="text-muted-foreground">
                              Tạm tính
                           </span>
                           <span className="font-semibold text-foreground">
                              {subtotal.toLocaleString()}₫
                           </span>
                        </div>

                        <div className="flex justify-between">
                           <span className="text-muted-foreground">
                              Phí vận chuyển
                           </span>
                           <span className="font-semibold text-foreground">
                              {shipping === 0
                                 ? "Miễn phí"
                                 : `${shipping.toLocaleString()}₫`}
                           </span>
                        </div>

                        <div className="flex justify-between">
                           <span className="text-muted-foreground">Tax</span>
                           <span className="font-semibold text-foreground">
                              {tax.toLocaleString()}₫
                           </span>
                        </div>

                        <div className="border-t border-border pt-4">
                           <div className="flex justify-between">
                              <span className="text-lg font-semibold text-foreground">
                                 Tổng cộng
                              </span>
                              <span className="text-lg font-semibold text-foreground">
                                 {total.toLocaleString()}₫
                              </span>
                           </div>
                        </div>
                     </div>

                     <div className="mt-6">
                        <PaymentForm totalAmount={total} />
                     </div>

                     {/* Security badges */}
                     <div className="mt-6 pt-6 border-t border-border">
                        <div className="text-center">
                           <p className="text-sm text-muted-foreground mb-2">
                              Thanh toán an toàn
                           </p>
                           <div className="flex justify-center space-x-2 text-xs text-muted-foreground/80">
                              <span>🔒 Mã hóa SSL</span>
                              <span>•</span>
                              <span>💳 Thanh toán an toàn</span>
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
