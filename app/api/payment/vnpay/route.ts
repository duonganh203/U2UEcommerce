import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Order } from "@/models/Order";
import connectDB from "@/lib/db";

// VNPay test configuration
const VNPAY_TMN_CODE = "UDPRUCJX"; // Test merchant code
const VNPAY_HASH_SECRET = "DLZ5B0HXFL9GQQSE6M0YSVTMGLZPB5WQ"; // Test hash secret
const VNPAY_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html"; // Test URL
const VNPAY_RETURN_URL = "http://localhost:3000/api/payment/vnpay/callback"; // Callback URL

export async function POST(request: NextRequest) {
   try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      await connectDB();

      const body = await request.json();
      const { items, shippingAddress, totalAmount } = body;

      if (!items || !shippingAddress || !totalAmount) {
         return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
         );
      }

      // Create order in database
      const order = new Order({
         user: session.user.id,
         orderItems: items.map((item: any) => ({
            product: item.id,
            name: item.name,
            quantity: item.quantity,
            image: item.image,
            price: item.price,
         })),
         shippingAddress,
         paymentMethod: "VNPay",
         itemsPrice: totalAmount,
         shippingPrice: totalAmount > 50 ? 0 : 9.99,
         taxPrice: totalAmount * 0.08,
         totalPrice:
            totalAmount + (totalAmount > 50 ? 0 : 9.99) + totalAmount * 0.08,
         isPaid: false,
         isDelivered: false,
      });

      const savedOrder = await order.save();

      // Generate VNPay payment URL
      const date = new Date();
      // Đảm bảo lấy giờ Việt Nam (GMT+7)
      const vnDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
      const pad = (n: number) => n.toString().padStart(2, "0");
      const createDate =
         vnDate.getFullYear().toString() +
         pad(vnDate.getMonth() + 1) +
         pad(vnDate.getDate()) +
         pad(vnDate.getHours()) +
         pad(vnDate.getMinutes()) +
         pad(vnDate.getSeconds());

      const txnRef = `ORDER_${savedOrder._id}_${Date.now()}`;
      const amount = Math.round(savedOrder.totalPrice * 100); // Convert to VND (smallest unit)

      const vnpParams: any = {
         vnp_Version: "2.1.0",
         vnp_Command: "pay",
         vnp_TmnCode: VNPAY_TMN_CODE,
         vnp_Amount: amount,
         vnp_CurrCode: "VND",
         vnp_BankCode: "",
         vnp_TxnRef: txnRef,
         vnp_OrderInfo: `Thanh toan don hang ${savedOrder._id}`,
         vnp_OrderType: "other",
         vnp_Locale: "vn",
         vnp_ReturnUrl: VNPAY_RETURN_URL,
         vnp_IpAddr:
            request.headers.get("x-forwarded-for") ||
            request.headers.get("x-real-ip") ||
            "127.0.0.1",
         vnp_CreateDate: createDate,
      };

      // Remove vnp_BankCode if empty
      if (!vnpParams.vnp_BankCode) {
         delete vnpParams.vnp_BankCode;
      }
      // Force IPv4 for vnp_IpAddr
      vnpParams.vnp_IpAddr = "127.0.0.1";

      // Sort parameters alphabetically
      const sortedParams = Object.keys(vnpParams)
         .sort()
         .reduce((result: any, key) => {
            result[key] = vnpParams[key];
            return result;
         }, {});

      // Create signData (encode + thay %20 thành +)
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

      // Create query string (encode + thay %20 thành +)
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

      // Add debug logs
      console.log("VNPay DEBUG signData:", signData);
      console.log("VNPay DEBUG signed:", signed);
      console.log("VNPay DEBUG queryString:", queryString);
      console.log("VNPay DEBUG vnpUrl:", vnpUrl);

      return NextResponse.json({
         success: true,
         paymentUrl: vnpUrl,
         orderId: savedOrder._id,
         txnRef,
      });
   } catch (error) {
      console.error("VNPay payment creation error:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
      );
   }
}
