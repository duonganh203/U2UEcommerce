"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { validateLoginForm, type LoginFormData } from "@/lib/validation";

const LoginPage = () => {
   const router = useRouter();
   const [formData, setFormData] = useState<LoginFormData>({
      email: "",
      password: "",
   });
   const [rememberMe, setRememberMe] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [errors, setErrors] = useState<string[]>([]);

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

   const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRememberMe(e.target.checked);
   };

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setErrors([]);

      // Validate form
      const validation = validateLoginForm(formData);
      if (!validation.isValid) {
         setErrors(validation.errors);
         setIsLoading(false);
         return;
      }

      try {
         const result = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false,
         });

         if (result?.error) {
            setErrors(["Invalid email or password"]);
         } else {
            // Successfully signed in
            const session = await getSession();
            if (session) {
               router.push("/dashboard");
               router.refresh();
            }
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
               Sign in to your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
               Don't have an account?{" "}
               <Link
                  href="/signup"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
               >
                  Sign up
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
               <form className="space-y-6" onSubmit={handleSubmit}>
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
                           autoComplete="current-password"
                           required
                           value={formData.password}
                           onChange={handleChange}
                           className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                     </div>
                  </div>

                  <div className="flex items-center justify-between">
                     <div className="flex items-center">
                        <input
                           id="remember-me"
                           name="rememberMe"
                           type="checkbox"
                           checked={rememberMe}
                           onChange={handleRememberMeChange}
                           className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label
                           htmlFor="remember-me"
                           className="ml-2 block text-sm text-gray-900"
                        >
                           Remember me
                        </label>
                     </div>

                     <div className="text-sm">
                        <Link
                           href="/forgot-password"
                           className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                           Forgot your password?
                        </Link>
                     </div>
                  </div>

                  <div>
                     <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                     >
                        {isLoading ? "Signing in..." : "Sign in"}
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
                           <span className="sr-only">Sign in with Google</span>
                           Google
                        </button>
                        <button
                           type="button"
                           className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                           <span className="sr-only">
                              Sign in with Facebook
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

export default LoginPage;
