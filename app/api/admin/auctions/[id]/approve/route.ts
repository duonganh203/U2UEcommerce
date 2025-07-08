import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
   request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      await connectDB();

      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Check if user is admin
      if (session.user.role !== "admin") {
         return NextResponse.json(
            { error: "Forbidden - Admin access required" },
            { status: 403 }
         );
      }

      const auction = await Auction.findById(params.id);
      if (!auction) {
         return NextResponse.json(
            { error: "Auction not found" },
            { status: 404 }
         );
      }

      if (auction.status !== "pending") {
         return NextResponse.json(
            { error: "Auction is not pending approval" },
            { status: 400 }
         );
      }

      // Approve the auction
      auction.status = "approved";
      await auction.save();

      const updatedAuction = await Auction.findById(params.id)
         .populate("createdBy", "name email")
         .populate("participants", "name email")
         .lean();

      return NextResponse.json(updatedAuction);
   } catch (error) {
      console.error("Error approving auction:", error);
      return NextResponse.json(
         { error: "Failed to approve auction" },
         { status: 500 }
      );
   }
}
