import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import crypto from "crypto";

// VNPay test configuration
const VNPAY_TMN_CODE = "UDPRUCJX"; // Test merchant code
const VNPAY_HASH_SECRET = "DLZ5B0HXFL9GQQSE6M0YSVTMGLZPB5WQ"; // Test hash secret
const VNPAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"; // Test URL
const VNPAY_RETURN_URL = "http://localhost:3000/api/payment/vnpay/callback"; // Callback URL

export async function POST(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      await connectDB();

      const { id } = await params;

      // Tìm auction và kiểm tra người thắng
      const auction = await Auction.findById(id)
         .populate("winner", "name email")
         .populate("createdBy", "name email");

      if (!auction) {
         return NextResponse.json(
            { error: "Auction not found" },
            { status: 404 }
         );
      }

      // Kiểm tra xem auction đã kết thúc chưa
      if (auction.status !== "ended") {
         return NextResponse.json(
            { error: "Auction has not ended yet" },
            { status: 400 }
         );
      }

      // Kiểm tra xem có người thắng không
      if (!auction.winner || !auction.winnerAmount) {
         return NextResponse.json(
            { error: "No winner determined for this auction" },
            { status: 400 }
         );
      }

      // Kiểm tra xem người đăng nhập có phải là người thắng không
      if (auction.winner._id.toString() !== session.user.id) {
         return NextResponse.json(
            { error: "Only the auction winner can create payment order" },
            { status: 403 }
         );
      }

      // Kiểm tra xem đã có order cho auction này chưa
      const existingOrder = await Order.findOne({
         user: session.user.id,
         "orderItems.name": auction.title,
         "orderItems.price": auction.winnerAmount,
      });

      if (existingOrder) {
         return NextResponse.json(
            { error: "Payment order already exists for this auction" },
            { status: 400 }
         );
      }

      // Lấy thông tin địa chỉ của người thắng
      const winner = await User.findById(session.user.id);
      if (!winner) {
         return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Tạo địa chỉ giao hàng mặc định nếu chưa có
      const shippingAddress = {
         street: winner.address?.street || "Chưa cập nhật",
         city: winner.address?.city || "Chưa cập nhật",
         state: winner.address?.state || "Chưa cập nhật",
         zipCode: winner.address?.zipCode || "000000",
         country: winner.address?.country || "Việt Nam",
      };

      // Tính toán giá
      const itemsPrice = auction.winnerAmount;
      const shippingPrice = itemsPrice > 500000 ? 0 : 50000; // Miễn phí ship cho đơn hàng > 500k
      const taxPrice = itemsPrice * 0.08; // Thuế 8%
      const totalPrice = itemsPrice + shippingPrice + taxPrice;

      // Tạo order
      const order = new Order({
         user: session.user.id,
         orderItems: [
            {
               product: null, // Không có product ID vì đây là auction
               name: auction.title,
               quantity: 1,
               image: auction.images[0] || "/placeholder-image.jpg",
               price: auction.winnerAmount,
            },
         ],
         shippingAddress,
         paymentMethod: "VNPay",
         itemsPrice: itemsPrice,
         shippingPrice: shippingPrice,
         taxPrice: taxPrice,
         totalPrice: totalPrice,
         isPaid: false,
         isDelivered: false,
      });

      const savedOrder = await order.save();

      // Tạo URL thanh toán VNPay
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

      const txnRef = `AUCTION_${auction._id}_${savedOrder._id}_${Date.now()}`;
      const amount = Math.round(savedOrder.totalPrice * 100); // Convert to VND (smallest unit)

      const vnpParams: any = {
         vnp_Version: "2.1.0",
         vnp_Command: "pay",
         vnp_TmnCode: VNPAY_TMN_CODE,
         vnp_Amount: amount,
         vnp_CurrCode: "VND",
         vnp_BankCode: "",
         vnp_TxnRef: txnRef,
         vnp_OrderInfo: `Thanh toan dau gia ${auction.title} - ${savedOrder._id}`,
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

      return NextResponse.json({
         success: true,
         paymentUrl: vnpUrl,
         orderId: savedOrder._id,
         txnRef,
         auctionId: auction._id,
         auctionTitle: auction.title,
         winnerAmount: auction.winnerAmount,
         totalPrice: savedOrder.totalPrice,
      });
   } catch (error) {
      console.error("Error creating auction payment order:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
      );
   }
}

// GET endpoint để lấy thông tin order thanh toán cho auction
export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      await connectDB();

      const { id } = await params;

      // Tìm auction
      const auction = await Auction.findById(id)
         .populate("winner", "name email")
         .populate("createdBy", "name email");

      if (!auction) {
         return NextResponse.json(
            { error: "Auction not found" },
            { status: 404 }
         );
      }

      // Kiểm tra xem người đăng nhập có phải là người thắng không
      if (
         !auction.winner ||
         auction.winner._id.toString() !== session.user.id
      ) {
         return NextResponse.json(
            { error: "You are not the winner of this auction" },
            { status: 403 }
         );
      }

      // Tìm order đã tồn tại cho auction này
      const existingOrder = await Order.findOne({
         user: session.user.id,
         "orderItems.name": auction.title,
         "orderItems.price": auction.winnerAmount,
      });

      return NextResponse.json({
         auction: {
            _id: auction._id,
            title: auction.title,
            winnerAmount: auction.winnerAmount,
            status: auction.status,
            endTime: auction.endTime,
         },
         existingOrder: existingOrder
            ? {
                 _id: existingOrder._id,
                 totalPrice: existingOrder.totalPrice,
                 isPaid: existingOrder.isPaid,
                 isDelivered: existingOrder.isDelivered,
                 createdAt: existingOrder.createdAt,
              }
            : null,
      });
   } catch (error) {
      console.error("Error fetching auction payment info:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
      );
   }
}
