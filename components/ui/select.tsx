import * as React from "react";
import { cn } from "@/lib/utils";

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-8 w-full cursor-pointer rounded-md border border-input bg-white px-2.5 text-xs text-slate-700 outline-none focus:border-sky-500 focus-visible:ring-1 focus-visible:ring-sky-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";

export { Select };
