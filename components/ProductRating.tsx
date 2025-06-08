"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Review {
   _id: string;
   user: {
      _id: string;
      name: string;
      email: string;
   };
   rating: number;
   comment: string;
   createdAt: string;
}

interface ProductRatingProps {
   productId: string;
   sellerId: string;
}

export default function ProductRating({
   productId,
   sellerId,
}: ProductRatingProps) {
   const { data: session } = useSession();
   const [reviews, setReviews] = useState<Review[]>([]);
   const [rating, setRating] = useState(0);
   const [comment, setComment] = useState("");
   const [loading, setLoading] = useState(false);
   const [averageRating, setAverageRating] = useState(0);
   const [numReviews, setNumReviews] = useState(0);
   const [userReview, setUserReview] = useState<Review | null>(null);
   const [hoveredStar, setHoveredStar] = useState(0);

   useEffect(() => {
      fetchReviews();
   }, [productId]);

   const fetchReviews = async () => {
      try {
         const response = await fetch(`/api/products/${productId}/reviews`);
         if (response.ok) {
            const data = await response.json();
            setReviews(data.reviews);
            setAverageRating(data.rating);
            setNumReviews(data.numReviews);

            // Check if current user has already reviewed
            if (session?.user?.id) {
               const existingReview = data.reviews.find(
                  (review: Review) => review.user._id === session.user.id
               );
               if (existingReview) {
                  setUserReview(existingReview);
                  setRating(existingReview.rating);
                  setComment(existingReview.comment);
               }
            }
         }
      } catch (error) {
         console.error("Error fetching reviews:", error);
      }
   };

   const handleSubmitReview = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!session?.user?.id) return;

      setLoading(true);
      try {
         const response = await fetch(`/api/products/${productId}/reviews`, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({ rating, comment }),
         });

         if (response.ok) {
            const data = await response.json();
            setAverageRating(data.rating);
            setNumReviews(data.numReviews);
            await fetchReviews();
            if (!userReview) {
               setRating(0);
               setComment("");
            }
         } else {
            const error = await response.json();
            alert(error.error || "Failed to submit review");
         }
      } catch (error) {
         console.error("Error submitting review:", error);
         alert("Failed to submit review");
      } finally {
         setLoading(false);
      }
   };

   const handleDeleteReview = async () => {
      if (!session?.user?.id || !userReview) return;

      setLoading(true);
      try {
         const response = await fetch(`/api/products/${productId}/reviews`, {
            method: "DELETE",
         });

         if (response.ok) {
            const data = await response.json();
            setAverageRating(data.rating);
            setNumReviews(data.numReviews);
            setUserReview(null);
            setRating(0);
            setComment("");
            await fetchReviews();
         } else {
            const error = await response.json();
            alert(error.error || "Failed to delete review");
         }
      } catch (error) {
         console.error("Error deleting review:", error);
         alert("Failed to delete review");
      } finally {
         setLoading(false);
      }
   };

   const renderStars = (ratingValue: number, interactive = false) => {
      return [...Array(5)].map((_, index) => {
         const starValue = index + 1;
         return (
            <button
               key={index}
               type="button"
               disabled={!interactive}
               className={`text-2xl ${
                  starValue <=
                  (interactive ? hoveredStar || rating : ratingValue)
                     ? "text-yellow-400"
                     : "text-gray-300"
               } ${interactive ? "hover:text-yellow-300 cursor-pointer" : ""}`}
               onClick={interactive ? () => setRating(starValue) : undefined}
               onMouseEnter={
                  interactive ? () => setHoveredStar(starValue) : undefined
               }
               onMouseLeave={interactive ? () => setHoveredStar(0) : undefined}
            >
               ★
            </button>
         );
      });
   };

   const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
         year: "numeric",
         month: "long",
         day: "numeric",
      });
   };

   const canReview = session?.user?.id && session.user.id !== sellerId;

   return (
      <div className="space-y-6">
         {/* Overall Rating Display */}
         <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center space-x-4">
               <div className="text-3xl font-bold">
                  {averageRating.toFixed(1)}
               </div>
               <div>
                  <div className="flex">{renderStars(averageRating)}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                     {numReviews} {numReviews === 1 ? "review" : "reviews"}
                  </div>
               </div>
            </div>
         </div>

         {/* Review Form */}
         {canReview && (
            <div className="border rounded-lg p-4">
               <h3 className="text-lg font-semibold mb-4">
                  {userReview ? "Update Your Review" : "Write a Review"}
               </h3>
               <form onSubmit={handleSubmitReview} className="space-y-4">
                  <div>
                     <Label htmlFor="rating">Rating</Label>
                     <div className="flex items-center space-x-1">
                        {renderStars(rating, true)}
                     </div>
                  </div>
                  <div>
                     <Label htmlFor="comment">Comment</Label>
                     <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full p-2 border rounded-md resize-none h-24"
                        placeholder="Share your experience with this product..."
                        required
                     />
                  </div>
                  <div className="flex space-x-2">
                     <Button type="submit" disabled={loading || rating === 0}>
                        {loading
                           ? "Submitting..."
                           : userReview
                           ? "Update Review"
                           : "Submit Review"}
                     </Button>
                     {userReview && (
                        <Button
                           type="button"
                           variant="destructive"
                           onClick={handleDeleteReview}
                           disabled={loading}
                        >
                           Delete Review
                        </Button>
                     )}
                  </div>
               </form>
            </div>
         )}

         {!session && (
            <div className="text-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
               <p>Please log in to write a review</p>
            </div>
         )}

         {session?.user?.id === sellerId && (
            <div className="text-center p-4 bg-blue-100 dark:bg-blue-900 rounded-lg">
               <p>You cannot review your own product</p>
            </div>
         )}

         {/* Reviews List */}
         <div className="space-y-4">
            <h3 className="text-lg font-semibold">Reviews ({numReviews})</h3>
            {reviews.length === 0 ? (
               <p className="text-gray-600 dark:text-gray-400">
                  No reviews yet. Be the first to review!
               </p>
            ) : (
               reviews.map((review) => (
                  <div key={review._id} className="border rounded-lg p-4">
                     <div className="flex items-start justify-between">
                        <div>
                           <div className="flex items-center space-x-2">
                              <span className="font-medium">
                                 {review.user.name}
                              </span>
                              <div className="flex">
                                 {renderStars(review.rating)}
                              </div>
                           </div>
                           <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formatDate(review.createdAt)}
                           </p>
                        </div>
                     </div>
                     <p className="mt-2">{review.comment}</p>
                  </div>
               ))
            )}
         </div>
      </div>
   );
}
