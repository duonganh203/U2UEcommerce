"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CreditCard, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";

interface PaymentFormProps {
   totalAmount: number;
   onSuccess?: () => void;
}

export default function PaymentForm({
   totalAmount,
   onSuccess,
}: PaymentFormProps) {
   const { data: session } = useSession();
   const router = useRouter();
   const { clearCart, items: cartItems } = useCart();
   const [loading, setLoading] = useState(false);
   const [shippingAddress, setShippingAddress] = useState({
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "Việt Nam",
   });

   const handleInputChange = (field: string, value: string) => {
      setShippingAddress((prev) => ({
         ...prev,
         [field]: value,
      }));
   };

   const handleVNPayPayment = async () => {
      if (!session?.user?.id) {
         router.push("/login");
         return;
      }

      // Validate shipping address
      const requiredFields = ["street", "city", "state", "zipCode"];
      const missingFields = requiredFields.filter(
         (field) => !shippingAddress[field as keyof typeof shippingAddress]
      );

      if (missingFields.length > 0) {
         alert("Vui lòng điền đầy đủ thông tin địa chỉ giao hàng");
         return;
      }

      setLoading(true);

      try {
         const response = await fetch("/api/payment/vnpay", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               items: cartItems,
               shippingAddress,
               totalAmount,
            }),
         });

         const data = await response.json();

         if (data.success) {
            // Redirect to VNPay payment page
            window.location.href = data.paymentUrl;
         } else {
            alert("Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.");
         }
      } catch (error) {
         console.error("Payment error:", error);
         alert("Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.");
      } finally {
         setLoading(false);
      }
   };

   return (
      <div className="space-y-6">
         {/* Shipping Address Form */}
         <div className="bg-card rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
               <MapPin className="w-5 h-5 text-primary" />
               <h3 className="text-lg font-semibold text-foreground">
                  Địa chỉ giao hàng
               </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="md:col-span-2">
                  <Label htmlFor="street">Địa chỉ</Label>
                  <Input
                     id="street"
                     placeholder="Số nhà, tên đường"
                     value={shippingAddress.street}
                     onChange={(e) =>
                        handleInputChange("street", e.target.value)
                     }
                     required
                  />
               </div>

               <div>
                  <Label htmlFor="city">Thành phố</Label>
                  <Input
                     id="city"
                     placeholder="Hà Nội"
                     value={shippingAddress.city}
                     onChange={(e) => handleInputChange("city", e.target.value)}
                     required
                  />
               </div>

               <div>
                  <Label htmlFor="state">Quận/Huyện</Label>
                  <Input
                     id="state"
                     placeholder="Ba Đình"
                     value={shippingAddress.state}
                     onChange={(e) =>
                        handleInputChange("state", e.target.value)
                     }
                     required
                  />
               </div>

               <div>
                  <Label htmlFor="zipCode">Mã bưu điện</Label>
                  <Input
                     id="zipCode"
                     placeholder="100000"
                     value={shippingAddress.zipCode}
                     onChange={(e) =>
                        handleInputChange("zipCode", e.target.value)
                     }
                     required
                  />
               </div>

               <div>
                  <Label htmlFor="country">Quốc gia</Label>
                  <Input
                     id="country"
                     value={shippingAddress.country}
                     disabled
                  />
               </div>
            </div>
         </div>

         {/* Payment Method */}
         <div className="bg-card rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
               <CreditCard className="w-5 h-5 text-primary" />
               <h3 className="text-lg font-semibold text-foreground">
                  Phương thức thanh toán
               </h3>
            </div>

            <div className="space-y-4">
               <div className="flex items-center space-x-3 p-4 border border-border rounded-lg">
                  <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                     <span className="text-white text-sm font-bold">VN</span>
                  </div>
                  <div className="flex-1">
                     <h4 className="font-semibold text-foreground">VNPay</h4>
                     <p className="text-sm text-muted-foreground">
                        Thanh toán qua cổng VNPay
                     </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                     Hỗ trợ ATM, thẻ tín dụng, ví điện tử
                  </div>
               </div>
            </div>
         </div>

         {/* Payment Button */}
         <div className="space-y-4">
            <Button
               onClick={handleVNPayPayment}
               disabled={loading}
               className="w-full"
               size="lg"
            >
               {loading ? (
                  <>
                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                     Đang xử lý...
                  </>
               ) : (
                  <>
                     <CreditCard className="w-4 h-4 mr-2" />
                     Thanh toán qua VNPay
                  </>
               )}
            </Button>

            <div className="text-center">
               <p className="text-sm text-muted-foreground">
                  Bằng cách nhấn "Thanh toán", bạn đồng ý với{" "}
                  <a href="#" className="text-primary hover:underline">
                     Điều khoản sử dụng
                  </a>{" "}
                  và{" "}
                  <a href="#" className="text-primary hover:underline">
                     Chính sách bảo mật
                  </a>
               </p>
            </div>
         </div>

         {/* Security Notice */}
         <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-start space-x-3">
               <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-xs">✓</span>
               </div>
               <div>
                  <h4 className="font-semibold text-foreground mb-1">
                     Thanh toán an toàn
                  </h4>
                  <p className="text-sm text-muted-foreground">
                     Thông tin thanh toán của bạn được mã hóa và bảo vệ bởi
                     VNPay. Chúng tôi không lưu trữ thông tin thẻ tín dụng của
                     bạn.
                  </p>
               </div>
            </div>
         </div>
      </div>
   );
}
