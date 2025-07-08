import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   try {
      await connectDB();

      const { id } = await params;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
         return NextResponse.json(
            { error: "Invalid auction ID" },
            { status: 400 }
         );
      }

      const auction = await Auction.findById(id)
         .populate("createdBy", "name email")
         .populate("participants", "name email")
         .populate("bids.bidder", "name email")
         .populate("winner", "name email")
         .lean();

      if (!auction) {
         return NextResponse.json(
            { error: "Auction not found" },
            { status: 404 }
         );
      }

      return NextResponse.json(auction);
   } catch (error) {
      console.error("Error fetching auction:", error);
      return NextResponse.json(
         { error: "Failed to fetch auction" },
         { status: 500 }
      );
   }
}

export async function PUT(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   try {
      await connectDB();

      const { id } = await params;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
         return NextResponse.json(
            { error: "Invalid auction ID" },
            { status: 400 }
         );
      }

      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const auction = await Auction.findById(id);
      if (!auction) {
         return NextResponse.json(
            { error: "Auction not found" },
            { status: 404 }
         );
      }

      // Only creator can update auction
      if (auction.createdBy.toString() !== session.user.id) {
         return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      const body = await request.json();
      const allowedUpdates = [
         "title",
         "description",
         "images",
         "category",
         "condition",
         "endTime",
      ];

      for (const field of allowedUpdates) {
         if (body[field] !== undefined) {
            auction[field] = body[field];
         }
      }

      if (body.endTime && new Date(body.endTime) <= new Date()) {
         return NextResponse.json(
            { error: "End time must be in the future" },
            { status: 400 }
         );
      }

      await auction.save();

      const updatedAuction = await Auction.findById(id)
         .populate("createdBy", "name email")
         .populate("participants", "name email")
         .lean();

      return NextResponse.json(updatedAuction);
   } catch (error) {
      console.error("Error updating auction:", error);
      return NextResponse.json(
         { error: "Failed to update auction" },
         { status: 500 }
      );
   }
}

export async function DELETE(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   try {
      await connectDB();

      const { id } = await params;

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(id)) {
         return NextResponse.json(
            { error: "Invalid auction ID" },
            { status: 400 }
         );
      }

      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const auction = await Auction.findById(id);
      if (!auction) {
         return NextResponse.json(
            { error: "Auction not found" },
            { status: 404 }
         );
      }

      // Only creator can delete auction
      if (auction.createdBy.toString() !== session.user.id) {
         return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }

      // Only allow deletion if auction hasn't started
      if (auction.status !== "upcoming") {
         return NextResponse.json(
            { error: "Cannot delete active or ended auction" },
            { status: 400 }
         );
      }

      await Auction.findByIdAndDelete(id);

      return NextResponse.json({ message: "Auction deleted successfully" });
   } catch (error) {
      console.error("Error deleting auction:", error);
      return NextResponse.json(
         { error: "Failed to delete auction" },
         { status: 500 }
      );
   }
}
