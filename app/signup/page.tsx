"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { validateSignupForm, type SignupFormData } from "@/lib/validation";

const SignupPage = () => {
   const router = useRouter();
   const [formData, setFormData] = useState<SignupFormData>({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
   });
   const [acceptTerms, setAcceptTerms] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [errors, setErrors] = useState<string[]>([]);
   const [success, setSuccess] = useState("");

   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: value,
      }));
      // Clear errors when user starts typing
      if (errors.length > 0) {
         setErrors([]);
      }
   };

   const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setAcceptTerms(e.target.checked);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setErrors([]);
      setSuccess("");

      // Validate form
      const validation = validateSignupForm(formData);
      const allErrors = [...validation.errors];

      if (!acceptTerms) {
         allErrors.push("Please accept the terms and conditions");
      }

      if (allErrors.length > 0) {
         setErrors(allErrors);
         setIsLoading(false);
         return;
      }

      try {
         const response = await fetch("/api/auth/register", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               firstName: formData.firstName,
               lastName: formData.lastName,
               email: formData.email,
               password: formData.password,
            }),
         });

         const data = await response.json();

         if (!response.ok) {
            setErrors([data.error || "Registration failed"]);
         } else {
            setSuccess("Account created successfully! Redirecting to login...");
            setTimeout(() => {
               router.push("/login");
            }, 2000);
         }
      } catch (error) {
         setErrors(["An error occurred. Please try again."]);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
         <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
               Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
               Already have an account?{" "}
               <Link
                  href="/login"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
               >
                  Sign in
               </Link>
            </p>
         </div>

         <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
               {errors.length > 0 && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
                     <ul className="list-disc list-inside space-y-1">
                        {errors.map((error, index) => (
                           <li key={index}>{error}</li>
                        ))}
                     </ul>
                  </div>
               )}
               {success && (
                  <div className="mb-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md">
                     {success}
                  </div>
               )}
               <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                     <div>
                        <label
                           htmlFor="firstName"
                           className="block text-sm font-medium text-gray-700"
                        >
                           First name
                        </label>
                        <div className="mt-1">
                           <input
                              id="firstName"
                              name="firstName"
                              type="text"
                              autoComplete="given-name"
                              required
                              value={formData.firstName}
                              onChange={handleChange}
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                           />
                        </div>
                     </div>

                     <div>
                        <label
                           htmlFor="lastName"
                           className="block text-sm font-medium text-gray-700"
                        >
                           Last name
                        </label>
                        <div className="mt-1">
                           <input
                              id="lastName"
                              name="lastName"
                              type="text"
                              autoComplete="family-name"
                              required
                              value={formData.lastName}
                              onChange={handleChange}
                              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                           />
                        </div>
                     </div>
                  </div>

                  <div>
                     <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                     >
                        Email address
                     </label>
                     <div className="mt-1">
                        <input
                           id="email"
                           name="email"
                           type="email"
                           autoComplete="email"
                           required
                           value={formData.email}
                           onChange={handleChange}
                           className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                     </div>
                  </div>

                  <div>
                     <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700"
                     >
                        Password
                     </label>
                     <div className="mt-1">
                        <input
                           id="password"
                           name="password"
                           type="password"
                           autoComplete="new-password"
                           required
                           value={formData.password}
                           onChange={handleChange}
                           className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                     </div>
                  </div>

                  <div>
                     <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700"
                     >
                        Confirm password
                     </label>
                     <div className="mt-1">
                        <input
                           id="confirmPassword"
                           name="confirmPassword"
                           type="password"
                           autoComplete="new-password"
                           required
                           value={formData.confirmPassword}
                           onChange={handleChange}
                           className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                     </div>
                  </div>

                  <div className="flex items-center">
                     <input
                        id="accept-terms"
                        name="acceptTerms"
                        type="checkbox"
                        checked={acceptTerms}
                        onChange={handleTermsChange}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                     />
                     <label
                        htmlFor="accept-terms"
                        className="ml-2 block text-sm text-gray-900"
                     >
                        I agree to the{" "}
                        <Link
                           href="/terms"
                           className="text-indigo-600 hover:text-indigo-500"
                        >
                           Terms and Conditions
                        </Link>{" "}
                        and{" "}
                        <Link
                           href="/privacy"
                           className="text-indigo-600 hover:text-indigo-500"
                        >
                           Privacy Policy
                        </Link>
                     </label>
                  </div>

                  <div>
                     <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                     >
                        {isLoading ? "Creating account..." : "Create account"}
                     </button>
                  </div>

                  <div className="mt-6">
                     <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                           <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                           <span className="px-2 bg-white text-gray-500">
                              Or continue with
                           </span>
                        </div>
                     </div>

                     <div className="mt-6 grid grid-cols-2 gap-3">
                        <button
                           type="button"
                           className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                           <span className="sr-only">Sign up with Google</span>
                           Google
                        </button>
                        <button
                           type="button"
                           className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                           <span className="sr-only">
                              Sign up with Facebook
                           </span>
                           Facebook
                        </button>
                     </div>
                  </div>
               </form>
            </div>
         </div>
      </div>
   );
};

export default SignupPage;
