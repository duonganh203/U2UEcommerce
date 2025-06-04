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

export const Product = mongoose.model<IProduct>("Product", productSchema);
