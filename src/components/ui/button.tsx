import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-eld-space-indigo/10 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-eld-space-indigo text-white shadow-theme-xs hover:bg-eld-dusty-grape",
        destructive:
          "bg-red-500 text-white shadow-theme-xs hover:bg-red-600",
        outline:
          "ring-1 ring-inset ring-eld-almond-silk bg-white text-eld-space-indigo hover:bg-eld-seashell dark:bg-transparent dark:text-eld-seashell dark:ring-gray-700 dark:hover:bg-gray-800",
        secondary:
          "bg-eld-seashell text-eld-space-indigo hover:bg-eld-almond-silk/50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700",
        ghost:
          "hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800",
        link: "text-eld-space-indigo underline-offset-4 hover:underline dark:text-eld-almond-silk",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
