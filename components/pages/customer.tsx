"use client";

import * as React from "react";
import {
  Building2,
  MapPin,
  Phone,
  ReceiptText,
  UserPlus,
  Users,
  WalletCards
} from "lucide-react";
import { DataTable, type Column } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { TableToolbar } from "@/components/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Modal } from "@/components/ui/modal";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatRp, formatDate } from "@/lib/format";
import { customers, transactions, type Customer } from "@/data/mock";
import { cn } from "@/lib/utils";

type CustomerType = Customer["type"];

const typeTone: Record<CustomerType, "info" | "purple" | "warning"> = {
  Retail: "info",
  Kontraktor: "purple",
  Proyek: "warning"
};

function CustomerForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = React.useState({
    name: "",
    phone: "",
    city: "",
    address: "",
    type: "Retail" as CustomerType
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
        <label className="col-span-2 flex flex-col gap-1 sm:col-span-1">
          <Label>Nama Customer / Instansi</Label>
          <Input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="mis. CV Karya Mandiri"
          />
        </label>
        <label className="col-span-2 flex flex-col gap-1 sm:col-span-1">
          <Label>No. HP / WhatsApp</Label>
          <Input
            required
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="08xx-xxxx-xxxx"
          />
        </label>
        <label className="flex flex-col gap-1">
          <Label>Kota</Label>
          <Input
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            placeholder="Bekasi"
          />
        </label>
        <label className="flex flex-col gap-1">
          <Label>Tipe Customer</Label>
          <Select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as CustomerType })}>
            <option value="Retail">Retail</option>
            <option value="Kontraktor">Kontraktor</option>
            <option value="Proyek">Proyek</option>
          </Select>
        </label>
        <label className="col-span-2 flex flex-col gap-1">
          <Label>Alamat Lengkap</Label>
          <Textarea
            rows={3}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            placeholder="Jalan, nomor, blok, patokan"
          />
        </label>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button type="submit" variant="primary">
          Simpan Customer
        </Button>
      </div>
    </form>
  );
}

