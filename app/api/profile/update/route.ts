import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export async function PATCH(request: NextRequest) {
   try {
      const session = await getServerSession(authOptions);

      if (!session?.user?.id) {
         return NextResponse.json({ message: "Chưa xác thực"}, { status: 401 });
      }

      await connectDB();

      const body = await request.json();
      const { firstName, lastName, phoneNumber, avatar, address } = body;

      // Find and update the user
      const updatedUser = await User.findByIdAndUpdate(
         session.user.id,
         {
            firstName,
            lastName,
            phoneNumber,
            avatar,
            address,
            updatedAt: new Date(),
         },
         {
            new: true,
            runValidators: true,
            select: "-password", // Exclude password from response
         }
      );

      if (!updatedUser) {
         return NextResponse.json(
            { message: "Không tìm thấy người dùng" },
            { status: 404 }
         );
      }

      return NextResponse.json({
         message: "Cập nhật hồ sơ thành công",
         user: {
            id: updatedUser._id,
            email: updatedUser.email,
            firstName: updatedUser.firstName,
            lastName: updatedUser.lastName,
            phoneNumber: updatedUser.phoneNumber,
            avatar: updatedUser.avatar,
            address: updatedUser.address,
            role: updatedUser.role,
         },
      });
   } catch (error: any) {
      console.error("Profile update error:", error);

      // Handle validation errors
      if (error.name === "ValidationError") {
         const validationErrors = Object.values(error.errors).map(
            (err: any) => err.message
         );
         return NextResponse.json(
            { message: "Lỗi xác thực dữ liệu", errors: validationErrors },
            { status: 400 }
         );
      }

      return NextResponse.json(
         { message: "Lỗi máy chủ nội bộ" },
         { status: 500 }
      );
   }
}
