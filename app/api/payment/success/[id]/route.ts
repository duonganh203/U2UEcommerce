import { NextRequest, NextResponse } from "next/server";
import { Order } from "@/models/Order";
import connectDB from "@/lib/db";

export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   try {
      const { id } = await params;
      await connectDB();

      const order = await Order.findById(id).populate("user", "name email");

      if (!order) {
         return NextResponse.json(
            { error: "Order not found" },
            { status: 404 }
         );
      }

      // Only allow access to paid orders for security
      if (!order.isPaid) {
         return NextResponse.json({ error: "Order not paid" }, { status: 403 });
      }

      // Debug log for order data
      console.log("Payment Success API DEBUG - Order data:", {
         _id: order._id,
         totalPrice: order.totalPrice,
         itemsPrice: order.itemsPrice,
         shippingPrice: order.shippingPrice,
         taxPrice: order.taxPrice,
         isPaid: order.isPaid,
      });

      return NextResponse.json({
         success: true,
         order: {
            _id: order._id,
            orderItems: order.orderItems,
            shippingAddress: order.shippingAddress,
            paymentMethod: order.paymentMethod,
            itemsPrice: Number(order.itemsPrice),
            shippingPrice: Number(order.shippingPrice),
            taxPrice: Number(order.taxPrice),
            totalPrice: Number(order.totalPrice), // Ensure it's a number
            isPaid: order.isPaid,
            isDelivered: order.isDelivered,
            paidAt: order.paidAt,
            deliveredAt: order.deliveredAt,
            createdAt: order.createdAt,
            paymentResult: order.paymentResult,
         },
      });
   } catch (error) {
      console.error("Error fetching order for payment success:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
      );
   }
}
