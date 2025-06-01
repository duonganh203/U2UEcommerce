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
   },
   {
      timestamps: true,
   }
);

export const Product = mongoose.model<IProduct>("Product", productSchema);
