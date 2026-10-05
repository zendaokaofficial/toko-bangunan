"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

/**
 * Baris toolbar untuk tabel: input pencarian + slot filter/aksi di kanan.
 */
export function TableToolbar({
  search,
  onSearch,
  placeholder = "Cari…",
  children
}: {
  search: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-card p-2 shadow-admin">
      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-2 top-2 h-4 w-4 text-slate-400" />
        <Input className="pl-8" value={search} onChange={(event) => onSearch(event.target.value)} placeholder={placeholder} />
      </div>
      {children}
    </div>
  );
}
