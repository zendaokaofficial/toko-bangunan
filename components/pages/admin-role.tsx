"use client";

import * as React from "react";
import {
  Check,
  KeyRound,
  ShieldCheck,
  UserCog,
  UserPlus,
  X
} from "lucide-react";
import { DataTable, type Column } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { TableToolbar } from "@/components/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Modal } from "@/components/ui/modal";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { formatDateTime } from "@/lib/format";
import { admins, type AdminUser, type Role } from "@/data/mock";
import { allRoles, navForRole } from "@/lib/rbac";
import { cn } from "@/lib/utils";

/* Matriks izin per modul × role */
const moduleMatrix: { module: string; roles: Role[] }[] = [
  { module: "Dashboard", roles: ["Super Admin", "Admin Stock", "Admin Pembayaran", "Admin Kirim"] },
  { module: "Katalog Barang", roles: ["Super Admin", "Admin Stock"] },
  { module: "Stok", roles: ["Super Admin", "Admin Stock"] },
  { module: "Upload Data", roles: ["Super Admin", "Admin Stock"] },
  { module: "Transaksi", roles: ["Super Admin", "Admin Stock", "Admin Pembayaran"] },
  { module: "Pembayaran", roles: ["Super Admin", "Admin Pembayaran"] },
  { module: "Pengiriman", roles: ["Super Admin", "Admin Kirim"] },
  { module: "Invoice", roles: ["Super Admin", "Admin Pembayaran"] },
  { module: "Customer", roles: ["Super Admin", "Admin Pembayaran", "Admin Kirim"] },
  { module: "Laporan", roles: ["Super Admin"] },
  { module: "Admin & Role", roles: ["Super Admin"] }
];

const roleTone: Record<Role, "purple" | "info" | "success" | "warning"> = {
  "Super Admin": "purple",
  "Admin Stock": "info",
  "Admin Pembayaran": "success",
  "Admin Kirim": "warning"
};

function AdminForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    role: "Admin Stock" as Role,
    password: ""
  });

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <label className="col-span-2 flex flex-col gap-1">
          <Label>Nama Lengkap</Label>
          <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="mis. Arman Saputra" />
        </label>
        <label className="col-span-2 flex flex-col gap-1">
          <Label>Email</Label>
          <Input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="nama@tokobangunan.local"
          />
        </label>
        <label className="flex flex-col gap-1">
          <Label>Role</Label>
          <Select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })}>
            {allRoles.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Select>
        </label>
        <label className="flex flex-col gap-1">
          <Label>Password Sementara</Label>
          <Input
            required
            type="text"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="min. 8 karakter"
          />
        </label>
      </div>
      <p className="rounded-md bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
        User wajib mengganti password saat login pertama. Role menentukan modul yang dapat diakses (lihat matriks izin).
      </p>
      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button type="submit" variant="primary">
          Simpan User
        </Button>
      </div>
    </form>
  );
}

