import { NextRequest, NextResponse } from "next/server";
import { User } from "@/models/User";
import connectDB from "@/lib/db";

export async function GET(request: NextRequest) {
    try {
        // Kiểm tra API key để đảm bảo chỉ cron job có thể gọi
        const authHeader = request.headers.get("authorization");
        if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        console.log("Bắt đầu kiểm tra trạng thái gói dịch vụ...");

        const now = new Date();
        let updatedCount = 0;

        // Tìm tất cả user có gói hết hạn nhưng vẫn đang active
        const expiredSubscriptions = await User.find({
            "subscription.endDate": { $lt: now },
            "subscription.isActive": true,
        });

        console.log(`Tìm thấy ${expiredSubscriptions.length} gói hết hạn`);

        for (const user of expiredSubscriptions) {
            if (user.subscription) {
                user.subscription.isActive = false;
                await user.save();
                updatedCount++;
                console.log(
                    `Đã cập nhật trạng thái gói cho user: ${user.email}`
                );
            }
        }

        // Reset AI credits hàng tháng cho gói basic
        const basicUsers = await User.find({
            "subscription.plan": "basic",
            "subscription.isActive": true,
        });

        for (const user of basicUsers) {
            if (user.subscription) {
                const lastReset = user.subscription.startDate;
                const daysSinceReset = Math.floor(
                    (now.getTime() - new Date(lastReset).getTime()) /
                        (1000 * 60 * 60 * 24)
                );

                // Reset sau 30 ngày
                if (daysSinceReset >= 30) {
                    user.subscription.aiCredits = 3;
                    user.subscription.startDate = now;
                    user.subscription.endDate = new Date(
                        now.getTime() + 30 * 24 * 60 * 60 * 1000
                    );
                    await user.save();
                    console.log(`Đã reset AI credits cho user: ${user.email}`);
                }
            }
        }

        console.log(`Hoàn thành! Đã cập nhật ${updatedCount} gói hết hạn`);

        return NextResponse.json({
            success: true,
            message: `Đã cập nhật ${updatedCount} gói hết hạn`,
            updatedCount,
        });
    } catch (error) {
        console.error("Error checking subscriptions:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
