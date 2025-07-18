// Sử dụng fetch có sẵn trong Node.js

async function testSubscriptionPayment() {
    try {
        console.log("Testing subscription payment API...");

        // Test với gói VIP (150,000 VND)
        const response = await fetch(
            "http://localhost:3000/api/payment/subscription",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Thêm session header nếu cần
                },
                body: JSON.stringify({
                    planId: "vip",
                }),
            }
        );

        const data = await response.json();

        console.log("Response:", data);

        if (data.success) {
            console.log("✅ Payment URL created successfully");
            console.log("Plan ID:", data.planId);
            console.log("Amount:", data.amount, "VND");
            console.log("Payment URL:", data.paymentUrl);

            // Kiểm tra URL có chứa đúng số tiền không
            if (data.paymentUrl.includes("vnp_Amount=15000000")) {
                console.log(
                    "✅ Amount in URL is correct (15,000,000 = 150,000 VND)"
                );
            } else {
                console.log("❌ Amount in URL is incorrect");
                console.log("Expected: vnp_Amount=15000000");
                console.log("URL contains:", data.paymentUrl);
            }
        } else {
            console.log("❌ Failed to create payment:", data.error);
        }
    } catch (error) {
        console.error("Error testing subscription payment:", error);
    }
}

// Chạy test
testSubscriptionPayment();
