import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import connectDB from "@/lib/db";

export async function GET(request: NextRequest) {
   try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      await connectDB();

      // Get all products by this seller
      const sellerProducts = await Product.find({ seller: session.user.id });
      const productIds = sellerProducts.map((product) => product._id);

      console.log("Seller Orders DEBUG - Seller ID:", session.user.id);
      console.log(
         "Seller Orders DEBUG - Seller products:",
         sellerProducts.map((p) => ({ id: p._id, name: p.name }))
      );
      console.log("Seller Orders DEBUG - Product IDs:", productIds);

      // Find orders that contain products from this seller
      const orders = await Order.find({
         "orderItems.product": { $in: productIds },
      })
         .populate({
            path: "user",
            select: "firstName lastName email",
         })
         .populate({
            path: "orderItems.product",
            select: "name images",
         })
         .sort({ createdAt: -1 });

      // Filter and transform orders to only include seller's products
      const sellerOrders = orders.map((order) => {
         console.log("Seller Orders DEBUG - Processing order:", order._id);
         console.log("Seller Orders DEBUG - All orderItems:", order.orderItems);
         console.log("Seller Orders DEBUG - Seller productIds:", productIds);

         const sellerOrderItems = order.orderItems.filter((item) => {
            // Handle both populated and unpopulated product references
            const itemProductId = item.product._id || item.product;
            const isSellerProduct = productIds.some(
               (productId: any) =>
                  productId.toString() === itemProductId.toString()
            );
            console.log(
               `Seller Orders DEBUG - Item ${item.name}: product=${itemProductId}, isSellerProduct=${isSellerProduct}`
            );
            return isSellerProduct;
         });

         console.log(
            "Seller Orders DEBUG - Filtered sellerOrderItems:",
            sellerOrderItems
         );

         // Calculate totals for seller's products only
         const itemsPrice = sellerOrderItems.reduce((sum, item) => {
            const itemTotal = item.price * item.quantity;
            console.log(
               `Seller Orders DEBUG - Item: ${item.name}, Price: ${item.price}, Quantity: ${item.quantity}, Total: ${itemTotal}`
            );
            return sum + itemTotal;
         }, 0);

         console.log(
            "Seller Orders DEBUG - Calculated itemsPrice:",
            itemsPrice
         );

         const shippingPrice = itemsPrice > 50 ? 0 : 9.99;
         const taxPrice = itemsPrice * 0.08;
         const totalPrice = itemsPrice + shippingPrice + taxPrice;

         const populatedUser = order.user as any;

         return {
            _id: order._id,
            orderItems: sellerOrderItems,
            shippingAddress: order.shippingAddress,
            paymentMethod: order.paymentMethod,
            itemsPrice: Number(itemsPrice),
            shippingPrice: Number(shippingPrice),
            taxPrice: Number(taxPrice),
            totalPrice: Number(totalPrice),
            isPaid: order.isPaid,
            paidAt: order.paidAt,
            isDelivered: order.isDelivered,
            deliveredAt: order.deliveredAt,
            createdAt: order.createdAt,
            paymentResult: order.paymentResult,
            buyer: {
               _id: populatedUser._id,
               name: `${populatedUser.firstName} ${populatedUser.lastName}`,
               email: populatedUser.email,
            },
         };
      });

      return NextResponse.json({
         success: true,
         orders: sellerOrders,
      });
   } catch (error) {
      console.error("Error fetching seller orders:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
      );
   }
}
