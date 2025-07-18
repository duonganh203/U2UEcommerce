import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends mongoose.Document {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: "user" | "admin";
    isActive: boolean;
    phoneNumber?: string;
    avatar?: string;
    address?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    // Thêm thông tin gói dịch vụ
    subscription?: {
        plan: "basic" | "pro" | "vip";
        startDate: Date;
        endDate: Date;
        isActive: boolean;
        pushCredits?: number; // Số tin đẩy còn lại
        aiCredits?: number; // Số lần dùng AI còn lại
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
        isActive: {
            type: Boolean,
            default: true,
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
        // Thêm schema cho gói dịch vụ
        subscription: {
            plan: {
                type: String,
                enum: ["basic", "pro", "vip"],
                default: "basic",
            },
            startDate: {
                type: Date,
                default: Date.now,
            },
            endDate: {
                type: Date,
            },
            isActive: {
                type: Boolean,
                default: true,
            },
            pushCredits: {
                type: Number,
                default: 0,
            },
            aiCredits: {
                type: Number,
                default: 3, // Basic plan có 3 lần AI/tháng
            },
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
