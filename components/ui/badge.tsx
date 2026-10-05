import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 whitespace-nowrap rounded px-2 py-0.5 text-[11px] font-semibold leading-5",
  {
    variants: {
      tone: {
        neutral: "border border-slate-200 bg-slate-50 text-slate-700",
        success: "border border-emerald-200 bg-emerald-50 text-emerald-700",
        warning: "border border-amber-200 bg-amber-50 text-amber-700",
        danger: "border border-rose-200 bg-rose-50 text-rose-700",
        info: "border border-sky-200 bg-sky-50 text-sky-700",
        purple: "border border-violet-200 bg-violet-50 text-violet-700"
      },
      variant: {
        solid: ""
      }
    },
    defaultVariants: {
      tone: "neutral"
    }
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}

export { badgeVariants };
