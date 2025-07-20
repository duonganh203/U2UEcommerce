import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
   request: NextRequest,
   { params }: { params: Promise<{ id: string }> }
) {
   try {
      await connectDB();

      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { id } = await params;
      const auction = await Auction.findById(id);
      if (!auction) {
         return NextResponse.json(
            { error: "Auction not found" },
            { status: 404 }
         );
      }

      // Check if auction is full
      if (auction.participants.length >= auction.maxParticipants) {
         return NextResponse.json(
            { error: "Auction is full" },
            { status: 400 }
         );
      }

      // Check if user is already a participant
      if (auction.participants.includes(session.user.id)) {
         return NextResponse.json(
            { error: "Already joined this auction" },
            { status: 400 }
         );
      }

      // Add user to participants
      auction.participants.push(session.user.id);
      await auction.save();

      const updatedAuction = await Auction.findById(id)
         .populate("createdBy", "name email")
         .populate("participants", "name email")
         .lean();

      return NextResponse.json(updatedAuction);
   } catch (error) {
      console.error("Error joining auction:", error);
      return NextResponse.json(
         { error: "Failed to join auction" },
         { status: 500 }
      );
   }
}
