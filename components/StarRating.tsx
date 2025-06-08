"use client";

interface StarRatingProps {
   rating: number;
   maxRating?: number;
   size?: "sm" | "md" | "lg";
   interactive?: boolean;
   onRatingChange?: (rating: number) => void;
}

export default function StarRating({
   rating,
   maxRating = 5,
   size = "md",
   interactive = false,
   onRatingChange,
}: StarRatingProps) {
   const sizeClasses = {
      sm: "text-sm",
      md: "text-lg",
      lg: "text-2xl",
   };

   const handleStarClick = (starValue: number) => {
      if (interactive && onRatingChange) {
         onRatingChange(starValue);
      }
   };

   return (
      <div className="flex items-center">
         {[...Array(maxRating)].map((_, index) => {
            const starValue = index + 1;
            const isFilled = starValue <= rating;

            return (
               <button
                  key={index}
                  type="button"
                  disabled={!interactive}
                  className={`${sizeClasses[size]} ${
                     isFilled ? "text-yellow-400" : "text-gray-300"
                  } ${
                     interactive
                        ? "hover:text-yellow-300 cursor-pointer transition-colors"
                        : "cursor-default"
                  }`}
                  onClick={() => handleStarClick(starValue)}
               >
                  ★
               </button>
            );
         })}
      </div>
   );
}
