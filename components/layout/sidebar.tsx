"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Boxes,
  ClipboardList,
  LayoutDashboard,
  PackagePlus,
  ReceiptText,
  ShieldCheck,
  Truck,
  Upload,
  Users,
  WalletCards,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { navForRole, type NavItem } from "@/lib/rbac";
import { useRole } from "@/components/layout/role-context";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Boxes,
  PackagePlus,
  Upload,
  ClipboardList,
  WalletCards,
  Truck,
  ReceiptText,
  Users,
  BarChart3,
  ShieldCheck
};

const groupOrder: NavItem["group"][] = ["Operasional", "Keuangan", "Pengaturan"];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { role } = useRole();
  const items = navForRole(role);

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">TB</span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-slate-900">Toko Bangunan</p>
          <p className="text-[11px] text-slate-500">Sistem operasional</p>
        </div>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto px-2 py-3">
        {groupOrder.map((group) => {
          const groupItems = items.filter((item) => item.group === group);
          if (groupItems.length === 0) return null;
          return (
            <div key={group}>
              <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">{group}</p>
              <div className="space-y-0.5">
                {groupItems.map((item) => {
                  const Icon = iconMap[item.icon] ?? LayoutDashboard;
                  const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.key}
                      href={item.href}
                      onClick={onNavigate}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-medium transition-colors",
                        active ? "bg-sky-50 text-sky-800" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <Icon className={cn("h-4 w-4", active ? "text-sky-700" : "text-slate-400")} />
                      <span className="flex-1 truncate">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-border px-4 py-3">
        <p className="text-[11px] text-slate-400">Prototype · v0.2</p>
        <p className="text-[11px] text-slate-400">Dummy data lokal</p>
      </div>
    </div>
  );
}
