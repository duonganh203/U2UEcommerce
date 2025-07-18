// Debug script để kiểm tra API subscription
const crypto = require("crypto");

// Mô phỏng logic tạo VNPay URL
const VNPAY_TMN_CODE = "UDPRUCJX";
const VNPAY_HASH_SECRET = "DLZ5B0HXFL9GQQSE6M0YSVTMGLZPB5WQ";
const VNPAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";

const SUBSCRIPTION_PLANS = {
    vip: {
        price: 150000,
        duration: 30,
        pushCredits: 7,
        aiCredits: 999,
    },
};

function createVNPayURL(planId, userId) {
    const plan = SUBSCRIPTION_PLANS[planId];
    if (!plan) {
        throw new Error("Invalid plan");
    }

    const date = new Date();
    const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    const pad = (n) => n.toString().padStart(2, "0");
    const createDate =
        vnDate.getFullYear().toString() +
        pad(vnDate.getMonth() + 1) +
        pad(vnDate.getDate()) +
        pad(vnDate.getHours()) +
        pad(vnDate.getMinutes()) +
        pad(vnDate.getSeconds());

    const txnRef = `SUBSCRIPTION_${userId}_${planId}_${Date.now()}`;
    const amount = Math.round(plan.price * 100);

    console.log("=== DEBUG INFO ===");
    console.log("Plan ID:", planId);
    console.log("Original price:", plan.price.toLocaleString(), "VND");
    console.log("VNPay amount:", amount.toLocaleString());
    console.log("Amount in VND:", (amount / 100).toLocaleString(), "VND");

    const vnpParams = {
        vnp_Version: "2.1.0",
        vnp_Command: "pay",
        vnp_TmnCode: VNPAY_TMN_CODE,
        vnp_Amount: amount,
        vnp_CurrCode: "VND",
        vnp_TxnRef: txnRef,
        vnp_OrderInfo: `Thanh toan goi ${planId}`,
        vnp_OrderType: "other",
        vnp_Locale: "vn",
        vnp_ReturnUrl:
            "http://localhost:3000/api/payment/subscription/callback",
        vnp_IpAddr: "127.0.0.1",
        vnp_CreateDate: createDate,
    };

    // Sort parameters alphabetically
    const sortedParams = Object.keys(vnpParams)
        .sort()
        .reduce((result, key) => {
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

    const vnpUrl = `${VNPAY_URL}?${queryString}&vnp_SecureHash=${signed}`;

    console.log("\n=== VNPay URL Parameters ===");
    console.log("vnp_Amount:", amount);
    console.log("vnp_OrderInfo:", vnpParams.vnp_OrderInfo);
    console.log("vnp_TxnRef:", vnpParams.vnp_TxnRef);

    console.log("\n=== Full URL ===");
    console.log(vnpUrl);

    return vnpUrl;
}

// Test với gói VIP
console.log("Testing VIP plan payment URL creation...\n");
const url = createVNPayURL("vip", "test-user-id");
console.log("\n✅ URL created successfully!");
