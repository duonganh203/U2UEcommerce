import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { User } from "@/models/User";
import { Order } from "@/models/Order";

// GET /api/admin/users/[id] - Get specific user
export async function GET(
   request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      const session = await getServerSession(authOptions);

      if (!session || !session.user) {
         return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
      }

      // Check if user is admin
      await connectDB();
      const currentUser = await User.findOne({ email: session.user.email });
      if (!currentUser || currentUser.role !== "admin") {
         return NextResponse.json(
            { error: "Bạn cần quyền quản trị để thực hiện thao tác này" },
            { status: 403 }
         );
      }

      const user = await User.findById(params.id).select("-password");
      if (!user) {
         return NextResponse.json(
            { error: "Không tìm thấy người dùng" },
            { status: 404 }
         );
      }

      // Get order count for this user
      const orderCount = await Order.countDocuments({ user: user._id });

      const userResponse = {
         id: user._id.toString(),
         name: `${user.firstName} ${user.lastName}`,
         email: user.email,
         role: user.role,
         status: user.isActive !== false ? "active" : "inactive",
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

      return NextResponse.json({ user: userResponse });
   } catch (error) {
      console.error("Error fetching user:", error);
      return NextResponse.json(
         { error: "Lỗi máy chủ nội bộ" },
         { status: 500 }
      );
   }
}

// PUT /api/admin/users/[id] - Update user
export async function PUT(
   request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      const session = await getServerSession(authOptions);

      if (!session || !session.user) {
         return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
      }

      // Check if user is admin
      await connectDB();
      const currentUser = await User.findOne({ email: session.user.email });
      if (!currentUser || currentUser.role !== "admin") {
         return NextResponse.json(
            { error: "Bạn cần quyền quản trị để thực hiện thao tác này" },
            { status: 403 }
         );
      }

      const body = await request.json();
      const { email, firstName, lastName, role, phoneNumber, status } = body;

      // Find the user to update
      const user = await User.findById(params.id);
      if (!user) {
         return NextResponse.json(
            { error: "Không tìm thấy người dùng" },
            { status: 404 }
         );
      }

      // Check if email is being changed and if it's already taken
      if (email && email !== user.email) {
         const existingUser = await User.findOne({ email });
         if (existingUser) {
            return NextResponse.json(
               { error: "Email này đã được đăng ký" },
               { status: 400 }
            );
         }
      }

      // Update user fields
      if (email) user.email = email;
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (role) user.role = role;
      if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
      if (status !== undefined) {
         // Add isActive field to user model if it doesn't exist
         (user as any).isActive = status === "active";
      }

      await user.save();

      // Get order count for this user
      const orderCount = await Order.countDocuments({ user: user._id });

      const userResponse = {
         id: user._id.toString(),
         name: `${user.firstName} ${user.lastName}`,
         email: user.email,
         role: user.role,
         status: (user as any).isActive !== false ? "active" : "inactive",
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

      return NextResponse.json({ user: userResponse });
   } catch (error) {
      console.error("Error updating user:", error);
      return NextResponse.json(
         { error: "Lỗi máy chủ nội bộ" },
         { status: 500 }
      );
   }
}

// DELETE /api/admin/users/[id] - Delete user (soft delete)
export async function DELETE(
   request: NextRequest,
   { params }: { params: { id: string } }
) {
   try {
      const session = await getServerSession(authOptions);

      if (!session || !session.user) {
         return NextResponse.json({ error: "Chưa xác thực" }, { status: 401 });
      }

      // Check if user is admin
      await connectDB();
      const currentUser = await User.findOne({ email: session.user.email });
      if (!currentUser || currentUser.role !== "admin") {
         return NextResponse.json(
            { error: "Bạn cần quyền quản trị để thực hiện thao tác này" },
            { status: 403 }
         );
      }

      // Don't allow deleting self
      if (currentUser._id.toString() === params.id) {
         return NextResponse.json(
            { error: "Không thể xóa tài khoản của chính bạn" },
            { status: 400 }
         );
      }

      const user = await User.findById(params.id);
      if (!user) {
         return NextResponse.json(
            { error: "Không tìm thấy người dùng" },
            { status: 404 }
         );
      }

      // Soft delete by setting isActive to false
      (user as any).isActive = false;
      await user.save();

      return NextResponse.json({
         message: "Vô hiệu hóa người dùng thành công",
      });
   } catch (error) {
      console.error("Error deleting user:", error);
      return NextResponse.json(
         { error: "Lỗi máy chủ nội bộ" },
         { status: 500 }
      );
   }
}
