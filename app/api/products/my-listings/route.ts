import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
   try {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
         return NextResponse.json(
            { success: false, error: "Authentication required" },
            { status: 401 }
         );
      }

      await connectDB();

      // Get query parameters for pagination and filtering
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "20");
      const search = searchParams.get("search");
      const status = searchParams.get("status");
      const sort = searchParams.get("sort") || "createdAt";
      const order = searchParams.get("order") || "desc";

      // Build query object - only get products from current user
      const query: any = { seller: session.user.id };

      if (search) {
         query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { category: { $regex: search, $options: "i" } },
         ];
      }

      if (status && status !== "all") {
         query.status = status;
      }

      // Calculate skip value for pagination
      const skip = (page - 1) * limit;

      // Build sort object
      const sortObj: any = {};
      sortObj[sort] = order === "desc" ? -1 : 1;

      // Execute query with pagination
      const products = await Product.find(query)
         .sort(sortObj)
         .skip(skip)
         .limit(limit)
         .select("-reviews") // Exclude reviews array to reduce response size
         .lean();

      // Get total count for pagination
      const total = await Product.countDocuments(query);
      const totalPages = Math.ceil(total / limit);

      // Calculate stats
      const stats = await Product.aggregate([
         { $match: { seller: session.user.id } },
         {
            $group: {
               _id: null,
               totalListings: { $sum: 1 },
               activeListings: {
                  $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] },
               },
               pendingListings: {
                  $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
               },
               totalValue: { $sum: "$price" },
               avgPrice: { $avg: "$price" },
            },
         },
      ]);

      const statsData = stats[0] || {
         totalListings: 0,
         activeListings: 0,
         pendingListings: 0,
         totalValue: 0,
         avgPrice: 0,
      };

      return NextResponse.json({
         success: true,
         data: products,
         stats: statsData,
         pagination: {
            currentPage: page,
            totalPages,
            totalProducts: total,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
         },
      });
   } catch (error) {
      console.error("Error fetching user listings:", error);
      return NextResponse.json(
         {
            success: false,
            error: "Failed to fetch listings",
         },
         { status: 500 }
      );
   }
}

export async function DELETE(request: NextRequest) {
   try {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
         return NextResponse.json(
            { success: false, error: "Authentication required" },
            { status: 401 }
         );
      }

      await connectDB();

      const { searchParams } = new URL(request.url);
      const productId = searchParams.get("id");

      if (!productId) {
         return NextResponse.json(
            { success: false, error: "Product ID is required" },
            { status: 400 }
         );
      }

      // Find and delete product only if it belongs to the current user
      const deletedProduct = await Product.findOneAndDelete({
         _id: productId,
         seller: session.user.id,
      });

      if (!deletedProduct) {
         return NextResponse.json(
            { success: false, error: "Product not found or unauthorized" },
            { status: 404 }
         );
      }

      return NextResponse.json({
         success: true,
         message: "Product deleted successfully",
      });
   } catch (error) {
      console.error("Error deleting product:", error);
      return NextResponse.json(
         { success: false, error: "Failed to delete product" },
         { status: 500 }
      );
   }
}
