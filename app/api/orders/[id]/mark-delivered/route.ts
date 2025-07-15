import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Order } from "@/models/Order";
import connectDB from "@/lib/db";

export async function PATCH(
   request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      await connectDB();

      const orderId = params.id;

      // Find the order and verify it belongs to the current user
      const order = await Order.findOne({
         _id: orderId,
         user: session.user.id,
      });

      if (!order) {
         return NextResponse.json(
            { error: "Order not found or access denied" },
            { status: 404 }
         );
      }

      // Check if order is already paid
      if (!order.isPaid) {
         return NextResponse.json(
            { error: "Cannot mark unpaid order as delivered" },
            { status: 400 }
         );
      }

      // Check if order is already delivered
      if (order.isDelivered) {
         return NextResponse.json(
            { error: "Order is already marked as delivered" },
            { status: 400 }
         );
      }

      // Mark order as delivered
      order.isDelivered = true;
      order.deliveredAt = new Date();
      await order.save();

      return NextResponse.json({
         success: true,
         message: "Order marked as delivered successfully",
         order: {
            _id: order._id,
            isDelivered: order.isDelivered,
            deliveredAt: order.deliveredAt,
         },
      });
   } catch (error) {
      console.error("Error marking order as delivered:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
      );
   }
}
