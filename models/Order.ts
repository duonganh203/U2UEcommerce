import mongoose from "mongoose";

export interface IOrder extends mongoose.Document {
   user: mongoose.Types.ObjectId;
   orderItems: Array<{
      product?: mongoose.Types.ObjectId;
      name: string;
      quantity: number;
      image: string;
      price: number;
   }>;
   shippingAddress: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
   };
   paymentMethod: string;
   paymentResult?: {
      id: string;
      status: string;
      update_time: string;
      email_address: string;
   };
   itemsPrice: number;
   shippingPrice: number;
   taxPrice: number;
   totalPrice: number;
   isPaid: boolean;
   paidAt?: Date;
   isDelivered: boolean;
   deliveredAt?: Date;
   createdAt: Date;
   updatedAt: Date;
}

const orderSchema = new mongoose.Schema(
   {
      user: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: "User",
      },
      orderItems: [
         {
            product: {
               type: mongoose.Schema.Types.ObjectId,
               required: false,
               ref: "Product",
            },
            name: {
               type: String,
               required: true,
            },
            quantity: {
               type: Number,
               required: true,
               min: 1,
            },
            image: {
               type: String,
               required: true,
            },
            price: {
               type: Number,
               required: true,
               min: 0,
            },
         },
      ],
      shippingAddress: {
         street: {
            type: String,
            required: true,
         },
         city: {
            type: String,
            required: true,
         },
         state: {
            type: String,
            required: true,
         },
         zipCode: {
            type: String,
            required: true,
         },
         country: {
            type: String,
            required: true,
         },
      },
      paymentMethod: {
         type: String,
         required: true,
      },
      paymentResult: {
         id: String,
         status: String,
         update_time: String,
         email_address: String,
      },
      itemsPrice: {
         type: Number,
         required: true,
         min: 0,
      },
      shippingPrice: {
         type: Number,
         required: true,
         min: 0,
      },
      taxPrice: {
         type: Number,
         required: true,
         min: 0,
      },
      totalPrice: {
         type: Number,
         required: true,
         min: 0,
      },
      isPaid: {
         type: Boolean,
         required: true,
         default: false,
      },
      paidAt: {
         type: Date,
      },
      isDelivered: {
         type: Boolean,
         required: true,
         default: false,
      },
      deliveredAt: {
         type: Date,
      },
   },
   {
      timestamps: true,
   }
);

export const Order = mongoose.model<IOrder>("Order", orderSchema);