export function CustomerPage() {
  const [search, setSearch] = React.useState("");
  const [typeFilter, setTypeFilter] = React.useState<CustomerType | "Semua">("Semua");
  const [piutangOnly, setPiutangOnly] = React.useState(false);
  const [selected, setSelected] = React.useState<Customer | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);

  const filtered = React.useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return customers.filter((c) => {
      const matchType = typeFilter === "Semua" || c.type === typeFilter;
      const matchKeyword =
        keyword.length === 0 || `${c.name} ${c.phone} ${c.city}`.toLowerCase().includes(keyword);
      const matchPiutang = !piutangOnly || c.outstanding > 0;
      return matchType && matchKeyword && matchPiutang;
    });
  }, [search, typeFilter, piutangOnly]);

  const totalPiutang = customers.reduce((s, c) => s + c.outstanding, 0);
  const totalTrx = customers.reduce((s, c) => s + c.transactions, 0);

  const columns: Column<Customer>[] = [
    {
      key: "id",
      header: "Kode",
      width: "90px",
      sortValue: (row) => row.id,
      render: (row) => <span className="font-mono text-[11px] text-slate-500">{row.id}</span>
    },
    {
      key: "name",
      header: "Nama Customer",
      sortValue: (row) => row.name,
      render: (row) => (
        <div className="min-w-0">
          <p className="text-xs font-semibold text-slate-700">{row.name}</p>
          <p className="text-[10px] text-slate-400">
            {row.address}, {row.city}
          </p>
        </div>
      )
    },
    { key: "phone", header: "No. HP", sortValue: (row) => row.phone, render: (row) => <span className="text-xs text-slate-600">{row.phone}</span> },
    { key: "type", header: "Tipe", sortValue: (row) => row.type, render: (row) => <Badge tone={typeTone[row.type]}>{row.type}</Badge> },
    {
      key: "transactions",
      header: "Transaksi",
      align: "center",
      sortValue: (row) => row.transactions,
      render: (row) => <span className="text-xs font-medium text-slate-600">{row.transactions}×</span>
    },
    {
      key: "outstanding",
      header: "Outstanding",
      align: "right",
      sortValue: (row) => row.outstanding,
      render: (row) => (
        <span className={cn("text-xs font-semibold", row.outstanding > 0 ? "text-rose-600" : "text-emerald-600")}>
          {row.outstanding > 0 ? formatRp(row.outstanding) : "Lunas"}
        </span>
      )
    },
    { key: "since", header: "Sejak", sortValue: (row) => row.since, render: (row) => <span className="text-xs text-slate-500">{formatDate(row.since)}</span> },
    {
      key: "action",
      header: "",
      width: "90px",
      align: "right",
      render: (row) => (
        <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
          <Button size="sm" variant="outline" onClick={() => setSelected(row)}>
            Detail
          </Button>
        </div>
      )
    }
  ];

  const history = selected ? transactions.filter((t) => t.customerId === selected.id) : [];

  return (
    <div className="space-y-3">
      <PageHeader
        title="Customer"
        description="Database pelanggan retail, kontraktor, dan proyek beserta riwayat transaksi dan piutang."
        actions={
          <Button variant="primary" onClick={() => setFormOpen(true)}>
            <UserPlus className="h-3.5 w-3.5" /> Tambah Customer
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Customer" value={String(customers.length)} detail="Semua tipe" icon={Users} tone="sky" />
        <StatCard label="Kontraktor & Proyek" value={String(customers.filter((c) => c.type !== "Retail").length)} detail="Pelanggan B2B" icon={Building2} tone="violet" />
        <StatCard label="Total Transaksi" value={String(totalTrx)} detail="Akumulasi" icon={ReceiptText} tone="emerald" />
        <StatCard label="Total Piutang" value={formatRp(totalPiutang)} detail={`${customers.filter((c) => c.outstanding > 0).length} customer`} icon={WalletCards} tone="rose" />
      </div>

      <TableToolbar search={search} onSearch={setSearch} placeholder="Cari nama, no HP, atau kota…">
        <Select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as CustomerType | "Semua")}
          className="w-40"
        >
          <option value="Semua">Semua Tipe</option>
          <option value="Retail">Retail</option>
          <option value="Kontraktor">Kontraktor</option>
          <option value="Proyek">Proyek</option>
        </Select>
        <Button
          variant={piutangOnly ? "primary" : "outline"}
          size="sm"
          onClick={() => setPiutangOnly((v) => !v)}
        >
          Ada Piutang
        </Button>
      </TableToolbar>

      <DataTable
        columns={columns}
        rows={filtered}
        getRowId={(row) => row.id}
        onRowClick={setSelected}
        activeRowId={selected?.id}
        emptyTitle="Tidak ada customer"
        emptyDescription="Tidak ada customer yang cocok dengan pencarian & filter."
      />

      {/* Drawer detail customer */}
      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ""}
        description={selected ? `${selected.id} · ${selected.type}` : ""}
        width="md"
        footer={
          <>
            <Button onClick={() => setSelected(null)}>Tutup</Button>
            <Button variant="outline">
              <ReceiptText className="h-3.5 w-3.5" /> Buat Transaksi
            </Button>
          </>
        }
      >
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge tone={typeTone[selected.type]}>{selected.type}</Badge>
              {selected.outstanding > 0 ? (
                <Badge tone="danger">Piutang {formatRp(selected.outstanding)}</Badge>
              ) : (
                <Badge tone="success">Tidak ada piutang</Badge>
              )}
            </div>

            <div className="space-y-2 rounded-md border border-border p-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="h-3.5 w-3.5 text-slate-400" /> {selected.phone}
              </div>
              <div className="flex items-start gap-2 text-slate-600">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                {selected.address}, {selected.city}
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Users className="h-3.5 w-3.5 text-slate-400" /> Customer sejak {formatDate(selected.since)}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-md border border-border p-2">
                <p className="text-[10px] uppercase tracking-wide text-slate-400">Transaksi</p>
                <p className="text-sm font-semibold text-slate-800">{selected.transactions}</p>
              </div>
              <div className="rounded-md border border-border p-2">
                <p className="text-[10px] uppercase tracking-wide text-slate-400">Outstanding</p>
                <p className={cn("text-sm font-semibold", selected.outstanding > 0 ? "text-rose-600" : "text-emerald-600")}>
                  {formatRp(selected.outstanding)}
                </p>
              </div>
              <div className="rounded-md border border-border p-2">
                <p className="text-[10px] uppercase tracking-wide text-slate-400">Tipe</p>
                <p className="text-sm font-semibold text-slate-800">{selected.type}</p>
              </div>
            </div>

            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-800">Riwayat Transaksi</h3>
              {history.length === 0 ? (
                <p className="rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-slate-400">
                  Belum ada transaksi tercatat untuk customer ini.
                </p>
              ) : (
                <div className="divide-y divide-border rounded-md border border-border">
                  {history.map((trx) => (
                    <div key={trx.invoice} className="flex items-center justify-between gap-2 px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="font-mono text-[11px] font-semibold text-sky-700">{trx.invoice}</p>
                        <p className="text-[10px] text-slate-400">{formatDate(trx.date)} · {trx.items.length} item</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-700">{formatRp(trx.total)}</span>
                        <StatusBadge value={trx.paymentStatus} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </Drawer>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Tambah Customer Baru"
        description="Lengkapi data customer. Field bertanda wajib harus diisi."
        size="md"
      >
        <CustomerForm onClose={() => setFormOpen(false)} />
      </Modal>
    </div>
  );
}
