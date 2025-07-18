"use client";

import { useSession } from "next-auth/react";
import { useSubscription } from "@/hooks/useSubscription";

interface Subscription {
    plan: "basic" | "pro" | "vip";
    isActive: boolean;
    endDate?: string;
    pushCredits?: number;
    aiCredits?: number;
}

export default function SubscriptionBadge() {
    const { data: session } = useSession();
    const { subscription } = useSubscription();

    if (!session?.user || !subscription) {
        return null;
    }

    const getPlanInfo = (plan: string) => {
        switch (plan) {
            case "basic":
                return {
                    name: "Basic",
                    color: "text-green-600",
                    bgColor: "bg-green-100",
                    icon: "🆓",
                };
            case "pro":
                return {
                    name: "Pro",
                    color: "text-orange-600",
                    bgColor: "bg-orange-100",
                    icon: "⭐",
                };
            case "vip":
                return {
                    name: "VIP",
                    color: "text-blue-600",
                    bgColor: "bg-blue-100",
                    icon: "👑",
                };
            default:
                return {
                    name: "Basic",
                    color: "text-gray-600",
                    bgColor: "bg-gray-100",
                    icon: "📦",
                };
        }
    };

    const planInfo = getPlanInfo(subscription.plan);

    return (
        <div
            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${planInfo.bgColor} ${planInfo.color}`}
        >
            <span>{planInfo.icon}</span>
            <span className='font-medium'>{planInfo.name}</span>
            {subscription.isActive ? (
                <span className='w-2 h-2 bg-green-500 rounded-full'></span>
            ) : (
                <span className='w-2 h-2 bg-red-500 rounded-full'></span>
            )}
        </div>
    );
}
