import { NextRequest, NextResponse } from "next/server";
import {
   getAIPriceSuggestion,
   getMarketAnalysis,
   ProductInfo,
} from "@/lib/gemini";

export async function POST(request: NextRequest) {
   try {
      // Check if Gemini API key is configured
      if (!process.env.GEMINI_API_KEY) {
         return NextResponse.json(
            {
               error: "Chưa cấu hình GEMINI_API_KEY. Vui lòng thêm khóa API Gemini vào .env.local",
            },
            { status: 500 }
         );
      }

      const body = await request.json();
      const { productInfo, requestType } = body;

      if (!productInfo) {
         return NextResponse.json(
            { error: "Thiếu thông tin sản phẩm" },
            { status: 400 }
         );
      }

      if (requestType === "price-suggestion") {
         const priceSuggestion = await getAIPriceSuggestion(productInfo);
         return NextResponse.json({ success: true, data: priceSuggestion });
      }

      if (requestType === "market-analysis") {
         const marketAnalysis = await getMarketAnalysis(productInfo.category);
         return NextResponse.json({ success: true, data: marketAnalysis });
      }

      return NextResponse.json(
         { error: "Loại yêu cầu không hợp lệ" },
         { status: 400 }
      );
   } catch (error) {
      console.error("AI pricing API error:", error);
      return NextResponse.json(
         { error: "Lỗi máy chủ nội bộ" },
         { status: 500 }
      );
   }
}
