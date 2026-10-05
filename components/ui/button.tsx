"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-slate-300 bg-white text-slate-700 shadow-admin hover:bg-slate-50",
        primary: "border border-primary bg-primary text-primary-foreground hover:bg-sky-700",
        secondary: "border border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200",
        outline: "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50",
        ghost: "border border-transparent text-slate-600 hover:bg-slate-100",
        danger: "border border-rose-600 bg-rose-600 text-white hover:bg-rose-700",
        success: "border border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700"
      },
      size: {
        sm: "h-7 px-2.5",
        default: "h-8 px-3",
        lg: "h-9 px-4",
        icon: "h-8 w-8"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
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
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