export function AdminRolePage() {
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState<Role | "Semua">("Semua");
  const [selected, setSelected] = React.useState<AdminUser | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return admins.filter((u) => {
      const matchRole = roleFilter === "Semua" || u.role === roleFilter;
      const matchKeyword = keyword.length === 0 || `${u.name} ${u.email}`.toLowerCase().includes(keyword);
      return matchRole && matchKeyword;
    });
  }, [search, roleFilter]);

  const columns: Column<AdminUser>[] = [
    {
      key: "name",
      header: "Nama",
      sortValue: (r) => r.name,
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-sky-100 text-[10px] font-semibold text-sky-700">
            {r.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-slate-700">{r.name}</p>
            <p className="text-[10px] text-slate-400">{r.id}</p>
          </div>
        </div>
      )
    },
    { key: "email", header: "Email", sortValue: (r) => r.email, render: (r) => <span className="text-xs text-slate-600">{r.email}</span> },
    { key: "role", header: "Role", sortValue: (r) => r.role, render: (r) => <Badge tone={roleTone[r.role]}>{r.role}</Badge> },
    {
      key: "status",
      header: "Status",
      sortValue: (r) => r.status,
      render: (r) => (
        <span className="inline-flex items-center gap-1.5 text-xs">
          <span className={cn("h-1.5 w-1.5 rounded-full", r.status === "Aktif" ? "bg-emerald-500" : "bg-slate-300")} />
          <span className={r.status === "Aktif" ? "text-emerald-600" : "text-slate-400"}>{r.status}</span>
        </span>
      )
    },
    {
      key: "lastLogin",
      header: "Login Terakhir",
      sortValue: (r) => r.lastLogin,
      render: (r) => <span className="text-xs text-slate-500">{formatDateTime(r.lastLogin)}</span>
    },
    {
      key: "action",
      header: "",
      width: "150px",
      align: "right",
      render: (r) => (
        <div onClick={(e) => e.stopPropagation()} className="flex justify-end gap-1">
          <Button size="sm" variant="outline" onClick={() => setSelected(r)}>
            Kelola
          </Button>
        </div>
      )
    }
  ];

  const activeCount = admins.filter((u) => u.status === "Aktif").length;

  return (
    <div className="space-y-3">
      <PageHeader
        title="Admin & Role"
        description="Kelola user admin, tetapkan role, dan atur hak akses per modul."
        actions={
          <Button variant="primary" onClick={() => setFormOpen(true)}>
            <UserPlus className="h-3.5 w-3.5" /> Tambah User
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total User" value={String(admins.length)} detail="Semua role" icon={UserCog} tone="sky" />
        <StatCard label="User Aktif" value={String(activeCount)} detail="Dapat login" icon={ShieldCheck} tone="emerald" />
        <StatCard label="Super Admin" value={String(admins.filter((u) => u.role === "Super Admin").length)} detail="Akses penuh" icon={KeyRound} tone="violet" />
        <StatCard label="Role Terdefinisi" value={String(allRoles.length)} detail="Matriks izin" icon={ShieldCheck} tone="amber" />
      </div>

      <TableToolbar search={search} onSearch={setSearch} placeholder="Cari nama atau email…">
        <Select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as Role | "Semua")}
          className="w-44"
        >
          <option value="Semua">Semua Role</option>
          {allRoles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </Select>
      </TableToolbar>

      <DataTable
        columns={columns}
        rows={filtered}
        getRowId={(r) => r.id}
        onRowClick={setSelected}
        activeRowId={selected?.id}
        emptyTitle="Tidak ada user"
        emptyDescription="Tidak ada user yang cocok dengan filter."
      />

      {/* Matriks izin role */}
      <div className="admin-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <h2 className="text-sm font-semibold text-slate-800">Matriks Hak Akses Modul</h2>
          <span className="text-[11px] text-slate-400">Berdasarkan konfigurasi RBAC</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-xs">
            <thead>
              <tr className="border-b border-border bg-slate-50/70">
                <th className="px-3 py-2 text-left font-semibold text-slate-500">Modul</th>
                {allRoles.map((r) => (
                  <th key={r} className="px-3 py-2 text-center font-semibold text-slate-500">
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {moduleMatrix.map((row) => (
                <tr key={row.module} className="border-b border-border last:border-0">
                  <td className="px-3 py-2 font-medium text-slate-700">{row.module}</td>
                  {allRoles.map((r) => {
                    const allowed = row.roles.includes(r);
                    return (
                      <td key={r} className="px-3 py-2 text-center">
                        {allowed ? (
                          <Check className="mx-auto h-3.5 w-3.5 text-emerald-500" />
                        ) : (
                          <X className="mx-auto h-3.5 w-3.5 text-slate-300" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drawer kelola user */}
      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ""}
        description={selected ? `${selected.id} · ${selected.email}` : ""}
        width="md"
        footer={
          <>
            <Button onClick={() => setSelected(null)}>Tutup</Button>
            <Button variant="outline">Reset Password</Button>
            <Button variant="primary">Simpan Perubahan</Button>
          </>
        }
      >
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge tone={roleTone[selected.role]}>{selected.role}</Badge>
              <Badge tone={selected.status === "Aktif" ? "success" : "neutral"}>{selected.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <Label>Nama</Label>
                <Input defaultValue={selected.name} />
              </label>
              <label className="flex flex-col gap-1">
                <Label>Email</Label>
                <Input defaultValue={selected.email} />
              </label>
              <label className="flex flex-col gap-1">
                <Label>Role</Label>
                <Select defaultValue={selected.role}>
                  {allRoles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </Select>
              </label>
              <label className="flex flex-col gap-1">
                <Label>Status Akun</Label>
                <Select defaultValue={selected.status}>
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </Select>
              </label>
            </div>

            <div className="rounded-md border border-border p-3">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                Modul yang dapat diakses
              </p>
              <div className="flex flex-wrap gap-1.5">
                {navForRole(selected.role).map((item) => (
                  <span key={item.key} className="rounded-full bg-sky-50 px-2.5 py-1 text-[11px] text-sky-700">
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-md bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
              Login terakhir: {formatDateTime(selected.lastLogin)}
            </div>
          </div>
        ) : null}
      </Drawer>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Tambah User Admin"
        description="Buat akun admin baru dan tetapkan role-nya."
        size="md"
      >
        <AdminForm onClose={() => setFormOpen(false)} />
      </Modal>
    </div>
  );
}
