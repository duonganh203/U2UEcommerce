import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
   try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      // In a real application, you might want to store cart in database
      // For now, we'll just return success since cart is stored in localStorage
      // The frontend will handle clearing the localStorage

      console.log(
         "Cart Clear API DEBUG - Clearing cart for user:",
         session.user.id
      );

      return NextResponse.json({
         success: true,
         message: "Cart cleared successfully",
      });
   } catch (error) {
      console.error("Error clearing cart:", error);
      return NextResponse.json(
         { error: "Internal server error" },
         { status: 500 }
      );
   }
}
