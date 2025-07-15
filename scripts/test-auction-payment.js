const mongoose = require("mongoose");
const Auction = require("../models/Auction").default;
const User = require("../models/User");
require("dotenv").config();

async function testAuctionPayment() {
   try {
      // Kết nối database
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to MongoDB");

      // Tìm user test
      const testUser = await User.findOne({ email: "test@example.com" });
      if (!testUser) {
         console.log("Creating test user...");
         const newUser = new User({
            email: "test@example.com",
            password: "password123",
            firstName: "Test",
            lastName: "User",
            role: "user",
            address: {
               street: "123 Test Street",
               city: "Ho Chi Minh",
               state: "Ho Chi Minh",
               zipCode: "70000",
               country: "Vietnam",
            },
         });
         await newUser.save();
         console.log("Test user created");
      }

      // Tạo auction test đã kết thúc
      const testAuction = new Auction({
         title: "iPhone 15 Pro Max - Test Auction",
         description: "iPhone 15 Pro Max mới 100%, đóng hộp đầy đủ phụ kiện",
         startingPrice: 25000000,
         currentPrice: 28000000,
         minIncrement: 100000,
         images: ["https://example.com/iphone15.jpg"],
         category: "electronics",
         condition: "new",
         startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 ngày trước
         endTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 giờ trước
         maxParticipants: 5,
         participants: [testUser._id],
         bids: [
            {
               bidder: testUser._id,
               amount: 28000000,
               timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
            },
         ],
         status: "ended",
         winner: testUser._id,
         winnerAmount: 28000000,
         createdBy: testUser._id,
      });

      await testAuction.save();
      console.log("Test auction created with ID:", testAuction._id);

      console.log("\n=== Test Data Created ===");
      console.log("Test User ID:", testUser._id);
      console.log("Test Auction ID:", testAuction._id);
      console.log("Winner Amount:", testAuction.winnerAmount);
      console.log("\nYou can now test the payment system by:");
      console.log("1. Login with test@example.com / password123");
      console.log("2. Go to dashboard to see won auctions");
      console.log("3. Click on the auction to see payment button");
      console.log("4. Test the payment flow");
   } catch (error) {
      console.error("Error:", error);
   } finally {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
   }
}

testAuctionPayment();
