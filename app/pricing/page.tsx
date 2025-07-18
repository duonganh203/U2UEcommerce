"use client";

import { useState } from "react";

export default function PricingPage() {
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

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

    const handlePlanSelect = (planId: string) => {
        setSelectedPlan(planId);
        // Có thể thêm logic chuyển hướng đến trang thanh toán ở đây
        console.log("Selected plan:", planId);
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
                                className={`mt-auto w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${
                                    plan.isPopular
                                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                                        : "border border-primary text-primary hover:bg-primary/10"
                                }`}
                            >
                                Đăng ký ngay
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
                                className='w-full py-3 px-6 rounded-lg font-semibold bg-purple-600 text-white hover:bg-purple-700 transition-all duration-200'
                            >
                                Đăng ký ngay
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
