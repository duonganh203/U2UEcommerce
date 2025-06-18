import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Order } from "@/models/Order";

// GET /api/admin/users - Get all users with filtering and search
export async function GET(request: NextRequest) {
   try {
      const session = await getServerSession(authOptions);

      if (!session || !session.user) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Check if user is admin
      await connectDB();
      const currentUser = await User.findOne({ email: session.user.email });
      if (!currentUser || currentUser.role !== "admin") {
         return NextResponse.json(
            { error: "Admin access required" },
            { status: 403 }
         );
      }

      const { searchParams } = new URL(request.url);
      const search = searchParams.get("search") || "";
      const role = searchParams.get("role") || "all";
      const status = searchParams.get("status") || "all";
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");

      // Build query filters
      const query: any = {};

      if (search) {
         query.$or = [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
         ];
      }

      if (role !== "all") {
         query.role = role;
      }

      // For now, we'll consider all users as "active" unless they're explicitly marked as inactive
      // You might want to add an isActive field to the User model
      if (status !== "all") {
         // This is a placeholder - you may want to add an isActive field to your User model
         query.isActive = status === "active";
      }

      const skip = (page - 1) * limit;

      // Get users with pagination
      const users = await User.find(query)
         .select("-password")
         .sort({ createdAt: -1 })
         .skip(skip)
         .limit(limit);

      // Get order counts for each user
      const usersWithOrderCounts = await Promise.all(
         users.map(async (user) => {
            const orderCount = await Order.countDocuments({ user: user._id });
            return {
               id: user._id.toString(),
               name: `${user.firstName} ${user.lastName}`,
               email: user.email,
               role: user.role,
               status: user.isActive !== false ? "active" : "inactive", // Default to active if not explicitly set
               joined: user.createdAt.toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
               }),
               orders: orderCount,
               firstName: user.firstName,
               lastName: user.lastName,
               phoneNumber: user.phoneNumber,
               avatar: user.avatar,
               address: user.address,
            };
         })
      );

      const totalUsers = await User.countDocuments(query);

      return NextResponse.json({
         users: usersWithOrderCounts,
         pagination: {
            page,
            limit,
            total: totalUsers,
            pages: Math.ceil(totalUsers / limit),
         },
      });
   } catch (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
      );
   }
}

// POST /api/admin/users - Create new user
export async function POST(request: NextRequest) {
   try {
      const session = await getServerSession(authOptions);

      if (!session || !session.user) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // Check if user is admin
      await connectDB();
      const currentUser = await User.findOne({ email: session.user.email });
      if (!currentUser || currentUser.role !== "admin") {
         return NextResponse.json(
            { error: "Admin access required" },
            { status: 403 }
         );
      }

      const body = await request.json();
      const { email, password, firstName, lastName, role, phoneNumber } = body;

      // Validate required fields
      if (!email || !password || !firstName || !lastName) {
         return NextResponse.json(
            {
               error: "Email, password, first name, and last name are required",
            },
            { status: 400 }
         );
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
         return NextResponse.json(
            { error: "User with this email already exists" },
            { status: 400 }
         );
      }

      // Create new user
      const newUser = new User({
         email,
         password,
         firstName,
         lastName,
         role: role || "user",
         phoneNumber,
      });

      await newUser.save();

      // Return user without password
      const userResponse = {
         id: newUser._id.toString(),
         name: `${newUser.firstName} ${newUser.lastName}`,
         email: newUser.email,
         role: newUser.role,
         status: "active",
         joined: newUser.createdAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
         }),
         orders: 0,
         firstName: newUser.firstName,
         lastName: newUser.lastName,
         phoneNumber: newUser.phoneNumber,
      };

      return NextResponse.json({ user: userResponse }, { status: 201 });
   } catch (error) {
      console.error("Error creating user:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
      );
   }
}
