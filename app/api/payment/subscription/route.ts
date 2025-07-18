import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { User } from "@/models/User";
import connectDB from "@/lib/db";

// VNPay test configuration
const VNPAY_TMN_CODE = "UDPRUCJX";
const VNPAY_HASH_SECRET = "DLZ5B0HXFL9GQQSE6M0YSVTMGLZPB5WQ";
const VNPAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const VNPAY_RETURN_URL =
    "http://localhost:3000/api/payment/subscription/callback";

// Định nghĩa các gói dịch vụ
const SUBSCRIPTION_PLANS = {
    basic: {
        price: 0,
        duration: 30, // 30 ngày
        pushCredits: 0,
        aiCredits: 3,
    },
    pro: {
        price: 50000,
        duration: 30,
        pushCredits: 3,
        aiCredits: 15, // 3-5 lần/ngày trong 30 ngày
    },
    vip: {
        price: 150000,
        duration: 30,
        pushCredits: 7,
        aiCredits: 999, // Không giới hạn
    },
    "push-single": {
        price: 20000,
        duration: 7,
        pushCredits: 5,
        aiCredits: 0,
    },
};

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const body = await request.json();
        const { planId } = body;

        if (
            !planId ||
            !SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS]
        ) {
            return NextResponse.json(
                { error: "Invalid plan ID" },
                { status: 400 }
            );
        }

        const plan =
            SUBSCRIPTION_PLANS[planId as keyof typeof SUBSCRIPTION_PLANS];

        // Nếu là gói basic (miễn phí), kích hoạt ngay lập tức
        if (planId === "basic") {
            const user = await User.findById(session.user.id);
            if (!user) {
                return NextResponse.json(
                    { error: "User not found" },
                    { status: 404 }
                );
            }

            const endDate = new Date();
            endDate.setDate(endDate.getDate() + plan.duration);

            user.subscription = {
                plan: "basic",
                startDate: new Date(),
                endDate,
                isActive: true,
                pushCredits: plan.pushCredits,
                aiCredits: plan.aiCredits,
            };

            await user.save();

            return NextResponse.json({
                success: true,
                message: "Gói Basic đã được kích hoạt thành công",
                subscription: user.subscription,
            });
        }

        // Tạo VNPay payment URL cho các gói trả phí
        const date = new Date();
        const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
        const pad = (n: number) => n.toString().padStart(2, "0");
        const createDate =
            vnDate.getFullYear().toString() +
            pad(vnDate.getMonth() + 1) +
            pad(vnDate.getDate()) +
            pad(vnDate.getHours()) +
            pad(vnDate.getMinutes()) +
            pad(vnDate.getSeconds());

        const txnRef = `SUBSCRIPTION_${
            session.user.id
        }_${planId}_${Date.now()}`;
        const amount = Math.round(plan.price * 100); // VNPay yêu cầu nhân với 100 và làm tròn

        console.log(
            `Creating payment for plan: ${planId}, original price: ${plan.price}, VNPay amount: ${amount}`
        );

        const vnpParams: any = {
            vnp_Version: "2.1.0",
            vnp_Command: "pay",
            vnp_TmnCode: VNPAY_TMN_CODE,
            vnp_Amount: amount,
            vnp_CurrCode: "VND",
            vnp_BankCode: "",
            vnp_TxnRef: txnRef,
            vnp_OrderInfo: `Thanh toan goi ${planId}`,
            vnp_OrderType: "other",
            vnp_Locale: "vn",
            vnp_ReturnUrl: VNPAY_RETURN_URL,
            vnp_IpAddr: "127.0.0.1",
            vnp_CreateDate: createDate,
        };

        // Remove vnp_BankCode if empty
        if (!vnpParams.vnp_BankCode) {
            delete vnpParams.vnp_BankCode;
        }

        // Sort parameters alphabetically
        const sortedParams = Object.keys(vnpParams)
            .sort()
            .reduce((result: any, key) => {
                result[key] = vnpParams[key];
                return result;
            }, {});

        // Create signData
        const signData = Object.keys(sortedParams)
            .map(
                (key) =>
                    `${key}=${encodeURIComponent(sortedParams[key]).replace(
                        /%20/g,
                        "+"
                    )}`
            )
            .join("&");

        // Create secure hash
        const hmac = crypto.createHmac("sha512", VNPAY_HASH_SECRET);
        const signed = hmac.update(signData, "utf-8").digest("hex");

        // Create query string
        const queryString = Object.keys(sortedParams)
            .map(
                (key) =>
                    `${key}=${encodeURIComponent(sortedParams[key]).replace(
                        /%20/g,
                        "+"
                    )}`
            )
            .join("&");

        // Add signature to parameters
        const vnpUrl = `${VNPAY_URL}?${queryString}&vnp_SecureHash=${signed}`;

        // Lưu thông tin giao dịch tạm thời (có thể lưu vào database hoặc session)
        // Ở đây tôi sẽ lưu vào user document
        const user = await User.findById(session.user.id);
        if (user) {
            user.subscription = {
                plan: planId as "basic" | "pro" | "vip",
                startDate: new Date(),
                endDate: new Date(
                    Date.now() + plan.duration * 24 * 60 * 60 * 1000
                ),
                isActive: false, // Chưa active cho đến khi thanh toán thành công
                pushCredits: plan.pushCredits,
                aiCredits: plan.aiCredits,
            };
            await user.save();
        }

        console.log(`Final VNPay URL: ${vnpUrl}`);
        console.log(
            `Returning response with amount: ${amount} (${amount / 100} VND)`
        );

        return NextResponse.json({
            success: true,
            paymentUrl: vnpUrl,
            planId,
            amount: amount / 100, // Trả về số tiền thực cho frontend
            txnRef,
        });
    } catch (error) {
        console.error("Subscription payment creation error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
