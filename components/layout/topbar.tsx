"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, Search, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useRole } from "@/components/layout/role-context";
import { Sidebar } from "@/components/layout/sidebar";
import { allRoles } from "@/lib/rbac";
import type { Role } from "@/data/mock";

const roleHint: Record<Role, string> = {
  "Super Admin": "Akses penuh semua modul",
  "Admin Stock": "Katalog, stok, upload data",
  "Admin Pembayaran": "Transaksi, pembayaran, invoice",
  "Admin Kirim": "Pengiriman dan surat jalan"
};

export function Topbar() {
  const { role, setRole } = useRole();
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-white px-3 sm:px-4">
        <button
          type="button"
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-slate-600 lg:hidden"
          onClick={() => setOpen(true)}
          aria-label="Buka menu"
        >
          <Menu className="h-4 w-4" />
        </button>

        <Link href="/" className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
          <ShieldCheck className="h-4 w-4 text-slate-400" />
          <span>Admin</span>
        </Link>

        <div className="relative ml-auto hidden w-64 md:block">
          <Search className="pointer-events-none absolute left-2 top-2 h-4 w-4 text-slate-400" />
          <input
            className="h-8 w-full rounded-md border border-input bg-white pl-8 pr-3 text-xs outline-none placeholder:text-slate-400 focus:border-sky-500"
            placeholder="Cari cepat (SKU, invoice, customer)"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 text-[11px] text-slate-500 xl:flex">
            <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold text-slate-600">{roleHint[role]}</span>
          </div>
          <div className="relative">
            <Select
              className="w-44 pr-7 capitalize"
              value={role}
              onChange={(event) => setRole(event.target.value as Role)}
              aria-label="Pilih role admin"
            >
              {allRoles.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
            <ChevronDown className="pointer-events-none absolute right-2 top-2 h-4 w-4 text-slate-400" />
          </div>
          <Button variant="primary" className="hidden sm:inline-flex">
            Simpan Draft
          </Button>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-slate-900/40" onClick={() => setOpen(false)} aria-hidden />
          <div className="fixed inset-y-0 left-0 w-64 border-r border-border bg-white shadow-xl">
            <div className="flex items-center justify-end px-2 pt-2">
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100"
                onClick={() => setOpen(false)}
                aria-label="Tutup menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="h-[calc(100%-40px)]">
              <Sidebar onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
