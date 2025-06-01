"use strict";

const mongoose = require("mongoose");
require("dotenv").config();

// Define the User schema to match your application
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
   },
   { timestamps: true }
);

const User = mongoose.model("User", userSchema);

async function setAdminRole() {
   try {
      // Connect to MongoDB
      await mongoose.connect(process.env.MONGODB_URI);
      console.log("Connected to MongoDB");

      // Find the user with email admin@gmail.com
      const user = await User.findOne({ email: "admin@gmail.com" });

      if (!user) {
         console.log("User with email admin@gmail.com not found");
         return;
      }

      // Update the user's role to admin
      user.role = "admin";
      await user.save();

      console.log("Updated user role to admin for admin@gmail.com");
   } catch (error) {
      console.error("Error:", error);
   } finally {
      await mongoose.disconnect();
      console.log("Disconnected from MongoDB");
   }
}

setAdminRole();
