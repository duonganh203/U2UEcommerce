import mongoose from "mongoose";

export interface IProduct extends mongoose.Document {
   name: string;
   description: string;
   price: number;
   category: string;
   brand: string;
   images: string[];
   countInStock: number;
   rating: number;
   numReviews: number;
   reviews: Array<{
      user: mongoose.Types.ObjectId;
      rating: number;
      comment: string;
      createdAt: Date;
   }>;
   discountPercentage: number;
   seller: mongoose.Types.ObjectId;
   status: "pending" | "approved" | "rejected";
   isActive: boolean;
   condition: "new" | "like-new" | "good" | "fair" | "poor";
   tags: string[];
   shipping: {
      freeShipping: boolean;
      localPickup: boolean;
      calculatedShipping: boolean;
   };
   location: {
      city: string;
      state: string;
   };
   createdAt: Date;
   updatedAt: Date;

   // Rating methods
   calculateAverageRating(): number;
   addReview(
      userId: mongoose.Types.ObjectId,
      rating: number,
      comment: string
   ): Promise<IProduct>;
   removeReview(userId: mongoose.Types.ObjectId): Promise<IProduct>;
}

const productSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
         trim: true,
      },
      description: {
         type: String,
         required: true,
      },
      price: {
         type: Number,
         required: true,
         min: 0,
      },
      category: {
         type: String,
         required: true,
         trim: true,
      },
      brand: {
         type: String,
         required: true,
         trim: true,
      },
      images: [
         {
            type: String,
            required: true,
         },
      ],
      countInStock: {
         type: Number,
         required: true,
         min: 0,
         default: 0,
      },
      rating: {
         type: Number,
         required: true,
         default: 0,
         min: 0,
         max: 5,
      },
      numReviews: {
         type: Number,
         required: true,
         default: 0,
      },
      reviews: [
         {
            user: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "User",
               required: true,
            },
            rating: {
               type: Number,
               required: true,
               min: 1,
               max: 5,
            },
            comment: {
               type: String,
               required: true,
            },
            createdAt: {
               type: Date,
               default: Date.now,
            },
         },
      ],
      discountPercentage: {
         type: Number,
         min: 0,
         max: 100,
         default: 0,
      },
      seller: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
      status: {
         type: String,
         enum: ["pending", "approved", "rejected"],
         default: "pending",
         required: true,
      },
      isActive: {
         type: Boolean,
         default: true,
      },
      condition: {
         type: String,
         enum: ["new", "like-new", "good", "fair", "poor"],
         required: true,
      },
      tags: [
         {
            type: String,
            trim: true,
         },
      ],
      shipping: {
         freeShipping: {
            type: Boolean,
            default: false,
         },
         localPickup: {
            type: Boolean,
            default: false,
         },
         calculatedShipping: {
            type: Boolean,
            default: false,
         },
      },
      location: {
         city: {
            type: String,
            trim: true,
         },
         state: {
            type: String,
            trim: true,
         },
      },
   },
   {
      timestamps: true,
   }
);

// Method to calculate average rating from reviews
productSchema.methods.calculateAverageRating = function (this: IProduct) {
   if (this.reviews.length === 0) {
      this.rating = 0;
      this.numReviews = 0;
      return 0;
   }

   const totalRating = this.reviews.reduce(
      (sum: number, review: any) => sum + review.rating,
      0
   );
   const averageRating = totalRating / this.reviews.length;

   this.rating = Math.round(averageRating * 10) / 10; // Round to 1 decimal place
   this.numReviews = this.reviews.length;

   return this.rating;
};

// Method to add a review and update rating
productSchema.methods.addReview = function (
   this: IProduct,
   userId: mongoose.Types.ObjectId,
   rating: number,
   comment: string
) {
   // Check if user already reviewed this product
   const existingReviewIndex = this.reviews.findIndex(
      (review: any) => review.user.toString() === userId.toString()
   );

   if (existingReviewIndex !== -1) {
      // Update existing review
      this.reviews[existingReviewIndex].rating = rating;
      this.reviews[existingReviewIndex].comment = comment;
      this.reviews[existingReviewIndex].createdAt = new Date();
   } else {
      // Add new review
      this.reviews.push({
         user: userId,
         rating,
         comment,
         createdAt: new Date(),
      } as any);
   }

   // Recalculate average rating
   this.calculateAverageRating();

   return this.save();
};

// Method to remove a review and update rating
productSchema.methods.removeReview = function (
   this: IProduct,
   userId: mongoose.Types.ObjectId
) {
   this.reviews = this.reviews.filter(
      (review: any) => review.user.toString() !== userId.toString()
   ) as any;

   // Recalculate average rating
   this.calculateAverageRating();

   return this.save();
};

// Pre-save middleware to ensure rating is always calculated
productSchema.pre("save", function (next) {
   if (this.isModified("reviews")) {
      (this as any).calculateAverageRating();
   }
   next();
});

export const Product = mongoose.model<IProduct>("Product", productSchema);
