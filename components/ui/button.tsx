import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
   "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
   {
      variants: {
         variant: {
            default:
               "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed",
            destructive:
               "bg-red-600 text-white shadow-sm hover:bg-red-700 focus:ring-red-500",
            outline:
               "border border-gray-300 bg-white shadow-sm hover:bg-gray-50 focus:ring-indigo-500",
            secondary:
               "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200 focus:ring-gray-500",
            ghost: "hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500",
            link: "text-indigo-600 underline-offset-4 hover:underline focus:ring-indigo-500",
         },
         size: {
            default: "h-10 px-4 py-2",
            sm: "h-8 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10",
         },
      },
      defaultVariants: {
         variant: "default",
         size: "default",
      },
   }
);

function Button({
   className,
   variant,
   size,
   asChild = false,
   ...props
}: React.ComponentProps<"button"> &
   VariantProps<typeof buttonVariants> & {
      asChild?: boolean;
   }) {
   const Comp = asChild ? Slot : "button";

   return (
      <Comp
         data-slot="button"
         className={cn(buttonVariants({ variant, size, className }))}
         {...props}
      />
   );
}

export { Button, buttonVariants };
