import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
   try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      await connectDB();

      // Tìm tất cả auction đã kết thúc mà user đã thắng
      const wonAuctions = await Auction.find({
         status: "ended",
         winner: session.user.id,
      })
         .populate("winner", "name email")
         .populate("createdBy", "name email")
         .sort({ endTime: -1 })
         .lean();

      return NextResponse.json({
         success: true,
         auctions: wonAuctions,
         count: wonAuctions.length,
      });
   } catch (error) {
      console.error("Error fetching won auctions:", error);
      return NextResponse.json(
         { error: "Failed to fetch won auctions" },
         { status: 500 }
      );
   }
}
