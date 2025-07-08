import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Auction from "@/models/Auction";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
   try {
      await connectDB();

      const { searchParams } = new URL(request.url);
      const status = searchParams.get("status");
      const category = searchParams.get("category");
      const search = searchParams.get("search");
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "12");

      const filter: any = {};
      if (status) filter.status = status;
      if (category) filter.category = category;
      if (search) {
         filter.$or = [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
         ];
      }

      const skip = (page - 1) * limit;

      const auctions = await Auction.find(filter)
         .populate("createdBy", "name email")
         .populate("participants", "name email")
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(limit)
         .lean();

      const total = await Auction.countDocuments(filter);

      return NextResponse.json({
         auctions,
         pagination: {
            page,
            limit,
            total,
            pages: Math.ceil(total / limit),
         },
      });
   } catch (error) {
      console.error("Error fetching auctions:", error);
      return NextResponse.json(
         { error: "Failed to fetch auctions" },
         { status: 500 }
      );
   }
}

export async function POST(request: NextRequest) {
   try {
      await connectDB();

      const session = await getServerSession(authOptions);
      if (!session?.user?.email) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const body = await request.json();
      const {
         title,
         description,
         startingPrice,
         minIncrement,
         images,
         category,
         condition,
         startTime,
         endTime,
         maxParticipants,
      } = body;

      // Validation
      if (
         !title ||
         !description ||
         !startingPrice ||
         !images ||
         !category ||
         !condition ||
         !startTime ||
         !endTime
      ) {
         return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
         );
      }

      if (startingPrice < 0) {
         return NextResponse.json(
            { error: "Starting price must be positive" },
            { status: 400 }
         );
      }

      if (new Date(startTime) <= new Date()) {
         return NextResponse.json(
            { error: "Start time must be in the future" },
            { status: 400 }
         );
      }

      if (new Date(endTime) <= new Date(startTime)) {
         return NextResponse.json(
            { error: "End time must be after start time" },
            { status: 400 }
         );
      }

      if (maxParticipants && (maxParticipants < 1 || maxParticipants > 10)) {
         return NextResponse.json(
            { error: "Max participants must be between 1 and 10" },
            { status: 400 }
         );
      }

      const auction = new Auction({
         title,
         description,
         startingPrice,
         currentPrice: startingPrice,
         minIncrement: minIncrement || 1,
         images,
         category,
         condition,
         startTime: new Date(startTime),
         endTime: new Date(endTime),
         maxParticipants: maxParticipants || 10,
         createdBy: session.user.id,
      });

      await auction.save();

      const populatedAuction = await Auction.findById(auction._id)
         .populate("createdBy", "name email")
         .lean();

      return NextResponse.json(populatedAuction, { status: 201 });
   } catch (error) {
      console.error("Error creating auction:", error);
      return NextResponse.json(
         { error: "Failed to create auction" },
         { status: 500 }
      );
   }
}
