import { z } from "zod";

// Zod schemas for form validation
export const loginSchema = z.object({
   email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),
   password: z.string().min(1, "Password is required"),
});

export const signupSchema = z
   .object({
      firstName: z
         .string()
         .min(1, "First name is required")
         .min(2, "First name must be at least 2 characters"),
      lastName: z
         .string()
         .min(1, "Last name is required")
         .min(2, "Last name must be at least 2 characters"),
      email: z
         .string()
         .min(1, "Email is required")
         .email("Please enter a valid email address"),
      password: z
         .string()
         .min(8, "Password must be at least 8 characters long")
         .regex(
            /(?=.*[a-z])/,
            "Password must contain at least one lowercase letter"
         )
         .regex(
            /(?=.*[A-Z])/,
            "Password must contain at least one uppercase letter"
         )
         .regex(/(?=.*\d)/, "Password must contain at least one number"),
      confirmPassword: z.string().min(1, "Please confirm your password"),
   })
   .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
   });

// Type inference from Zod schemas
export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;

// Legacy validation functions (keeping for backward compatibility)
export interface ValidationResult {
   isValid: boolean;
   errors: string[];
}

export function validateEmail(email: string): boolean {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email);
}

export function validatePassword(password: string): ValidationResult {
   const errors: string[] = [];

   if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
   }

   if (!/(?=.*[a-z])/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
   }

   if (!/(?=.*[A-Z])/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
   }

   if (!/(?=.*\d)/.test(password)) {
      errors.push("Password must contain at least one number");
   }

   return {
      isValid: errors.length === 0,
      errors,
   };
}

export function validateLoginForm(data: LoginFormData): ValidationResult {
   const errors: string[] = [];

   if (!data.email.trim()) {
      errors.push("Email is required");
   } else if (!validateEmail(data.email)) {
      errors.push("Please enter a valid email address");
   }

   if (!data.password) {
      errors.push("Password is required");
   }

   return {
      isValid: errors.length === 0,
      errors,
   };
}

export function validateSignupForm(data: SignupFormData): ValidationResult {
   const errors: string[] = [];

   if (!data.firstName.trim()) {
      errors.push("First name is required");
   }

   if (!data.lastName.trim()) {
      errors.push("Last name is required");
   }

   if (!data.email.trim()) {
      errors.push("Email is required");
   } else if (!validateEmail(data.email)) {
      errors.push("Please enter a valid email address");
   }

   const passwordValidation = validatePassword(data.password);
   if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
   }

   if (data.password !== data.confirmPassword) {
      errors.push("Passwords do not match");
   }

   return {
      isValid: errors.length === 0,
      errors,
   };
}
