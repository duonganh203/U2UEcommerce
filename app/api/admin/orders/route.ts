import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Order } from "@/models/Order";
import { User } from "@/models/User";
import connectDB from "@/lib/db";

export async function GET(request: NextRequest) {
   try {
      const session = await getServerSession(authOptions);

      // Check if user is admin
      if (!session?.user?.id) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      await connectDB();

      // Verify admin role
      const currentUser = await User.findById(session.user.id);
      if (!currentUser || currentUser.role !== "admin") {
         return NextResponse.json(
            { error: "Forbidden - Admin access required" },
            { status: 403 }
         );
      }

      // Parse query parameters for filtering
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "20");
      const status = searchParams.get("status");
      const search = searchParams.get("search");

      // Build filter query
      let filter: any = {};

      // Add status filter
      if (status && status !== "all") {
         if (status === "pending") {
            filter.isPaid = false;
            filter.isDelivered = false;
         } else if (status === "processing") {
            filter.isPaid = true;
            filter.isDelivered = false;
         } else if (status === "completed") {
            filter.isPaid = true;
            filter.isDelivered = true;
         } else if (status === "cancelled") {
            // Add a cancelled field if you want to track cancelled orders
            // For now, we'll skip this status
         }
      }

      // Get orders with user population
      let ordersQuery = Order.find(filter)
         .populate({
            path: "user",
            select: "firstName lastName email",
         })
         .sort({ createdAt: -1 });

      // Apply pagination
      const skip = (page - 1) * limit;
      ordersQuery = ordersQuery.skip(skip).limit(limit);

      const orders = await ordersQuery.exec();
      const totalOrders = await Order.countDocuments(filter);

      // Transform orders to match frontend interface
      const transformedOrders = orders.map((order) => {
         const user = order.user as any;

         // Determine status based on payment and delivery
         let orderStatus = "pending";
         if (order.isPaid && order.isDelivered) {
            orderStatus = "completed";
         } else if (order.isPaid && !order.isDelivered) {
            orderStatus = "processing";
         }

         return {
            id: (order._id as any).toString(),
            customer: user
               ? `${user.firstName} ${user.lastName}`
               : "Unknown Customer",
            email: user?.email || "No email",
            date: new Date(order.createdAt).toLocaleDateString("vi-VN", {
               year: "numeric",
               month: "long",
               day: "numeric",
            }),
            total: `$${order.totalPrice.toFixed(2)}`,
            status: orderStatus,
            items: order.orderItems.length,
            rawDate: order.createdAt,
            isPaid: order.isPaid,
            isDelivered: order.isDelivered,
            paidAt: order.paidAt,
            deliveredAt: order.deliveredAt,
            orderItems: order.orderItems,
            shippingAddress: order.shippingAddress,
            paymentMethod: order.paymentMethod,
            itemsPrice: order.itemsPrice,
            shippingPrice: order.shippingPrice,
            taxPrice: order.taxPrice,
            totalPrice: order.totalPrice,
         };
      });

      // Apply search filter on transformed data if needed
      let filteredOrders = transformedOrders;
      if (search) {
         const searchLower = search.toLowerCase();
         filteredOrders = transformedOrders.filter(
            (order) =>
               order.id.toLowerCase().includes(searchLower) ||
               order.customer.toLowerCase().includes(searchLower) ||
               order.email.toLowerCase().includes(searchLower)
         );
      }

      // Get status counts for statistics
      const statusCounts = await Order.aggregate([
         {
            $group: {
               _id: {
                  isPaid: "$isPaid",
                  isDelivered: "$isDelivered",
               },
               count: { $sum: 1 },
            },
         },
      ]);

      // Transform status counts
      const stats = {
         pending: 0,
         processing: 0,
         completed: 0,
         cancelled: 0,
      };

      statusCounts.forEach((item) => {
         if (!item._id.isPaid && !item._id.isDelivered) {
            stats.pending = item.count;
         } else if (item._id.isPaid && !item._id.isDelivered) {
            stats.processing = item.count;
         } else if (item._id.isPaid && item._id.isDelivered) {
            stats.completed = item.count;
         }
      });

      return NextResponse.json({
         orders: filteredOrders,
         pagination: {
            page,
            limit,
            total: totalOrders,
            pages: Math.ceil(totalOrders / limit),
         },
         stats,
      });
   } catch (error) {
      console.error("Error fetching admin orders:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
      );
   }
}

export async function PATCH(request: NextRequest) {
   try {
      const session = await getServerSession(authOptions);

      // Check if user is admin
      if (!session?.user?.id) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      await connectDB();

      // Verify admin role
      const currentUser = await User.findById(session.user.id);
      if (!currentUser || currentUser.role !== "admin") {
         return NextResponse.json(
            { error: "Forbidden - Admin access required" },
            { status: 403 }
         );
      }

      const { orderId, status } = await request.json();

      if (!orderId || !status) {
         return NextResponse.json(
            { error: "Order ID and status are required" },
            { status: 400 }
         );
      }

      // Find the order
      const order = await Order.findById(orderId);
      if (!order) {
         return NextResponse.json(
            { error: "Order not found" },
            { status: 404 }
         );
      }

      // Update order status based on the status value
      switch (status) {
         case "pending":
            order.isPaid = false;
            order.isDelivered = false;
            order.paidAt = undefined;
            order.deliveredAt = undefined;
            break;
         case "processing":
            order.isPaid = true;
            order.isDelivered = false;
            order.paidAt = order.paidAt || new Date();
            order.deliveredAt = undefined;
            break;
         case "completed":
            order.isPaid = true;
            order.isDelivered = true;
            order.paidAt = order.paidAt || new Date();
            order.deliveredAt = new Date();
            break;
         case "cancelled":
            // For now, we'll just mark as not paid and not delivered
            order.isPaid = false;
            order.isDelivered = false;
            order.paidAt = undefined;
            order.deliveredAt = undefined;
            break;
         default:
            return NextResponse.json(
               { error: "Invalid status" },
               { status: 400 }
            );
      }

      await order.save();

      return NextResponse.json({
         message: "Order status updated successfully",
         order: {
            id: (order._id as any).toString(),
            isPaid: order.isPaid,
            isDelivered: order.isDelivered,
            paidAt: order.paidAt,
            deliveredAt: order.deliveredAt,
         },
      });
   } catch (error) {
      console.error("Error updating order status:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
      );
   }
}
