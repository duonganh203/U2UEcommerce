import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Product } from "@/models/Product";

export async function GET(request: NextRequest) {
   try {
      await connectDB();

      // Get query parameters for pagination and filtering
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");
      const category = searchParams.get("category");
      const brand = searchParams.get("brand");
      const search = searchParams.get("search");
      const sort = searchParams.get("sort") || "createdAt";
      const order = searchParams.get("order") || "desc";

      // Build query object
      const query: any = {};

      if (category) {
         query.category = { $regex: category, $options: "i" };
      }

      if (brand) {
         query.brand = { $regex: brand, $options: "i" };
      }

      if (search) {
         query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
         ];
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

      return NextResponse.json({
         success: true,
         data: products,
         pagination: {
            currentPage: page,
            totalPages,
            totalProducts: total,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
         },
      });
   } catch (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json(
         {
            success: false,
            error: "Failed to fetch products",
         },
         { status: 500 }
      );
   }
}
