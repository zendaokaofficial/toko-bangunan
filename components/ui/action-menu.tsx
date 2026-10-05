"use client";

import * as React from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export type MenuItem = {
  label: string;
  onSelect?: () => void;
  icon?: React.ElementType;
  danger?: boolean;
  disabled?: boolean;
};

/**
 * Menu aksi ringkas (kebab) untuk kolom Action di tabel.
 */
export function ActionMenu({ items, label = "Aksi" }: { items: MenuItem[]; label?: string }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-slate-500 transition-colors hover:border-border hover:bg-slate-100"
        aria-label={label}
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>
      {open ? (
        <div className="absolute right-0 z-30 mt-1 w-44 overflow-hidden rounded-md border border-border bg-white py-1 shadow-lg">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  if (item.disabled) return;
                  item.onSelect?.();
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs transition-colors",
                  item.disabled ? "cursor-not-allowed text-slate-300" : "text-slate-700 hover:bg-slate-50",
                  item.danger && !item.disabled && "text-rose-600 hover:bg-rose-50"
                )}
              >
                {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                {item.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
