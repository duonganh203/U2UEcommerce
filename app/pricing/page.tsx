"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import SubscriptionStatus from "@/components/SubscriptionStatus";

function PricingContent() {
   const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
   const [loading, setLoading] = useState(false);
   const [message, setMessage] = useState<{
      type: "success" | "error";
      text: string;
   } | null>(null);
   const { data: session } = useSession();
   const searchParams = useSearchParams();

   // Xử lý thông báo từ URL params
   useEffect(() => {
      const success = searchParams.get("success");
      const error = searchParams.get("error");
      const plan = searchParams.get("plan");

      if (success === "true" && plan) {
         setMessage({
            type: "success",
            text: `Thanh toán thành công! Gói ${plan} đã được kích hoạt.`,
         });
      } else if (error) {
         let errorText = "Có lỗi xảy ra";
         switch (error) {
            case "payment_failed":
               errorText = "Thanh toán thất bại. Vui lòng thử lại.";
               break;
            case "invalid_signature":
               errorText = "Lỗi xác thực thanh toán.";
               break;
            case "user_not_found":
               errorText = "Không tìm thấy thông tin người dùng.";
               break;
            default:
               errorText = "Có lỗi xảy ra trong quá trình thanh toán.";
         }
         setMessage({
            type: "error",
            text: errorText,
         });
      }
   }, [searchParams]);

   const plans = [
      {
         id: "basic",
         name: "Gói Cơ Bản",
         price: "0",
         period: "miễn phí",
         description: "Dành cho người mới bắt đầu",
         features: [
            "Đăng tối đa 5 sản phẩm/tháng",
            "Hỗ trợ email cơ bản",
            "Truy cập các tính năng cơ bản",
            "Quản lý đơn hàng đơn giản",
         ],
         buttonText: "Sử dụng miễn phí",
         recommended: false,
         color: "gray",
      },
      {
         id: "premium",
         name: "Gói Premium",
         price: "299,000",
         period: "/tháng",
         description: "Dành cho người bán chuyên nghiệp",
         features: [
            "Đăng không giới hạn sản phẩm",
            "Hỗ trợ khách hàng 24/7",
            "Analytics chi tiết",
            "Quản lý kho hàng nâng cao",
            "Tích hợp API",
            "Ưu tiên hiển thị sản phẩm",
         ],
         buttonText: "Đăng ký Premium",
         recommended: true,
         color: "blue",
      },
      {
         id: "enterprise",
         name: "Gói Enterprise",
         price: "999,000",
         period: "/tháng",
         description: "Dành cho doanh nghiệp lớn",
         features: [
            "Tất cả tính năng Premium",
            "Quản lý đa cửa hàng",
            "Tích hợp ERP",
            "Dedicated account manager",
            "Custom branding",
            "SLA 99.9% uptime",
            "Báo cáo doanh thu chi tiết",
         ],
         buttonText: "Liên hệ tư vấn",
         recommended: false,
         color: "purple",
      },
   ];

   const handleSubscribe = async (planId: string) => {
      if (!session?.user) {
         alert("Vui lòng đăng nhập để đăng ký gói dịch vụ");
         return;
      }

      if (planId === "basic") {
         alert("Bạn đã có gói cơ bản miễn phí");
         return;
      }

      if (planId === "enterprise") {
         alert("Vui lòng liên hệ với chúng tôi để được tư vấn gói Enterprise");
         return;
      }

      setSelectedPlan(planId);
      setLoading(true);
      setMessage(null);

      try {
         const response = await fetch("/api/payment/subscription", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               planId,
            }),
         });

         const data = await response.json();

         if (data.success && data.paymentUrl) {
            // Redirect to VNPay
            window.location.href = data.paymentUrl;
         } else {
            throw new Error(data.error || "Failed to create payment");
         }
      } catch (error) {
         console.error("Error creating subscription payment:", error);
         setMessage({
            type: "error",
            text: "Có lỗi xảy ra khi tạo thanh toán. Vui lòng thử lại.",
         });
      } finally {
         setLoading(false);
         setSelectedPlan(null);
      }
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-20">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
               <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
                  Chọn gói dịch vụ phù hợp
               </h1>
               <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                  Nâng cao trải nghiệm bán hàng với các tính năng chuyên nghiệp
               </p>
            </div>

            {/* Subscription Status */}
            {session?.user && (
               <div className="mb-8">
                  <SubscriptionStatus />
               </div>
            )}

            {/* Message */}
            {message && (
               <div
                  className={`mb-8 p-4 rounded-lg ${
                     message.type === "success"
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-red-100 text-red-800 border border-red-200"
                  }`}
               >
                  {message.text}
               </div>
            )}

            <div className="grid md:grid-cols-3 gap-8">
               {plans.map((plan) => (
                  <div
                     key={plan.id}
                     className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 ${
                        plan.recommended
                           ? "ring-4 ring-blue-500 ring-opacity-60"
                           : ""
                     }`}
                  >
                     {plan.recommended && (
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                           <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                              Khuyến nghị
                           </span>
                        </div>
                     )}

                     <div className="p-8">
                        <div className="text-center mb-8">
                           <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                              {plan.name}
                           </h3>
                           <p className="mt-2 text-gray-600 dark:text-gray-300">
                              {plan.description}
                           </p>
                        </div>

                        <div className="text-center mb-8">
                           <div className="flex items-baseline justify-center">
                              <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                                 {plan.price === "0"
                                    ? "Miễn phí"
                                    : `${plan.price}₫`}
                              </span>
                              {plan.price !== "0" && (
                                 <span className="ml-2 text-xl text-gray-600 dark:text-gray-300">
                                    {plan.period}
                                 </span>
                              )}
                           </div>
                        </div>

                        <ul className="space-y-4 mb-8">
                           {plan.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                 <svg
                                    className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                 >
                                    <path
                                       fillRule="evenodd"
                                       d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                       clipRule="evenodd"
                                    />
                                 </svg>
                                 <span className="ml-3 text-gray-700 dark:text-gray-300">
                                    {feature}
                                 </span>
                              </li>
                           ))}
                        </ul>

                        <button
                           onClick={() => handleSubscribe(plan.id)}
                           disabled={loading && selectedPlan === plan.id}
                           className={`w-full py-3 px-6 rounded-lg font-semibold text-center transition-all duration-200 ${
                              plan.recommended
                                 ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                                 : plan.color === "gray"
                                 ? "bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                 : "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:hover:bg-purple-800"
                           } ${
                              loading && selectedPlan === plan.id
                                 ? "opacity-50 cursor-not-allowed"
                                 : ""
                           }`}
                        >
                           {loading && selectedPlan === plan.id
                              ? "Đang xử lý..."
                              : plan.buttonText}
                        </button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}

function PricingFallback() {
   return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-20">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
               <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
                  Đang tải...
               </h1>
               <div className="mt-8 flex justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
               </div>
               <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                  Đang tải thông tin gói dịch vụ...
               </p>
            </div>
         </div>
      </div>
   );
}

export default function PricingPage() {
   return (
      <Suspense fallback={<PricingFallback />}>
         <PricingContent />
      </Suspense>
   );
}
