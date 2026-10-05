"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumb({ title }: { title: string }) {
  return (
    <nav className="flex items-center gap-1 text-xs text-slate-500" aria-label="Breadcrumb">
      <Link href="/" className="hover:text-slate-700">
        Admin
      </Link>
      <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
      <span className="font-medium text-slate-700">{title}</span>
    </nav>
  );
}
