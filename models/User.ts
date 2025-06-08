import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends mongoose.Document {
   email: string;
   password: string;
   firstName: string;
   lastName: string;
   role: "user" | "admin";
   phoneNumber?: string;
   avatar?: string;
   address?: {
      street: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
   };
   createdAt: Date;
   updatedAt: Date;
   comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
   {
      email: {
         type: String,
         required: true,
         unique: true,
         trim: true,
         lowercase: true,
      },
      password: {
         type: String,
         required: true,
         minlength: 8,
      },
      firstName: {
         type: String,
         required: true,
         trim: true,
      },
      lastName: {
         type: String,
         required: true,
         trim: true,
      },
      role: {
         type: String,
         enum: ["user", "admin"],
         default: "user",
      },
      phoneNumber: {
         type: String,
         trim: true,
      },
      avatar: {
         type: String,
         trim: true,
      },
      address: {
         street: String,
         city: String,
         state: String,
         zipCode: String,
         country: String,
      },
   },
   {
      timestamps: true,
   }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();

   try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
   } catch (error: any) {
      next(error);
   }
});

// Method to compare password
userSchema.methods.comparePassword = async function (
   candidatePassword: string
): Promise<boolean> {
   return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
