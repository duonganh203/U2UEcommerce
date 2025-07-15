import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(
   request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      await connectDB();

      const { id } = await params;

      // Validate if the ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
         return NextResponse.json(
            {
               success: false,
               error: "Định dạng mã sản phẩm không hợp lệ",
            },
            { status: 400 }
         );
      }

      // Find product by ID and populate reviews with user data
      const product = await Product.findById(id)
         .populate({
            path: "reviews.user",
            select: "name email", // Only select name and email from user
         })
         .lean();

      if (!product) {
         return NextResponse.json(
            {
               success: false,
               error: "Không tìm thấy sản phẩm",
            },
            { status: 404 }
         );
      }

      // Calculate average rating if there are reviews
      if (product.reviews && product.reviews.length > 0) {
         const totalRating = product.reviews.reduce(
            (sum: number, review: any) => sum + review.rating,
            0
         );
         product.rating = totalRating / product.reviews.length;
         product.numReviews = product.reviews.length;
      }

      return NextResponse.json({
         success: true,
         data: product,
      });
   } catch (error) {
      console.error("Error fetching product details:", error);
      return NextResponse.json(
         {
            success: false,
            error: "Lấy thông tin sản phẩm thất bại",
         },
         { status: 500 }
      );
   }
}

export async function PUT(
   request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
         return NextResponse.json(
            {
               success: false,
               error: "Bạn cần đăng nhập để thực hiện thao tác này",
            },
            { status: 401 }
         );
      }

      await connectDB();

      const { id } = await params;
      const body = await request.json();

      // Validate if the ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
         return NextResponse.json(
            {
               success: false,
               error: "Định dạng mã sản phẩm không hợp lệ",
            },
            { status: 400 }
         );
      }

      // First find the product to check ownership
      const product = await Product.findById(id);

      if (!product) {
         return NextResponse.json(
            {
               success: false,
               error: "Không tìm thấy sản phẩm",
            },
            { status: 404 }
         );
      }

      // Check if the user is the seller of this product
      if (product.seller.toString() !== session.user.id) {
         return NextResponse.json(
            {
               success: false,
               error: "Bạn chỉ có thể cập nhật sản phẩm của chính mình",
            },
            { status: 403 }
         );
      }

      // Update product
      const updatedProduct = await Product.findByIdAndUpdate(
         id,
         { ...body, updatedAt: new Date() },
         { new: true, runValidators: true }
      ).lean();

      return NextResponse.json({
         success: true,
         data: updatedProduct,
         message: "Cập nhật sản phẩm thành công",
      });
   } catch (error) {
      console.error("Error updating product:", error);
      return NextResponse.json(
         {
            success: false,
            error: "Cập nhật sản phẩm thất bại",
         },
         { status: 500 }
      );
   }
}

export async function DELETE(
   request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
         return NextResponse.json(
            {
               success: false,
               error: "Bạn cần đăng nhập để thực hiện thao tác này",
            },
            { status: 401 }
         );
      }

      await connectDB();

      const { id } = await params;

      // Validate if the ID is a valid MongoDB ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
         return NextResponse.json(
            {
               success: false,
               error: "Định dạng mã sản phẩm không hợp lệ",
            },
            { status: 400 }
         );
      }

      // First find the product to check ownership
      const product = await Product.findById(id);

      if (!product) {
         return NextResponse.json(
            {
               success: false,
               error: "Không tìm thấy sản phẩm",
            },
            { status: 404 }
         );
      }

      // Check if the user is the seller of this product
      if (product.seller.toString() !== session.user.id) {
         return NextResponse.json(
            {
               success: false,
               error: "Bạn chỉ có thể xóa sản phẩm của chính mình",
            },
            { status: 403 }
         );
      }

      // Delete product
      const deletedProduct = await Product.findByIdAndDelete(id);

      return NextResponse.json({
         success: true,
         message: "Xóa sản phẩm thành công",
      });
   } catch (error) {
      console.error("Error deleting product:", error);
      return NextResponse.json(
         {
            success: false,
            error: "Xóa sản phẩm thất bại",
         },
         { status: 500 }
      );
   }
}
