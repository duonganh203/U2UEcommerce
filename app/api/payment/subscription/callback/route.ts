import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { User } from "@/models/User";
import connectDB from "@/lib/db";

const VNPAY_HASH_SECRET = "DLZ5B0HXFL9GQQSE6M0YSVTMGLZPB5WQ";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const searchParams = request.nextUrl.searchParams;
        const vnpParams = Object.fromEntries(searchParams.entries());

        // Verify signature
        const secureHash = vnpParams.vnp_SecureHash;
        delete vnpParams.vnp_SecureHash;
        delete vnpParams.vnp_SecureHashType;

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

        // Verify signature
        if (secureHash !== signed) {
            console.error("VNPay signature verification failed");
            return NextResponse.redirect(
                `${
                    process.env.NEXTAUTH_URL || "http://localhost:3000"
                }/pricing?error=invalid_signature`
            );
        }

        const responseCode = vnpParams.vnp_ResponseCode;
        const txnRef = vnpParams.vnp_TxnRef;
        const amount = parseInt(vnpParams.vnp_Amount) / 100; // Chia cho 100 để lấy số tiền thực

        console.log(
            `VNPay callback - Response code: ${responseCode}, Amount received: ${vnpParams.vnp_Amount}, Calculated amount: ${amount}`
        );

        // Parse txnRef to get user ID and plan ID
        const txnRefParts = txnRef.split("_");
        if (txnRefParts.length < 4) {
            console.error("Invalid txnRef format:", txnRef);
            return NextResponse.redirect(
                `${
                    process.env.NEXTAUTH_URL || "http://localhost:3000"
                }/pricing?error=invalid_transaction`
            );
        }

        const userId = txnRefParts[1];
        const planId = txnRefParts[2];

        if (responseCode === "00") {
            // Payment successful
            const user = await User.findById(userId);
            if (!user) {
                console.error("User not found:", userId);
                return NextResponse.redirect(
                    `${
                        process.env.NEXTAUTH_URL || "http://localhost:3000"
                    }/pricing?error=user_not_found`
                );
            }

            // Kích hoạt gói dịch vụ
            if (user.subscription) {
                user.subscription.isActive = true;
            }

            await user.save();

            console.log(
                `Subscription activated for user ${userId}, plan: ${planId}`
            );

            return NextResponse.redirect(
                `${
                    process.env.NEXTAUTH_URL || "http://localhost:3000"
                }/pricing?success=true&plan=${planId}`
            );
        } else {
            // Payment failed
            console.error("Payment failed with response code:", responseCode);
            return NextResponse.redirect(
                `${
                    process.env.NEXTAUTH_URL || "http://localhost:3000"
                }/pricing?error=payment_failed&code=${responseCode}`
            );
        }
    } catch (error) {
        console.error("Subscription callback error:", error);
        return NextResponse.redirect(
            `${
                process.env.NEXTAUTH_URL || "http://localhost:3000"
            }/pricing?error=server_error`
        );
    }
}
