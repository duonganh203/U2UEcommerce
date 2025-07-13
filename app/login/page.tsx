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
      <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
         <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-foreground">
               Đăng nhập vào tài khoản của bạn
            </h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">
               Chưa có tài khoản?{" "}
               <Link
                  href="/signup"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
               >
                 Đăng ký
               </Link>
            </p>
         </div>

         <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-card py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-border">
               {error && (
                  <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg">
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
                              <FormLabel>Địa chỉ email</FormLabel>
                              <FormControl>
                                 <Input
                                    type="email"
                                    autoComplete="email"
                                    placeholder="Nhập email của bạn"
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
                              <FormLabel>Mật khẩu</FormLabel>
                              <FormControl>
                                 <Input
                                    type="password"
                                    autoComplete="current-password"
                                    placeholder="Nhập mật khẩu của bạn"
                                    {...field}
                                 />
                              </FormControl>
                              <FormMessage />
                           </FormItem>
                        )}
                     />{" "}
                     <div className="flex items-center justify-between">
                        <div className="flex items-center">
                           <input
                              id="remember-me"
                              name="rememberMe"
                              type="checkbox"
                              checked={rememberMe}
                              onChange={handleRememberMeChange}
                              className="h-4 w-4 text-primary focus:ring-ring border-input rounded"
                           />
                           <label
                              htmlFor="remember-me"
                              className="ml-2 block text-sm text-foreground"
                           >
                              Ghi nhớ đăng nhập
                           </label>
                        </div>

                        <div className="text-sm">
                           <Link
                              href="/forgot-password"
                              className="font-medium text-primary hover:text-primary/90"
                           >
                              Quên mật khẩu?
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
                              <div className="w-full border-t border-border" />
                           </div>
                           <div className="relative flex justify-center text-sm">
                              <span className="px-2 bg-card text-muted-foreground">
                                 Hoặc tiếp tục với
                              </span>
                           </div>
                        </div>

                        <div className="mt-6 grid grid-cols-2 gap-3">
                           <button
                              type="button"
                              className="w-full inline-flex justify-center py-2 px-4 border border-input rounded-lg shadow-sm bg-background text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                           >
                              <span className="sr-only">
                                 Đăng nhập với Google
                              </span>
                              Google
                           </button>
                           <button
                              type="button"
                              className="w-full inline-flex justify-center py-2 px-4 border border-input rounded-lg shadow-sm bg-background text-sm font-medium text-foreground hover:bg-accent hover:text-accent-foreground"
                           >
                              <span className="sr-only">
                                 Đăng nhập với Facebook
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
