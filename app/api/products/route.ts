import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
      const order = searchParams.get("order") || "desc"; // Build query object
      const query: any = {};

      // Only show approved products
      query.status = "approved";

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

export async function POST(request: NextRequest) {
   try {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
         return NextResponse.json(
            { success: false, error: "Authentication required" },
            { status: 401 }
         );
      }

      await connectDB();

      const body = await request.json();
      const {
         name,
         description,
         price,
         category,
         brand,
         images,
         countInStock,
         condition,
         tags,
         shipping,
         location,
         discountPercentage,
      } = body;

      // Validation
      if (
         !name ||
         !description ||
         !price ||
         !category ||
         !images ||
         images.length === 0
      ) {
         return NextResponse.json(
            { success: false, error: "Missing required fields" },
            { status: 400 }
         );
      }

      // Create new product with pending status
      const newProduct = new Product({
         name,
         description,
         price: parseFloat(price),
         category,
         brand: brand || "Unknown",
         images,
         countInStock: parseInt(countInStock) || 1,
         condition,
         tags: tags ? tags.split(",").map((tag: string) => tag.trim()) : [],
         shipping,
         location,
         seller: session.user.id,
         status: "pending", // Set status to pending when listing item
         isActive: true,
         rating: 0,
         numReviews: 0,
         reviews: [],
         discountPercentage,
      });

      const savedProduct = await newProduct.save();

      return NextResponse.json({
         success: true,
         data: savedProduct,
         message:
            "Product listed successfully! It will be reviewed before going live.",
      });
   } catch (error) {
      console.error("Error creating product:", error);
      return NextResponse.json(
         { success: false, error: "Failed to create product" },
         { status: 500 }
      );
   }
}
