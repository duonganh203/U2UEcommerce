"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
   Brain,
   DollarSign,
   TrendingUp,
   Lightbulb,
   Loader2,
   Sparkles,
   Target,
   BarChart3,
} from "lucide-react";

interface PriceSuggestion {
   suggestedPrice: number;
   priceRange: {
      min: number;
      max: number;
   };
   reasoning: string;
   marketTrend: string;
   confidence: number;
}

interface AIPricingAssistantProps {
   productInfo: {
      title: string;
      category: string;
      condition: string;
      brand?: string;
      description?: string;
      tags?: string;
   };
   onPriceSelect: (price: number) => void;
}

export default function AIPricingAssistant({
   productInfo,
   onPriceSelect,
}: AIPricingAssistantProps) {
   const [priceSuggestion, setPriceSuggestion] =
      useState<PriceSuggestion | null>(null);
   const [marketAnalysis, setMarketAnalysis] = useState<string>("");
   const [isLoading, setIsLoading] = useState(false);
   const [isAnalyzing, setIsAnalyzing] = useState(false);
   const [error, setError] = useState<string>("");

   const getPriceSuggestion = async () => {
      setIsLoading(true);
      setError("");

      try {
         const response = await fetch("/api/ai/pricing", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               productInfo,
               requestType: "price-suggestion",
            }),
         });

         const result = await response.json();

         if (result.success) {
            setPriceSuggestion(result.data);
         } else {
            if (result.error?.includes("GEMINI_API_KEY")) {
               setError(
                  "Vui lòng cấu hình Gemini API key trong file .env.local"
               );
            } else {
               setError(result.error || "Không thể phân tích giá");
            }
         }
      } catch (error) {
         setError("Lỗi kết nối đến AI service");
      } finally {
         setIsLoading(false);
      }
   };

   const getMarketAnalysis = async () => {
      setIsAnalyzing(true);
      setError("");

      try {
         const response = await fetch("/api/ai/pricing", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               productInfo,
               requestType: "market-analysis",
            }),
         });

         const result = await response.json();

         if (result.success) {
            setMarketAnalysis(result.data);
         } else {
            if (result.error?.includes("GEMINI_API_KEY")) {
               setError(
                  "Vui lòng cấu hình Gemini API key trong file .env.local"
               );
            } else {
               setError(result.error || "Không thể phân tích thị trường");
            }
         }
      } catch (error) {
         setError("Lỗi kết nối đến AI service");
      } finally {
         setIsAnalyzing(false);
      }
   };

   const getConfidenceColor = (confidence: number) => {
      if (confidence >= 80) return "bg-green-100 text-green-800";
      if (confidence >= 60) return "bg-yellow-100 text-yellow-800";
      return "bg-red-100 text-red-800";
   };

   const getConfidenceText = (confidence: number) => {
      if (confidence >= 80) return "Rất cao";
      if (confidence >= 60) return "Cao";
      if (confidence >= 40) return "Trung bình";
      return "Thấp";
   };

   return (
      <div className="space-y-4">
         {/* AI Pricing Card */}
         <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
               <CardTitle className="flex items-center gap-2 text-primary">
                  <Brain className="h-5 w-5" />
                  AI Pricing Assistant
                  <Sparkles className="h-4 w-4 text-yellow-500" />
               </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               {/* Action Buttons */}
               <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                     onClick={getPriceSuggestion}
                     disabled={
                        isLoading || !productInfo.title || !productInfo.category
                     }
                     className="flex-1"
                     variant="default"
                  >
                     {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                     ) : (
                        <Target className="h-4 w-4 mr-2" />
                     )}
                     {isLoading ? "Đang phân tích..." : "AI Định giá"}
                  </Button>

                  <Button
                     onClick={getMarketAnalysis}
                     disabled={isAnalyzing || !productInfo.category}
                     className="flex-1"
                     variant="outline"
                  >
                     {isAnalyzing ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                     ) : (
                        <BarChart3 className="h-4 w-4 mr-2" />
                     )}
                     {isAnalyzing
                        ? "Đang phân tích..."
                        : "Phân tích thị trường"}
                  </Button>
               </div>

               {/* Error Display */}
               {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
                     {error}
                  </div>
               )}

               {/* Price Suggestion Display */}
               {priceSuggestion && (
                  <div className="space-y-4 p-4 bg-white rounded-lg border">
                     <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-lg flex items-center gap-2">
                           <DollarSign className="h-5 w-5 text-green-600" />
                           Gợi ý giá từ AI
                        </h4>
                        <Badge
                           className={getConfidenceColor(
                              priceSuggestion.confidence
                           )}
                        >
                           Độ tin cậy:{" "}
                           {getConfidenceText(priceSuggestion.confidence)} (
                           {priceSuggestion.confidence}%)
                        </Badge>
                     </div>

                     <div className="grid md:grid-cols-3 gap-4">
                        {/* Suggested Price */}
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                           <div className="text-2xl font-bold text-green-600">
                              {priceSuggestion.suggestedPrice.toLocaleString(
                                 "vi-VN"
                              )}
                              đ
                           </div>
                           <div className="text-sm text-green-700">
                              Giá đề xuất
                           </div>
                        </div>

                        {/* Price Range */}
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                           <div className="text-lg font-semibold text-blue-600">
                              {priceSuggestion.priceRange.min.toLocaleString(
                                 "vi-VN"
                              )}
                              đ -{" "}
                              {priceSuggestion.priceRange.max.toLocaleString(
                                 "vi-VN"
                              )}
                              đ
                           </div>
                           <div className="text-sm text-blue-700">
                              Khoảng giá hợp lý
                           </div>
                        </div>

                        {/* Market Trend */}
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                           <div className="flex items-center justify-center gap-1 mb-1">
                              <TrendingUp className="h-4 w-4 text-purple-600" />
                              <span className="text-sm font-medium text-purple-600">
                                 Xu hướng
                              </span>
                           </div>
                           <div className="text-xs text-purple-700">
                              {priceSuggestion.marketTrend}
                           </div>
                        </div>
                     </div>

                     {/* Reasoning */}
                     <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-start gap-2">
                           <Lightbulb className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                           <div>
                              <div className="font-medium text-sm mb-1">
                                 Lý do đề xuất:
                              </div>
                              <div className="text-sm text-gray-700">
                                 {priceSuggestion.reasoning}
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Use Suggested Price Button */}
                     <Button
                        onClick={() =>
                           onPriceSelect(priceSuggestion.suggestedPrice)
                        }
                        className="w-full"
                        variant="default"
                     >
                        <DollarSign className="h-4 w-4 mr-2" />
                        Sử dụng giá đề xuất:{" "}
                        {priceSuggestion.suggestedPrice.toLocaleString("vi-VN")}
                        đ
                     </Button>
                  </div>
               )}

               {/* Market Analysis Display */}
               {marketAnalysis && (
                  <div className="p-4 bg-white rounded-lg border">
                     <h4 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        Phân tích thị trường
                     </h4>
                     <div className="text-sm text-gray-700 leading-relaxed">
                        {marketAnalysis}
                     </div>
                  </div>
               )}
            </CardContent>
         </Card>
      </div>
   );
}
