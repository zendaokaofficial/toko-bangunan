import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        "flex h-8 w-full rounded-md border border-input bg-white px-3 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-500 focus-visible:ring-1 focus-visible:ring-sky-200 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[64px] w-full rounded-md border border-input bg-white px-3 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:border-sky-500 focus-visible:ring-1 focus-visible:ring-sky-200 disabled:cursor-not-allowed disabled:bg-slate-100",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => (
    <label ref={ref} className={cn("text-[11px] font-semibold uppercase tracking-normal text-slate-500", className)} {...props} />
  )
);
Label.displayName = "Label";

export { Input, Textarea, Label };
