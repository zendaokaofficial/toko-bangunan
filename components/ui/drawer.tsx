"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Drawer panel dari kanan, dipakai untuk detail barang, pembayaran, dsb.
 */
export function Drawer({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  width = "md"
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: "sm" | "md" | "lg";
}) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const w = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-xl" }[width];

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px]" onClick={onClose} aria-hidden />
      <div className={cn("fixed inset-y-0 right-0 flex w-full flex-col border-l border-border bg-white shadow-2xl", w)}>
        <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
            {description ? <p className="mt-0.5 text-xs text-slate-500">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 py-4">{children}</div>
        {footer ? <div className="flex items-center justify-end gap-2 border-t border-border px-4 py-3">{footer}</div> : null}
      </div>
    </div>
  );
}
