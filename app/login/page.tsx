"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, getSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormData } from "@/lib/validation";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const LoginPage = () => {
   const router = useRouter();
   const [rememberMe, setRememberMe] = useState(false);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState("");

   const form = useForm<LoginFormData>({
      resolver: zodResolver(loginSchema),
      defaultValues: {
         email: "",
         password: "",
      },
   });

   const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setRememberMe(e.target.checked);
   };

   const onSubmit = async (data: LoginFormData) => {
      setIsLoading(true);
      setError("");

      try {
         const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,
         });
         if (result?.error) {
            setError("Invalid email or password");
         } else {
            // Successfully signed in
            const session = await getSession();
            if (session) {
               // Handle the special case for admin@gmail.com - set role to admin
               if (session.user.email === "admin@gmail.com") {
                  // First update the role in the session if it's not already admin
                  if (session.user.role !== "admin") {
                     // For UI demo purposes only, in a real app you would update the database
                     session.user.role = "admin";
                  }
                  router.push("/admin");
               } else {
                  router.push("/dashboard");
               }
               router.refresh();
            }
         }
      } catch (error) {
         setError("An error occurred. Please try again.");
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
               {error && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
                     {error}
                  </div>
               )}
               <Form {...form}>
                  <form
                     onSubmit={form.handleSubmit(onSubmit)}
                     className="space-y-6"
                  >
                     <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Email address</FormLabel>
                              <FormControl>
                                 <Input
                                    type="email"
                                    autoComplete="email"
                                    placeholder="Enter your email"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

                     <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                           <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                 <Input
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />

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
                        <Button
                           type="submit"
                           disabled={isLoading}
                           className="w-full"
                        >
                           {isLoading ? "Signing in..." : "Sign in"}
                        </Button>
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
                              <span className="sr-only">
                                 Sign in with Google
                              </span>
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
               </Form>
            </div>
         </div>
      </div>
   );
};

export default LoginPage;
