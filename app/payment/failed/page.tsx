"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { XCircle, RefreshCw, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentFailedPage() {
   const searchParams = useSearchParams();
   const error = searchParams.get("error");
   const code = searchParams.get("code");

   const getErrorMessage = (error: string | null, code: string | null) => {
      switch (error) {
         case "payment_failed":
            return "Thanh toán không thành công. Vui lòng thử lại.";
         case "invalid_signature":
            return "Lỗi xác thực thanh toán. Vui lòng thử lại.";
         case "order_not_found":
            return "Không tìm thấy đơn hàng. Vui lòng liên hệ hỗ trợ.";
         case "server_error":
            return "Lỗi hệ thống. Vui lòng thử lại sau.";
         default:
            return "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.";
      }
   };

   return (
      <div className="min-h-screen bg-background">
         <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
               <XCircle className="w-24 h-24 text-red-500 mx-auto mb-6" />

               <h1 className="text-3xl font-bold text-foreground mb-4">
                  Thanh toán thất bại
               </h1>

               <p className="text-muted-foreground mb-8">
                  {getErrorMessage(error, code)}
               </p>

               {code && (
                  <div className="bg-card rounded-lg shadow-md p-6 mb-8">
                     <h2 className="text-lg font-semibold text-foreground mb-4">
                        Chi tiết lỗi
                     </h2>

                     <div className="space-y-2 text-left">
                        <div className="flex justify-between">
                           <span className="text-muted-foreground">
                              Mã lỗi:
                           </span>
                           <span className="font-semibold text-foreground">
                              {code}
                           </span>
                        </div>

                        <div className="flex justify-between">
                           <span className="text-muted-foreground">
                              Loại lỗi:
                           </span>
                           <span className="font-semibold text-red-600">
                              {error}
                           </span>
                        </div>
                     </div>
                  </div>
               )}

               <div className="space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                     <RefreshCw className="w-4 h-4" />
                     <span>
                        Bạn có thể thử thanh toán lại hoặc chọn phương thức khác
                     </span>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <Link href="/cart">
                        <Button variant="outline" className="w-full sm:w-auto">
                           <ShoppingBag className="w-4 h-4 mr-2" />
                           Quay lại giỏ hàng
                        </Button>
                     </Link>

                     <Link href="/products">
                        <Button className="w-full sm:w-auto">
                           <Home className="w-4 h-4 mr-2" />
                           Tiếp tục mua sắm
                        </Button>
                     </Link>
                  </div>
               </div>

               <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4">
                     Nếu vấn đề vẫn tiếp tục, vui lòng liên hệ với chúng tôi:
                  </p>
                  <div className="text-sm text-muted-foreground">
                     <p>📧 Email: support@example.com</p>
                     <p>📞 Hotline: 1900-xxxx</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
