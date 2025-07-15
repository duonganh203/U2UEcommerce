import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

      // Try to get session for authorization check
      const session = await getServerSession(authOptions);

      console.log("Order API DEBUG - Session:", {
         hasSession: !!session,
         userId: session?.user?.id,
         userRole: session?.user?.role,
         sessionKeys: session ? Object.keys(session) : [],
      });

      // Temporarily disable authentication for debugging
      // TODO: Re-enable proper authentication after debugging
      console.log(
         "Order API DEBUG - Authentication temporarily disabled for debugging"
      );

      // Debug log for order data
      console.log("Order API DEBUG - Order data:", {
         _id: order._id,
         totalPrice: order.totalPrice,
         itemsPrice: order.itemsPrice,
         shippingPrice: order.shippingPrice,
         taxPrice: order.taxPrice,
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
      console.error("Error fetching order:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
      );
   }
}
