import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Order } from "@/models/Order";
import connectDB from "@/lib/db";

export async function GET(request: NextRequest) {
   try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      await connectDB();

      const orders = await Order.find({ user: session.user.id }).sort({
         createdAt: -1,
      });

      // Transform orders to match frontend interface
      const transformedOrders = orders.map((order) => ({
         _id: order._id,
         orderItems: order.orderItems,
         shippingAddress: order.shippingAddress,
         paymentMethod: order.paymentMethod,
         itemsPrice: Number(order.itemsPrice),
         shippingPrice: Number(order.shippingPrice),
         taxPrice: Number(order.taxPrice),
         totalPrice: Number(order.totalPrice),
         isPaid: order.isPaid,
         paidAt: order.paidAt,
         isDelivered: order.isDelivered,
         deliveredAt: order.deliveredAt,
         createdAt: order.createdAt,
         paymentResult: order.paymentResult,
      }));

      return NextResponse.json({ orders: transformedOrders });
   } catch (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
      );
   }
}
