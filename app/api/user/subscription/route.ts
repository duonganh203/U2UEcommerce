import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/models/User";
import connectDB from "@/lib/db";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const user = await User.findById(session.user.id).select(
            "subscription"
        );
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Kiểm tra xem gói có hết hạn không
        if (user.subscription && user.subscription.endDate) {
            const now = new Date();
            const endDate = new Date(user.subscription.endDate);

            if (now > endDate && user.subscription.isActive) {
                user.subscription.isActive = false;
                await user.save();
            }
        }

        return NextResponse.json({
            success: true,
            subscription: user.subscription || {
                plan: "basic",
                isActive: true,
                pushCredits: 0,
                aiCredits: 3,
            },
        });
    } catch (error) {
        console.error("Get subscription error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
