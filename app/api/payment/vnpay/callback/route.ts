import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
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

      // Extract order ID from txnRef (format: ORDER_<orderId>_<timestamp> or AUCTION_<auctionId>_<orderId>_<timestamp>)
      const txnRefParts = txnRef.split("_");
      const isAuctionOrder = txnRefParts[0] === "AUCTION";
      const orderId = isAuctionOrder ? txnRefParts[2] : txnRefParts[1];

      if (responseCode === "00") {
         // Payment successful
         console.log(
            "VNPay Callback DEBUG - Payment successful for orderId:",
            orderId
         );

         const order = await Order.findById(orderId);

         if (!order) {
            console.error("Order not found:", orderId);
            return NextResponse.redirect(
               new URL("/payment/failed?error=order_not_found", request.url)
            );
         }

         console.log("VNPay Callback DEBUG - Order before update:", {
            _id: order._id,
            isPaid: order.isPaid,
            totalPrice: order.totalPrice,
         });

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

         console.log("VNPay Callback DEBUG - Order after update:", {
            _id: order._id,
            isPaid: order.isPaid,
            totalPrice: order.totalPrice,
         });

         // Update product stock (only for regular orders, not auction orders)
         if (!isAuctionOrder) {
            try {
               console.log("VNPay Callback DEBUG - Updating product stock...");

               for (const item of order.orderItems) {
                  const product = await Product.findById(item.product);
                  if (product) {
                     // Check if enough stock is available
                     if (product.countInStock < item.quantity) {
                        console.warn(
                           `VNPay Callback DEBUG - Insufficient stock for product ${product.name}: requested ${item.quantity}, available ${product.countInStock}`
                        );
                        // Continue with the order but log the warning
                     }

                     const oldStock = product.countInStock;
                     product.countInStock = Math.max(
                        0,
                        product.countInStock - item.quantity
                     );

                     console.log(
                        `VNPay Callback DEBUG - Product ${product.name}: ${oldStock} -> ${product.countInStock} (sold ${item.quantity})`
                     );

                     await product.save();
                  } else {
                     console.error(
                        `VNPay Callback DEBUG - Product not found: ${item.product}`
                     );
                  }
               }

               console.log("VNPay Callback DEBUG - Stock update completed");
            } catch (stockError) {
               console.error(
                  "VNPay Callback DEBUG - Error updating stock:",
                  stockError
               );
               // Don't fail the payment if stock update fails
            }
         } else {
            console.log(
               "VNPay Callback DEBUG - Auction order, skipping stock update"
            );
         }

         // Redirect to success page with appropriate flags
         const redirectUrl = isAuctionOrder
            ? `/payment/success?orderId=${orderId}&auctionOrder=true`
            : `/payment/success?orderId=${orderId}&cartCleared=true`;

         return NextResponse.redirect(new URL(redirectUrl, request.url));
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
