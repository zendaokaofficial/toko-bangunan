"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { RoleProvider, useRole } from "@/components/layout/role-context";
import { navForRole } from "@/lib/rbac";
import { EmptyState } from "@/components/ui/empty-state";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role } = useRole();
  const allowed = navForRole(role);

  const isAllowed =
    pathname === "/" ||
    allowed.some((item) => item.href !== "/" && pathname.startsWith(item.href));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 border-r border-border lg:block">
        <Sidebar />
      </aside>
      <div className="lg:pl-60">
        <Topbar />
        <main className="mx-auto w-full max-w-[1500px] p-3 sm:p-4">
          {isAllowed ? (
            children
          ) : (
            <div className="rounded-md border border-border bg-white shadow-admin">
              <EmptyState
                icon={ShieldAlert}
                title="Role ini tidak punya akses ke halaman tersebut"
                description={`Role ${role} dibatasi hanya untuk modul yang relevan. Ganti role di topbar untuk meninjau modul lain.`}
                action={
                  <Button variant="primary" asChild>
                    <a href="/">Kembali ke Dashboard</a>
                  </Button>
                }
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      <Shell>{children}</Shell>
    </RoleProvider>
  );
}
