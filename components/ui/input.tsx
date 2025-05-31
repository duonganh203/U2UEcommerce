import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
   extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
   ({ className, type, ...props }, ref) => {
      return (
         <input
            type={type}
            className={cn(
               "appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-500 text-gray-900 font-medium bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 sm:text-sm disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50",
               className
            )}
            ref={ref}
            {...props}
         />
      );
   }
);
Input.displayName = "Input";

export { Input };
