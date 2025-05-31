// Test script to demonstrate the new Zod validation
import { loginSchema, signupSchema } from "./lib/validation";

// Test valid login data
const validLoginData = {
   email: "test@example.com",
   password: "validpassword",
};

// Test invalid login data
const invalidLoginData = {
   email: "invalid-email",
   password: "",
};

// Test valid signup data
const validSignupData = {
   firstName: "John",
   lastName: "Doe",
   email: "john.doe@example.com",
   password: "StrongPass123",
   confirmPassword: "StrongPass123",
};

// Test invalid signup data
const invalidSignupData = {
   firstName: "J",
   lastName: "",
   email: "invalid-email",
   password: "weak",
   confirmPassword: "different",
};

console.log("Testing Login Schema:");
console.log("Valid data:", loginSchema.safeParse(validLoginData));
console.log("Invalid data:", loginSchema.safeParse(invalidLoginData));

console.log("\nTesting Signup Schema:");
console.log("Valid data:", signupSchema.safeParse(validSignupData));
console.log("Invalid data:", signupSchema.safeParse(invalidSignupData));
