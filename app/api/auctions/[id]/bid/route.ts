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

      const { amount } = await request.json();

      if (!amount || amount <= 0) {
         return NextResponse.json(
            { error: "Invalid bid amount" },
            { status: 400 }
         );
      }

      const { id } = await params;
      const auction = await Auction.findById(id);
      if (!auction) {
         return NextResponse.json(
            { error: "Auction not found" },
            { status: 404 }
         );
      }

      // Check if auction is active
      if (auction.status !== "active") {
         return NextResponse.json(
            { error: "Auction is not active" },
            { status: 400 }
         );
      }

      // Check if user is a participant
      if (!auction.participants.includes(session.user.id)) {
         return NextResponse.json(
            { error: "You must join the auction first" },
            { status: 400 }
         );
      }

      // Check if bid is higher than current price
      if (amount <= auction.currentPrice) {
         return NextResponse.json(
            { error: "Bid must be higher than current price" },
            { status: 400 }
         );
      }

      // Check if bid meets minimum increment
      const minBid = auction.currentPrice + auction.minIncrement;
      if (amount < minBid) {
         return NextResponse.json(
            { error: `Bid must be at least ${minBid}` },
            { status: 400 }
         );
      }

      // Add bid
      auction.bids.push({
         bidder: session.user.id,
         amount: amount,
         timestamp: new Date(),
      });

      auction.currentPrice = amount;
      await auction.save();

      const updatedAuction = await Auction.findById(id)
         .populate("createdBy", "name email")
         .populate("participants", "name email")
         .populate("bids.bidder", "name email")
         .lean();

      return NextResponse.json(updatedAuction);
   } catch (error) {
      console.error("Error placing bid:", error);
      return NextResponse.json(
         { error: "Failed to place bid" },
         { status: 500 }
      );
   }
}
