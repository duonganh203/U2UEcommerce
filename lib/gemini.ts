import { GoogleGenerativeAI } from "@google/generative-ai";

// Khởi tạo Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface ProductInfo {
   title: string;
   category: string;
   condition: string;
   brand?: string;
   description?: string;
   tags?: string;
}

export interface PriceSuggestion {
   suggestedPrice: number;
   priceRange: {
      min: number;
      max: number;
   };
   reasoning: string;
   marketTrend: string;
   confidence: number;
}

export async function getAIPriceSuggestion(
   productInfo: ProductInfo
): Promise<PriceSuggestion> {
   const models = [
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-2.0-flash-exp",
   ];

   for (const modelName of models) {
      try {
         const model = genAI.getGenerativeModel({ model: modelName });

         const prompt = `
Bạn là một chuyên gia định giá sản phẩm thương mại điện tử tại Việt Nam. Hãy phân tích thông tin sản phẩm sau và đưa ra gợi ý giá phù hợp bằng tiền Việt Nam (VND).

Thông tin sản phẩm:
- Tên sản phẩm: ${productInfo.title}
- Danh mục: ${productInfo.category}
- Tình trạng: ${productInfo.condition}
- Thương hiệu: ${productInfo.brand || "Không xác định"}
- Mô tả: ${productInfo.description || "Không có mô tả"}
- Tags: ${productInfo.tags || "Không có tags"}

QUAN TRỌNG: Chỉ trả về JSON thuần túy, không có markdown, không có text khác.

Trả về JSON theo format này:
{
  "suggestedPrice": số tiền đề xuất (VND, không có dấu phẩy hoặc dấu chấm),
  "priceRange": {
    "min": giá thấp nhất hợp lý (VND, không có dấu phẩy hoặc dấu chấm),
    "max": giá cao nhất hợp lý (VND, không có dấu phẩy hoặc dấu chấm)
  },
  "reasoning": "lý do đề xuất giá này bằng tiếng Việt",
  "marketTrend": "xu hướng thị trường hiện tại bằng tiếng Việt",
  "confidence": độ tin cậy từ 0-100
}

Lưu ý:
- Giá phải thực tế và cạnh tranh cho thị trường Việt Nam
- Cân nhắc tình trạng sản phẩm
- Tham khảo thị trường Việt Nam hiện tại
- Chỉ trả về JSON, không có text khác
- Giá VND phải là số nguyên, không có dấu phẩy hoặc dấu chấm
`;

         const result = await model.generateContent(prompt);
         const response = await result.response;
         const text = response.text();

         // Clean and parse JSON response
         let jsonText = text.trim();

         // Remove markdown code blocks if present
         if (jsonText.startsWith("```json")) {
            jsonText = jsonText
               .replace(/^```json\s*/, "")
               .replace(/\s*```$/, "");
         } else if (jsonText.startsWith("```")) {
            jsonText = jsonText.replace(/^```\s*/, "").replace(/\s*```$/, "");
         }

         // Try to extract JSON from the response
         const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
         if (jsonMatch) {
            jsonText = jsonMatch[0];
         }

         // Parse JSON response
         const priceSuggestion: PriceSuggestion = JSON.parse(jsonText);

         return priceSuggestion;
      } catch (error) {
         console.error(`Error with model ${modelName}:`, error);
         // Continue to next model
         continue;
      }
   }

   // If all models fail, return fallback response
   console.error("All AI models failed, using fallback response");
   return {
      suggestedPrice: 0,
      priceRange: { min: 0, max: 0 },
      reasoning: "Không thể phân tích giá do lỗi hệ thống",
      marketTrend: "Không xác định",
      confidence: 0,
   };
}

export async function getMarketAnalysis(category: string): Promise<string> {
   const models = [
      "gemini-1.5-flash",
      "gemini-1.5-pro",
      "gemini-2.0-flash-exp",
   ];

   for (const modelName of models) {
      try {
         const model = genAI.getGenerativeModel({ model: modelName });

         const prompt = `
    Phân tích thị trường cho danh mục "${category}" trong thương mại điện tử:
    - Xu hướng giá hiện tại
    - Các yếu tố ảnh hưởng đến giá
    - Lời khuyên cho người bán
    - Thời điểm tốt để bán

    Trả về phân tích ngắn gọn bằng tiếng Việt (tối đa 200 từ).
    `;

         const result = await model.generateContent(prompt);
         const response = await result.response;
         return response.text();
      } catch (error) {
         console.error(`Error with model ${modelName}:`, error);
         // Continue to next model
         continue;
      }
   }

   // If all models fail, return fallback response
   console.error("All AI models failed for market analysis");
   return "Không thể phân tích thị trường do lỗi hệ thống.";
}
