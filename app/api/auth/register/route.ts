import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User } from "@/models/User";

export async function POST(request: NextRequest) {
    try {
        const { firstName, lastName, email, password } = await request.json();

        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // Validate password length
        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters long" },
                { status: 400 }
            );
        }

        await connectDB();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists with this email" },
                { status: 409 }
            );
        }

        // Create new user
        const user = new User({
            firstName,
            lastName,
            email,
            password, // Will be hashed by the pre-save middleware
        });

        await user.save();

        // Return user data without password
        const { password: _, ...userWithoutPassword } = user.toObject();

        return NextResponse.json(
            {
                message: "User created successfully",
                user: userWithoutPassword,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
