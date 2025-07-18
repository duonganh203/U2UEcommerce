// Test tính toán số tiền cho VNPay
const SUBSCRIPTION_PLANS = {
    basic: {
        price: 0,
        duration: 30,
        pushCredits: 0,
        aiCredits: 3,
    },
    pro: {
        price: 50000,
        duration: 30,
        pushCredits: 3,
        aiCredits: 15,
    },
    vip: {
        price: 150000,
        duration: 30,
        pushCredits: 7,
        aiCredits: 999,
    },
    "push-single": {
        price: 20000,
        duration: 7,
        pushCredits: 5,
        aiCredits: 0,
    },
};

function testAmountCalculation() {
    console.log("Testing amount calculation for VNPay...\n");

    Object.entries(SUBSCRIPTION_PLANS).forEach(([planId, plan]) => {
        const originalPrice = plan.price;
        const vnpayAmount = Math.round(plan.price * 100);
        const calculatedPrice = vnpayAmount / 100;

        console.log(`Plan: ${planId}`);
        console.log(`  Original price: ${originalPrice.toLocaleString()} VND`);
        console.log(`  VNPay amount: ${vnpayAmount.toLocaleString()}`);
        console.log(
            `  Calculated back: ${calculatedPrice.toLocaleString()} VND`
        );
        console.log(
            `  Correct: ${originalPrice === calculatedPrice ? "✅" : "❌"}`
        );
        console.log("");
    });

    // Test specific case
    console.log("Testing VIP plan specifically:");
    const vipPlan = SUBSCRIPTION_PLANS.vip;
    const vipAmount = Math.round(vipPlan.price * 100);
    console.log(`VIP price: ${vipPlan.price.toLocaleString()} VND`);
    console.log(`VNPay amount: ${vipAmount.toLocaleString()}`);
    console.log(
        `Should show as: ${(vipAmount / 100).toLocaleString()} VND on VNPay`
    );
    console.log(`URL parameter: vnp_Amount=${vipAmount}`);
}

testAmountCalculation();
