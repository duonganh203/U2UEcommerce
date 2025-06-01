import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
   "inline-flex items-center cursor-pointer justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-sm",
   {
      variants: {
         variant: {
            default:
               "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/50",
            destructive:
               "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive/50",
            outline:
               "border border-input bg-background hover:bg-accent hover:text-accent-foreground focus:ring-ring/50",
            secondary:
               "bg-secondary text-secondary-foreground hover:bg-secondary/90 focus:ring-secondary/50",
            ghost: "hover:bg-accent hover:text-accent-foreground focus:ring-ring/50",
            link: "text-primary underline-offset-4 hover:underline focus:ring-primary/50",
         },
         size: {
            default: "h-10 px-4 py-2",
            sm: "h-8 rounded-md px-3",
            lg: "h-11 rounded-lg px-8",
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
