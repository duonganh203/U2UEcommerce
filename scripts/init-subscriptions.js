const mongoose = require("mongoose");
require("dotenv").config();

// Kết nối database
mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/u2u-ecommerce"
);

// Schema cho User (tạm thời)
const userSchema = new mongoose.Schema({
    email: String,
    firstName: String,
    lastName: String,
    subscription: {
        plan: {
            type: String,
            enum: ["basic", "pro", "vip"],
            default: "basic",
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: Date,
        isActive: {
            type: Boolean,
            default: true,
        },
        pushCredits: {
            type: Number,
            default: 0,
        },
        aiCredits: {
            type: Number,
            default: 3,
        },
    },
});

const User = mongoose.model("User", userSchema);

async function initSubscriptions() {
    try {
        console.log("Bắt đầu khởi tạo gói dịch vụ cho các user...");

        // Tìm tất cả user chưa có subscription
        const users = await User.find({
            $or: [{ subscription: { $exists: false } }, { subscription: null }],
        });

        console.log(`Tìm thấy ${users.length} user cần khởi tạo gói...`);

        let updatedCount = 0;

        for (const user of users) {
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + 30); // 30 ngày

            user.subscription = {
                plan: "basic",
                startDate: new Date(),
                endDate,
                isActive: true,
                pushCredits: 0,
                aiCredits: 3,
            };

            await user.save();
            updatedCount++;
            console.log(`Đã cập nhật gói cho user: ${user.email}`);
        }

        console.log(`Hoàn thành! Đã cập nhật ${updatedCount} user.`);
    } catch (error) {
        console.error("Lỗi khi khởi tạo gói dịch vụ:", error);
    } finally {
        mongoose.connection.close();
    }
}

// Chạy script
initSubscriptions();
