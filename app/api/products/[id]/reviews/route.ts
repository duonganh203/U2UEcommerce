import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Product } from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

// Add or update a review
export async function POST(
   request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
         return NextResponse.json(
            { error: "Authentication required" },
            { status: 401 }
         );
      }

      await connectDB();

      const { rating, comment } = await request.json();

      // Validate rating
      if (!rating || rating < 1 || rating > 5) {
         return NextResponse.json(
            { error: "Rating must be between 1 and 5" },
            { status: 400 }
         );
      }

      // Validate comment
      if (!comment || comment.trim().length === 0) {
         return NextResponse.json(
            { error: "Comment is required" },
            { status: 400 }
         );
      }

      const product = await Product.findById(params.id);

      if (!product) {
         return NextResponse.json(
            { error: "Product not found" },
            { status: 404 }
         );
      }

      // Check if user is trying to review their own product
      if (product.seller.toString() === session.user.id) {
         return NextResponse.json(
            { error: "You cannot review your own product" },
            { status: 400 }
         );
      } // Add the review using the model method
      await product.addReview(
         new mongoose.Types.ObjectId(session.user.id),
         rating,
         comment.trim()
      );

      return NextResponse.json({
         message: "Review added successfully",
         rating: product.rating,
         numReviews: product.numReviews,
      });
   } catch (error) {
      console.error("Error adding review:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
      );
   }
}

// Delete a review
export async function DELETE(
   request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
         return NextResponse.json(
            { error: "Authentication required" },
            { status: 401 }
         );
      }

      await connectDB();

      const product = await Product.findById(params.id);

      if (!product) {
         return NextResponse.json(
            { error: "Product not found" },
            { status: 404 }
         );
      }

      // Check if user has a review to delete
      const hasReview = product.reviews.some(
         (review) => review.user.toString() === session.user.id
      );

      if (!hasReview) {
         return NextResponse.json(
            { error: "No review found to delete" },
            { status: 404 }
         );
      } // Remove the review using the model method
      await product.removeReview(new mongoose.Types.ObjectId(session.user.id));

      return NextResponse.json({
         message: "Review deleted successfully",
         rating: product.rating,
         numReviews: product.numReviews,
      });
   } catch (error) {
      console.error("Error deleting review:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
      );
   }
}

// Get reviews for a product
export async function GET(
   request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      await connectDB();

      const product = await Product.findById(params.id)
         .populate("reviews.user", "name email")
         .select("reviews rating numReviews");

      if (!product) {
         return NextResponse.json(
            { error: "Product not found" },
            { status: 404 }
         );
      }

      return NextResponse.json({
         reviews: product.reviews,
         rating: product.rating,
         numReviews: product.numReviews,
      });
   } catch (error) {
      console.error("Error fetching reviews:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
      );
   }
}
