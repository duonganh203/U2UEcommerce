/**
 * Utility functions for product rating system
 */

export interface RatingBreakdown {
   5: number;
   4: number;
   3: number;
   2: number;
   1: number;
}

/**
 * Calculate rating breakdown from reviews
 */
export function calculateRatingBreakdown(
   reviews: Array<{ rating: number }>
): RatingBreakdown {
   const breakdown: RatingBreakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

   reviews.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
         breakdown[review.rating as keyof RatingBreakdown]++;
      }
   });

   return breakdown;
}

/**
 * Calculate percentage for each rating level
 */
export function calculateRatingPercentages(
   breakdown: RatingBreakdown,
   totalReviews: number
) {
   return {
      5: totalReviews > 0 ? Math.round((breakdown[5] / totalReviews) * 100) : 0,
      4: totalReviews > 0 ? Math.round((breakdown[4] / totalReviews) * 100) : 0,
      3: totalReviews > 0 ? Math.round((breakdown[3] / totalReviews) * 100) : 0,
      2: totalReviews > 0 ? Math.round((breakdown[2] / totalReviews) * 100) : 0,
      1: totalReviews > 0 ? Math.round((breakdown[1] / totalReviews) * 100) : 0,
   };
}

/**
 * Format rating display (e.g., 4.5 stars, 4 stars)
 */
export function formatRatingText(rating: number, numReviews: number): string {
   if (numReviews === 0) {
      return "No reviews yet";
   }

   const ratingText = rating % 1 === 0 ? rating.toString() : rating.toFixed(1);
   const reviewText = numReviews === 1 ? "review" : "reviews";

   return `${ratingText} stars (${numReviews} ${reviewText})`;
}

/**
 * Get rating color based on value
 */
export function getRatingColor(rating: number): string {
   if (rating >= 4.5) return "text-green-600";
   if (rating >= 4.0) return "text-green-500";
   if (rating >= 3.5) return "text-yellow-500";
   if (rating >= 3.0) return "text-yellow-600";
   if (rating >= 2.0) return "text-orange-500";
   return "text-red-500";
}

/**
 * Validate rating value
 */
export function isValidRating(rating: number): boolean {
   return rating >= 1 && rating <= 5 && Number.isInteger(rating);
}

/**
 * Get rating summary text
 */
export function getRatingSummary(rating: number): string {
   if (rating >= 4.5) return "Excellent";
   if (rating >= 4.0) return "Very Good";
   if (rating >= 3.5) return "Good";
   if (rating >= 3.0) return "Average";
   if (rating >= 2.0) return "Poor";
   return "Very Poor";
}
