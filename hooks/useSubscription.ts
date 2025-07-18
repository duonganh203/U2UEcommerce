import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Subscription {
    plan: "basic" | "pro" | "vip";
    isActive: boolean;
    startDate?: string;
    endDate?: string;
    pushCredits?: number;
    aiCredits?: number;
}

export function useSubscription() {
    const { data: session } = useSession();
    const [subscription, setSubscription] = useState<Subscription | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSubscription = async () => {
        if (!session?.user) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const response = await fetch("/api/user/subscription");
            const data = await response.json();

            if (data.success) {
                setSubscription(data.subscription);
            } else {
                setError(data.error || "Không thể tải thông tin gói dịch vụ");
            }
        } catch (err) {
            console.error("Error fetching subscription:", err);
            setError("Có lỗi xảy ra khi tải thông tin gói dịch vụ");
        } finally {
            setLoading(false);
        }
    };

    const refreshSubscription = () => {
        fetchSubscription();
    };

    useEffect(() => {
        fetchSubscription();
    }, [session]);

    return {
        subscription,
        loading,
        error,
        refreshSubscription,
    };
}
