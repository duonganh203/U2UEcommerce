import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
   try {
      const session = await getServerSession(authOptions);

      // Check if user is authenticated and is admin
      if (!session?.user?.id) {
         return NextResponse.json(
            { success: false, error:  "Yêu cầu đăng nhập" },
            { status: 401 }
         );
      }

      await connectDB();

      // Check if user is admin
      const user = await User.findById(session.user.id);
      if (!user || user.role !== "admin") {
         return NextResponse.json(
            { success: false, error:  "Yêu cầu quyền quản trị" },
            { status: 403 }
         );
      }

      // Get query parameters for filtering
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "50");
      const status = searchParams.get("status");
      const category = searchParams.get("category");
      const search = searchParams.get("search");
      const sort = searchParams.get("sort") || "createdAt";
      const order = searchParams.get("order") || "desc";

      // Build query object
      const query: any = {};

      if (status && status !== "all") {
         query.status = status;
      }

      if (category && category !== "all") {
         query.category = { $regex: category, $options: "i" };
      }

      if (search) {
         query.$or = [
            { name: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { brand: { $regex: search, $options: "i" } },
         ];
      }

      // Calculate skip value for pagination
      const skip = (page - 1) * limit;

      // Build sort object
      const sortObj: any = {};
      sortObj[sort] = order === "desc" ? -1 : 1;

      // Execute query with pagination and populate seller info
      const products = await Product.find(query)
         .populate("seller", "name email")
         .sort(sortObj)
         .skip(skip)
         .limit(limit)
         .select("-reviews") // Exclude reviews array to reduce response size
         .lean();

      // Get total count for pagination
      const total = await Product.countDocuments(query);
      const totalPages = Math.ceil(total / limit);

      // Get status counts
      const statusCounts = await Promise.all([
         Product.countDocuments({ status: "pending" }),
         Product.countDocuments({ status: "approved" }),
         Product.countDocuments({ status: "rejected" }),
      ]);

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
         statusCounts: {
            pending: statusCounts[0],
            approved: statusCounts[1],
            rejected: statusCounts[2],
         },
      });
   } catch (error) {
      console.error("Error fetching admin products:", error);
      return NextResponse.json(
         {
            success: false,
            error:"Lấy danh sách sản phẩm thất bại",
         },
         { status: 500 }
      );
   }
}

export async function PATCH(request: NextRequest) {
   try {
      const session = await getServerSession(authOptions);

      // Check if user is authenticated and is admin
      if (!session?.user?.id) {
         return NextResponse.json(
            { success: false, error: "Yêu cầu đăng nhập" },
            { status: 401 }
         );
      }

      await connectDB();

      // Check if user is admin
      const user = await User.findById(session.user.id);
      if (!user || user.role !== "admin") {
         return NextResponse.json(
            { success: false, error:"Yêu cầu quyền quản trị"  },
            { status: 403 }
         );
      }

      const body = await request.json();
      const { productId, status, rejectionReason } = body;

      if (!productId || !status) {
         return NextResponse.json(
            { success: false, error: "Cần cung cấp mã sản phẩm và trạng thái" },
            { status: 400 }
         );
      }

      if (!["approved", "rejected", "pending"].includes(status)) {
         return NextResponse.json(
            { success: false, error: "Trạng thái không hợp lệ"  },
            { status: 400 }
         );
      }

      // Update product status
      const updateData: any = { status };
      if (status === "rejected" && rejectionReason) {
         updateData.rejectionReason = rejectionReason;
      }

      const updatedProduct = await Product.findByIdAndUpdate(
         productId,
         updateData,
         { new: true }
      ).populate("seller", "name email");

      if (!updatedProduct) {
         return NextResponse.json(
            { success: false, error: "Không tìm thấy sản phẩm" },
            { status: 404 }
         );
      }

      return NextResponse.json({
         success: true,
         data: updatedProduct,
         message: status === "approved"
         ? "Duyệt sản phẩm thành công"
         : status === "rejected"
         ? "Từ chối sản phẩm thành công"
         : "Cập nhật trạng thái sản phẩm thành công",
      });
   } catch (error) {
      console.error("Error updating product status:", error);
      return NextResponse.json(
         {
            success: false,
            error: "Cập nhật trạng thái sản phẩm thất bại",
         },
         { status: 500 }
      );
   }
}
