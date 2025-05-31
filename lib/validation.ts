export interface ValidationResult {
   isValid: boolean;
   errors: string[];
}

export interface LoginFormData {
   email: string;
   password: string;
}

export interface SignupFormData {
   firstName: string;
   lastName: string;
   email: string;
   password: string;
   confirmPassword: string;
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
