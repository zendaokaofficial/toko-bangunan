import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Kartu statistik compact untuk dashboard, stok, laporan.
 */
export function StatCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "neutral",
  trend
}: {
  label: string;
  value: string;
  detail?: string;
  icon?: React.ElementType;
  tone?: "neutral" | "sky" | "emerald" | "amber" | "rose" | "violet";
  trend?: { value: string; up: boolean };
}) {
  const toneClass = {
    neutral: "text-slate-500",
    sky: "text-sky-600",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
    rose: "text-rose-600",
    violet: "text-violet-600"
  }[tone];

  return (
    <div className="rounded-md border border-border bg-card p-3 shadow-admin">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-normal text-slate-500">{label}</p>
        {Icon ? <Icon className={cn("h-4 w-4", toneClass)} /> : null}
      </div>
      <p className="mt-1.5 text-lg font-semibold text-slate-900">{value}</p>
      <div className="mt-1 flex items-center gap-2">
        {detail ? <p className="text-xs text-slate-500">{detail}</p> : null}
        {trend ? (
          <span className={cn("text-[11px] font-semibold", trend.up ? "text-emerald-600" : "text-rose-600")}>
            {trend.up ? "▲" : "▼"} {trend.value}
          </span>
        ) : null}
      </div>
    </div>
  );
}
