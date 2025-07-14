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

      const orders = await Order.find({ user: session.user.id })
         .populate("orderItems.product", "name image price")
         .sort({ createdAt: -1 });

      return NextResponse.json({ orders });
   } catch (error) {
      console.error("Error fetching orders:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
      );
   }
}
