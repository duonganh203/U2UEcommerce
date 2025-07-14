import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Order } from "@/models/Order";
import connectDB from "@/lib/db";

const VNPAY_HASH_SECRET = "DLZ5B0HXFL9GQQSE6M0YSVTMGLZPB5WQ"; // Test hash secret

export async function GET(request: NextRequest) {
   try {
      await connectDB();

      const searchParams = request.nextUrl.searchParams;
      const vnpParams = Object.fromEntries(searchParams.entries());

      // Remove vnp_SecureHash from params for verification
      const secureHash = vnpParams["vnp_SecureHash"];
      delete vnpParams["vnp_SecureHash"];

      // Sort parameters alphabetically
      const sortedParams = Object.keys(vnpParams)
         .sort()
         .reduce((result: any, key) => {
            result[key] = vnpParams[key];
            return result;
         }, {});

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

      // Verify signature
      const signData = queryString;
      const hmac = crypto.createHmac("sha512", VNPAY_HASH_SECRET);
      const signed = hmac.update(signData, "utf-8").digest("hex");

      if (signed !== secureHash) {
         console.error("VNPay signature verification failed");
         return NextResponse.redirect(
            new URL("/payment/failed?error=invalid_signature", request.url)
         );
      }

      // Check response code
      const responseCode = vnpParams["vnp_ResponseCode"];
      const txnRef = vnpParams["vnp_TxnRef"];
      const amount = vnpParams["vnp_Amount"];

      // Extract order ID from txnRef (format: ORDER_<orderId>_<timestamp>)
      const orderId = txnRef.split("_")[1];

      if (responseCode === "00") {
         // Payment successful
         const order = await Order.findById(orderId);

         if (!order) {
            console.error("Order not found:", orderId);
            return NextResponse.redirect(
               new URL("/payment/failed?error=order_not_found", request.url)
            );
         }

         // Update order status
         order.isPaid = true;
         order.paidAt = new Date();
         order.paymentResult = {
            id: vnpParams["vnp_TransactionNo"] || "",
            status: "completed",
            update_time: new Date().toISOString(),
            email_address: vnpParams["vnp_OrderInfo"] || "",
         };

         await order.save();

         // Redirect to success page
         return NextResponse.redirect(
            new URL(`/payment/success?orderId=${orderId}`, request.url)
         );
      } else {
         // Payment failed
         console.error(
            "VNPay payment failed with response code:",
            responseCode
         );

         // Update order status if order exists
         if (orderId) {
            const order = await Order.findById(orderId);
            if (order) {
               order.paymentResult = {
                  id: vnpParams["vnp_TransactionNo"] || "",
                  status: "failed",
                  update_time: new Date().toISOString(),
                  email_address: vnpParams["vnp_OrderInfo"] || "",
               };
               await order.save();
            }
         }

         return NextResponse.redirect(
            new URL(
               `/payment/failed?error=payment_failed&code=${responseCode}`,
               request.url
            )
         );
      }
   } catch (error) {
      console.error("VNPay callback error:", error);
      return NextResponse.redirect(
         new URL("/payment/failed?error=server_error", request.url)
      );
   }
}
