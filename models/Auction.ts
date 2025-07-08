import mongoose, { Schema, Document } from "mongoose";

export interface IAuction extends Document {
   title: string;
   description: string;
   startingPrice: number;
   currentPrice: number;
   minIncrement: number;
   images: string[];
   category: string;
   condition: "new" | "like-new" | "good" | "fair" | "poor";
   startTime: Date;
   endTime: Date;
   maxParticipants: number;
   participants: mongoose.Types.ObjectId[];
   bids: Array<{
      bidder: mongoose.Types.ObjectId;
      amount: number;
      timestamp: Date;
   }>;
   status:
      | "pending"
      | "approved"
      | "active"
      | "ended"
      | "rejected"
      | "cancelled";
   winner?: mongoose.Types.ObjectId;
   winnerAmount?: number;
   createdBy: mongoose.Types.ObjectId;
   createdAt: Date;
   updatedAt: Date;
}

const auctionSchema = new Schema<IAuction>(
   {
      title: {
         type: String,
         required: true,
         trim: true,
         maxlength: 100,
      },
      description: {
         type: String,
         required: true,
         maxlength: 1000,
      },
      startingPrice: {
         type: Number,
         required: true,
         min: 0,
      },
      currentPrice: {
         type: Number,
         required: true,
         min: 0,
      },
      minIncrement: {
         type: Number,
         required: true,
         min: 1,
         default: 1,
      },
      images: [
         {
            type: String,
            required: true,
         },
      ],
      category: {
         type: String,
         required: true,
         enum: [
            "electronics",
            "jewelry",
            "art",
            "collectibles",
            "fashion",
            "sports",
            "books",
            "other",
         ],
      },
      condition: {
         type: String,
         required: true,
         enum: ["new", "like-new", "good", "fair", "poor"],
      },
      startTime: {
         type: Date,
         required: true,
      },
      endTime: {
         type: Date,
         required: true,
      },
      maxParticipants: {
         type: Number,
         required: true,
         min: 1,
         max: 10,
         default: 10,
      },
      participants: [
         {
            type: Schema.Types.ObjectId,
            ref: "User",
         },
      ],
      bids: [
         {
            bidder: {
               type: Schema.Types.ObjectId,
               ref: "User",
               required: true,
            },
            amount: {
               type: Number,
               required: true,
               min: 0,
            },
            timestamp: {
               type: Date,
               default: Date.now,
            },
         },
      ],
      status: {
         type: String,
         required: true,
         enum: [
            "pending",
            "approved",
            "active",
            "ended",
            "rejected",
            "cancelled",
         ],
         default: "pending",
      },
      winner: {
         type: Schema.Types.ObjectId,
         ref: "User",
      },
      winnerAmount: {
         type: Number,
         min: 0,
      },
      createdBy: {
         type: Schema.Types.ObjectId,
         ref: "User",
         required: true,
      },
   },
   {
      timestamps: true,
   }
);

// Indexes for better performance
auctionSchema.index({ status: 1, endTime: 1 });
auctionSchema.index({ category: 1 });
auctionSchema.index({ createdBy: 1 });

// Virtual for time remaining
auctionSchema.virtual("timeRemaining").get(function () {
   if (this.status !== "active") return 0;
   const now = new Date();
   const remaining = this.endTime.getTime() - now.getTime();
   return Math.max(0, remaining);
});

// Virtual for participant count
auctionSchema.virtual("participantCount").get(function () {
   return this.participants.length;
});

// Method to check if auction is full
auctionSchema.methods.isFull = function () {
   return this.participants.length >= this.maxParticipants;
};

// Method to check if user can join
auctionSchema.methods.canJoin = function (userId: string) {
   return !this.isFull() && !this.participants.includes(userId);
};

// Method to add participant
auctionSchema.methods.addParticipant = function (userId: string) {
   if (this.canJoin(userId)) {
      this.participants.push(userId);
      return true;
   }
   return false;
};

// Method to place bid
auctionSchema.methods.placeBid = function (userId: string, amount: number) {
   if (this.status !== "active") return false;
   if (!this.participants.includes(userId)) return false;
   if (amount <= this.currentPrice) return false;

   this.bids.push({
      bidder: userId,
      amount: amount,
      timestamp: new Date(),
   });

   this.currentPrice = amount;
   return true;
};

export default mongoose.models.Auction ||
   mongoose.model<IAuction>("Auction", auctionSchema);
