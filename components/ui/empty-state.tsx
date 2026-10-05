import * as React from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmptyState({
  title = "Belum ada data",
  description = "Data akan muncul di sini setelah ditambahkan.",
  icon: Icon = Inbox,
  action,
  className
}: {
  title?: string;
  description?: string;
  icon?: React.ElementType;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-2 px-6 py-12 text-center", className)}>
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-slate-50 text-slate-400">
        <Icon className="h-5 w-5" />
      </span>
      <p className="text-sm font-semibold text-slate-700">{title}</p>
      <p className="max-w-sm text-xs text-slate-500">{description}</p>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
