import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Auction from "@/models/Auction";

export async function POST(request: NextRequest) {
   try {
      await connectDB();

      const now = new Date();

      // 1. Chuyển approved auctions thành active khi đến startTime
      const approvedToActive = await Auction.updateMany(
         {
            status: "approved",
            startTime: { $lte: now },
            endTime: { $gt: now },
         },
         {
            $set: { status: "active" },
         }
      );

      // 2. Chuyển active auctions thành ended khi quá endTime
      const activeToEnded = await Auction.updateMany(
         {
            status: "active",
            endTime: { $lte: now },
         },
         {
            $set: { status: "ended" },
         }
      );

      // 3. Xác định người thắng cho các phiên đã kết thúc
      const endedAuctions = await Auction.find({
         status: "ended",
         winner: { $exists: false },
      }).populate("bids.bidder", "name email");

      for (const auction of endedAuctions) {
         if (auction.bids.length > 0) {
            // Tìm bid cao nhất
            const highestBid = auction.bids.reduce((prev: any, current: any) =>
               prev.amount > current.amount ? prev : current
            );

            auction.winner = highestBid.bidder._id;
            auction.winnerAmount = highestBid.amount;
            await auction.save();
         }
      }

      return NextResponse.json({
         success: true,
         message: "Auction status processing completed",
         stats: {
            approvedToActive: approvedToActive.modifiedCount,
            activeToEnded: activeToEnded.modifiedCount,
            winnersDetermined: endedAuctions.length,
         },
      });
   } catch (error) {
      console.error("Error processing auctions:", error);
      return NextResponse.json(
         { error: "Failed to process auctions" },
         { status: 500 }
      );
   }
}

// GET endpoint để kiểm tra trạng thái
export async function GET() {
   try {
      await connectDB();

      const now = new Date();

      const stats = {
         pending: await Auction.countDocuments({ status: "pending" }),
         approved: await Auction.countDocuments({ status: "approved" }),
         active: await Auction.countDocuments({ status: "active" }),
         ended: await Auction.countDocuments({ status: "ended" }),
         rejected: await Auction.countDocuments({ status: "rejected" }),
         cancelled: await Auction.countDocuments({ status: "cancelled" }),
         readyToActivate: await Auction.countDocuments({
            status: "approved",
            startTime: { $lte: now },
            endTime: { $gt: now },
         }),
         readyToEnd: await Auction.countDocuments({
            status: "active",
            endTime: { $lte: now },
         }),
      };

      return NextResponse.json(stats);
   } catch (error) {
      console.error("Error getting auction stats:", error);
      return NextResponse.json(
         { error: "Failed to get auction stats" },
         { status: 500 }
      );
   }
}
