"use client";

import StarRating from "@/components/StarRating";
import {
   calculateRatingBreakdown,
   calculateRatingPercentages,
   formatRatingText,
   getRatingColor,
   getRatingSummary,
   type RatingBreakdown,
} from "@/utils/rating";

interface Review {
   rating: number;
}

interface RatingDisplayProps {
   rating: number;
   numReviews: number;
   reviews?: Review[];
   showBreakdown?: boolean;
   size?: "sm" | "md" | "lg";
}

export default function RatingDisplay({
   rating,
   numReviews,
   reviews = [],
   showBreakdown = false,
   size = "md",
}: RatingDisplayProps) {
   const breakdown = calculateRatingBreakdown(reviews);
   const percentages = calculateRatingPercentages(breakdown, numReviews);

   const sizeClasses = {
      sm: {
         rating: "text-lg",
         summary: "text-sm",
         bar: "h-2",
      },
      md: {
         rating: "text-2xl",
         summary: "text-base",
         bar: "h-3",
      },
      lg: {
         rating: "text-4xl",
         summary: "text-lg",
         bar: "h-4",
      },
   };

   return (
      <div className="space-y-4">
         {/* Main Rating Display */}
         <div className="flex items-center space-x-4">
            <div
               className={`font-bold ${
                  sizeClasses[size].rating
               } ${getRatingColor(rating)}`}
            >
               {rating > 0 ? rating.toFixed(1) : "0.0"}
            </div>
            <div className="flex flex-col">
               <StarRating rating={rating} size={size} />
               <div
                  className={`text-gray-600 dark:text-gray-400 ${sizeClasses[size].summary}`}
               >
                  {formatRatingText(rating, numReviews)}
               </div>
               {numReviews > 0 && (
                  <div className={`text-gray-500 ${sizeClasses[size].summary}`}>
                     {getRatingSummary(rating)}
                  </div>
               )}
            </div>
         </div>

         {/* Rating Breakdown */}
         {showBreakdown && numReviews > 0 && (
            <div className="space-y-2">
               <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  Rating Breakdown
               </h4>
               {[5, 4, 3, 2, 1].map((stars) => (
                  <div key={stars} className="flex items-center space-x-3">
                     <div className="flex items-center space-x-1 w-16">
                        <span className="text-sm">{stars}</span>
                        <span className="text-yellow-400 text-sm">★</span>
                     </div>
                     <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                           className={`bg-yellow-400 ${sizeClasses[size].bar} transition-all duration-300`}
                           style={{
                              width: `${
                                 percentages[stars as keyof RatingBreakdown]
                              }%`,
                           }}
                        />
                     </div>
                     <div className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                        {breakdown[stars as keyof RatingBreakdown]}
                     </div>
                     <div className="text-sm text-gray-500 w-8 text-right">
                        {percentages[stars as keyof RatingBreakdown]}%
                     </div>
                  </div>
               ))}
            </div>
         )}

         {/* No Reviews State */}
         {numReviews === 0 && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
               <p>No reviews yet</p>
               <p className="text-sm">Be the first to review this product!</p>
            </div>
         )}
      </div>
   );
}
