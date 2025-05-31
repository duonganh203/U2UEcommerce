import React, { useState } from "react";
import AuthLayout from "./AuthLayout";
import { useRouter } from "next/navigation";

const Login = () => {
   const router = useRouter();
   const [formData, setFormData] = useState({
      email: "",
      password: "",
      rememberMe: false,
   });

   const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData((prev) => ({
         ...prev,
         [name]: type === "checkbox" ? checked : value,
      }));
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      // Handle login logic here
      console.log("Login form submitted:", formData);
      // After successful login, you can redirect:
      // router.push('/dashboard');
   };

   return (
      <AuthLayout
         title="Sign in to your account"
         subtitle="Don't have an account?"
         linkText="Sign up"
         linkTo="/signup"
      >
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
                     checked={formData.rememberMe}
                     onChange={handleChange}
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
                  <a
                     href="#"
                     className="font-medium text-indigo-600 hover:text-indigo-500"
                  >
                     Forgot your password?
                  </a>
               </div>
            </div>

            <div>
               <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
               >
                  Sign in
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
                     <span className="sr-only">Sign in with Facebook</span>
                     Facebook
                  </button>
               </div>
            </div>
         </form>
      </AuthLayout>
   );
};

export default Login;
