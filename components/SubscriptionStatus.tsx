"use client";

import { useSession } from "next-auth/react";
import { useSubscription } from "@/hooks/useSubscription";

interface Subscription {
    plan: "basic" | "pro" | "vip";
    isActive: boolean;
    startDate?: string;
    endDate?: string;
    pushCredits?: number;
    aiCredits?: number;
}

export default function SubscriptionStatus() {
    const { data: session } = useSession();
    const { subscription, loading } = useSubscription();

    if (!session?.user) {
        return null;
    }

    if (loading) {
        return (
            <div className='flex items-center justify-center p-4'>
                <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary'></div>
            </div>
        );
    }

    if (!subscription) {
        return null;
    }

    const getPlanInfo = (plan: string) => {
        switch (plan) {
            case "basic":
                return {
                    name: "Gói Cơ Bản",
                    color: "text-green-600",
                    bgColor: "bg-green-100",
                    icon: "🆓",
                };
            case "pro":
                return {
                    name: "Gói Pro",
                    color: "text-orange-600",
                    bgColor: "bg-orange-100",
                    icon: "⭐",
                };
            case "vip":
                return {
                    name: "Gói VIP",
                    color: "text-blue-600",
                    bgColor: "bg-blue-100",
                    icon: "👑",
                };
            default:
                return {
                    name: "Gói Cơ Bản",
                    color: "text-gray-600",
                    bgColor: "bg-gray-100",
                    icon: "📦",
                };
        }
    };

    const planInfo = getPlanInfo(subscription.plan);

    return (
        <div className={`rounded-lg p-4 ${planInfo.bgColor} border`}>
            <div className='flex items-center gap-3'>
                <div className='text-2xl'>{planInfo.icon}</div>
                <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                        <h3 className={`font-semibold ${planInfo.color}`}>
                            {planInfo.name}
                        </h3>
                        {subscription.isActive ? (
                            <span className='px-2 py-1 text-xs bg-green-500 text-white rounded-full'>
                                Đang hoạt động
                            </span>
                        ) : (
                            <span className='px-2 py-1 text-xs bg-red-500 text-white rounded-full'>
                                Hết hạn
                            </span>
                        )}
                    </div>

                    {subscription.endDate && (
                        <p className='text-sm text-gray-600 mt-1'>
                            Hết hạn:{" "}
                            {new Date(subscription.endDate).toLocaleDateString(
                                "vi-VN"
                            )}
                        </p>
                    )}

                    <div className='flex gap-4 mt-2 text-sm'>
                        {subscription.aiCredits !== undefined && (
                            <div className='flex items-center gap-1'>
                                <span className='text-gray-600'>AI:</span>
                                <span className='font-medium'>
                                    {subscription.aiCredits === 999
                                        ? "∞"
                                        : subscription.aiCredits}
                                </span>
                            </div>
                        )}
                        {subscription.pushCredits !== undefined &&
                            subscription.pushCredits > 0 && (
                                <div className='flex items-center gap-1'>
                                    <span className='text-gray-600'>
                                        Đẩy tin:
                                    </span>
                                    <span className='font-medium'>
                                        {subscription.pushCredits}
                                    </span>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
}
