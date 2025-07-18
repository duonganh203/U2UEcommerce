"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import SubscriptionStatus from "@/components/SubscriptionStatus";

export default function PricingPage() {
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

    const sellerPlans = [
        {
            id: "basic",
            title: "Gói Cơ Bản",
            price: "Miễn phí",
            description:
                "Đăng 5 tin/tháng miễn phí. Dùng AI định giá 3 lần/tháng.",
            features: [
                "Đăng 5 tin/tháng free",
                "Được dùng AI định giá 3 lần/tháng",
            ],
            isPopular: false,
            color: "green",
        },
        {
            id: "vip",
            title: "Gói VIP",
            price: "150.000₫",
            description:
                "Đăng không giới hạn. Đẩy 7 tin trong 7 ngày liên tiếp/khung giờ tự chọn. Kiểm duyệt nhanh trong 1h. AI định giá không giới hạn.",
            features: [
                "Đăng không giới hạn",
                "Đẩy 7 tin trong 7 ngày liên tiếp trong 1 khung giờ tự chọn",
                "Hỗ trợ kiểm duyệt nhanh trong vòng 1h",
                "Được dùng AI định giá không giới hạn",
                "Báo cáo hiệu suất & công cụ quản lý khách hàng",
                "Ưu tiên hiển thị trên danh mục",
            ],
            isPopular: true,
            color: "blue",
        },
        {
            id: "pro",
            title: "Gói Pro",
            price: "50.000₫",
            description:
                "Đăng 15 tin/tháng. Đẩy 3 tin trong 3 ngày/khung giờ tự chọn. AI định giá 3-5 lần/ngày.",
            features: [
                "Đăng 15 tin/tháng",
                "Đẩy 3 tin trong 3 ngày trong 1 khung giờ tự chọn",
                "Được dùng AI định giá từ 3-5 lần/ngày",
            ],
            isPopular: false,
            color: "orange",
        },
    ];

    const pushPlans = [
        {
            id: "push-single",
            title: "Gói Đẩy Tin Lẻ",
            price: "20.000₫/tin",
            description:
                "Mua 5 tin trở lên còn 75.000₫/5 tin. Đẩy 5 tin trong 7 ngày/khung giờ tự chọn. Đẩy tin theo từ khoá, cá nhân hoá tìm kiếm sản phẩm.",
            features: [
                "20k/tin",
                "Mua 5 tin trở lên còn 75k/5 tin",
                "Đẩy 5 tin trong 7 ngày vào 1 khung giờ tự chọn",
                "Đẩy tin theo từ khoá, cá nhân hoá tìm kiếm sản phẩm",
            ],
            isPopular: false,
            color: "purple",
        },
    ];

    const handlePlanSelect = async (planId: string) => {
        if (!session?.user) {
            setMessage({
                type: "error",
                text: "Vui lòng đăng nhập để đăng ký gói dịch vụ.",
            });
            return;
        }

        setLoading(true);
        setMessage(null);

        try {
            const response = await fetch("/api/payment/subscription", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ planId }),
            });

            const data = await response.json();

            console.log("API Response:", data);

            if (data.success) {
                if (planId === "basic") {
                    // Gói basic được kích hoạt ngay lập tức
                    setMessage({
                        type: "success",
                        text: "Gói Basic đã được kích hoạt thành công!",
                    });
                    // Reload trang để cập nhật trạng thái
                    window.location.reload();
                } else {
                    // Chuyển hướng đến VNPay cho các gói trả phí
                    console.log("Redirecting to VNPay:", data.paymentUrl);
                    window.location.href = data.paymentUrl;
                }
            } else {
                setMessage({
                    type: "error",
                    text: data.error || "Có lỗi xảy ra khi đăng ký gói.",
                });
            }
        } catch (error) {
            console.error("Error subscribing to plan:", error);
            setMessage({
                type: "error",
                text: "Có lỗi xảy ra khi kết nối đến server.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-background via-background to-muted/20'>
            <div className='container mx-auto px-4 py-16 max-w-5xl'>
                {/* Header */}
                <div className='text-center mb-16'>
                    <h1 className='text-4xl md:text-5xl font-bold text-foreground mb-6'>
                        Bảng giá dịch vụ
                    </h1>
                    <p className='text-xl text-muted-foreground max-w-3xl mx-auto'>
                        Lựa chọn gói phù hợp với nhu cầu đăng tin và đẩy tin của
                        bạn
                    </p>
                </div>

                {/* Thông báo */}
                {message && (
                    <div
                        className={`mb-8 p-4 rounded-lg ${
                            message.type === "success"
                                ? "bg-green-100 border border-green-400 text-green-700"
                                : "bg-red-100 border border-red-400 text-red-700"
                        }`}
                    >
                        {message.text}
                    </div>
                )}

                {/* Hiển thị trạng thái gói hiện tại */}
                {session?.user && (
                    <div className='mb-8'>
                        <h2 className='text-xl font-semibold text-foreground mb-4'>
                            Gói dịch vụ hiện tại
                        </h2>
                        <SubscriptionStatus />
                    </div>
                )}

                {/* Seller Plans */}
                <h2 className='text-2xl font-bold text-foreground mb-6'>
                    Gói dành cho người bán
                </h2>
                <div className='grid md:grid-cols-3 gap-8 mb-12'>
                    {sellerPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative flex flex-col bg-card rounded-2xl p-8 shadow-lg border transition-all duration-300 hover:shadow-xl min-h-[480px] ${
                                plan.isPopular
                                    ? "ring-2 ring-primary scale-105"
                                    : ""
                            }`}
                        >
                            {/* Popular Badge */}
                            {plan.isPopular && (
                                <div className='absolute -top-4 left-1/2 transform -translate-x-1/2 z-10'>
                                    <span className='bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow'>
                                        Gói nổi bật
                                    </span>
                                </div>
                            )}
                            <div className='flex flex-col items-center flex-1'>
                                <div
                                    className={`inline-block text-5xl mb-4 mt-2 ${
                                        plan.color === "green"
                                            ? "text-green-500"
                                            : plan.color === "orange"
                                            ? "text-orange-500"
                                            : "text-blue-500"
                                    }`}
                                >
                                    {plan.id === "basic"
                                        ? "🆓"
                                        : plan.id === "pro"
                                        ? "⭐"
                                        : "👑"}
                                </div>
                                <h3 className='text-xl font-bold text-foreground mb-1 text-center'>
                                    {plan.title}
                                </h3>
                                <div className='text-2xl font-bold text-foreground mb-2 text-center'>
                                    {plan.price}
                                </div>
                                <p className='text-muted-foreground text-sm mb-4 text-center min-h-[48px] flex items-center justify-center'>
                                    {plan.description}
                                </p>
                                <ul className='space-y-2 mb-8 w-full'>
                                    {plan.features.map((feature, idx) => (
                                        <li
                                            key={idx}
                                            className='flex items-start gap-2'
                                        >
                                            <svg
                                                className='w-5 h-5 text-green-500 mt-0.5 flex-shrink-0'
                                                fill='currentColor'
                                                viewBox='0 0 20 20'
                                            >
                                                <path
                                                    fillRule='evenodd'
                                                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                                    clipRule='evenodd'
                                                />
                                            </svg>
                                            <span className='text-sm text-foreground'>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <div className='flex-1' />
                            </div>
                            <button
                                onClick={() => handlePlanSelect(plan.id)}
                                disabled={loading}
                                className={`mt-auto w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                                    plan.isPopular
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                                        : "border border-primary text-primary hover:bg-primary/10 disabled:opacity-50"
                                }`}
                            >
                                {loading ? "Đang xử lý..." : "Đăng ký ngay"}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Push Plans */}
                <h2 className='text-2xl font-bold text-foreground mb-6'>
                    Gói đẩy tin lẻ
                </h2>
                <div className='grid md:grid-cols-2 gap-8 mb-12'>
                    {pushPlans.map((plan) => (
                        <div
                            key={plan.id}
                            className='relative bg-card rounded-2xl p-8 shadow-lg border transition-all duration-300 hover:shadow-xl'
                        >
                            <div className='text-center mb-6'>
                                <div className='inline-block text-5xl mb-4 text-purple-500'>
                                    📢
                                </div>
                            </div>
                            <div className='text-center mb-6'>
                                <h3 className='text-xl font-bold text-foreground mb-2'>
                                    {plan.title}
                                </h3>
                                <div className='text-2xl font-bold text-foreground mb-1'>
                                    {plan.price}
                                </div>
                                <p className='text-muted-foreground text-sm mb-2'>
                                    {plan.description}
                                </p>
                            </div>
                            <ul className='space-y-2 mb-8'>
                                {plan.features.map((feature, idx) => (
                                    <li
                                        key={idx}
                                        className='flex items-start gap-2'
                                    >
                                        <svg
                                            className='w-5 h-5 text-green-500 mt-0.5 flex-shrink-0'
                                            fill='currentColor'
                                            viewBox='0 0 20 20'
                                        >
                                            <path
                                                fillRule='evenodd'
                                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                                clipRule='evenodd'
                                            />
                                        </svg>
                                        <span className='text-sm text-foreground'>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => handlePlanSelect(plan.id)}
                                disabled={loading}
                                className='w-full py-3 px-6 rounded-lg font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200 disabled:opacity-50'
                            >
                                {loading ? "Đang xử lý..." : "Đăng ký ngay"}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
