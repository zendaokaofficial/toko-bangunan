"use client";

import * as React from "react";
import Link from "next/link";
import {
  Banknote,
  CheckCircle2,
  Clock,
  Receipt,
  Upload,
  WalletCards,
  X
} from "lucide-react";
import { DataTable, type Column } from "@/components/data-table";
import { InvoicePreview } from "@/components/invoice-preview";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { TableToolbar } from "@/components/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatRp, formatDate } from "@/lib/format";
import { payments, transactions, type PaymentMethod, type Transaction } from "@/data/mock";
import { cn } from "@/lib/utils";

const sisaOf = (trx: Transaction) => Math.max(trx.total - trx.paid, 0);

export function PembayaranPage() {
  const [tab, setTab] = React.useState<"Belum Dibayar" | "DP" | "Lunas" | "Semua">("Semua");
  const [search, setSearch] = React.useState("");
  const [selected, setSelected] = React.useState<Transaction | null>(null);
  const [preview, setPreview] = React.useState<Transaction | null>(null);

  // State input pelunasan di dalam drawer.
  const [amount, setAmount] = React.useState("");
  const [method, setMethod] = React.useState<PaymentMethod>("Transfer Manual");
  const [proof, setProof] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (selected) {
      setAmount(String(sisaOf(selected)));
      setMethod(selected.paymentMethod === "Cash" ? "Cash" : "Transfer Manual");
      setProof(null);
    }
  }, [selected]);

  const counts = {
    "Belum Dibayar": transactions.filter((t) => t.paymentStatus === "Belum Dibayar").length,
    DP: transactions.filter((t) => t.paymentStatus === "DP").length,
    Lunas: transactions.filter((t) => t.paymentStatus === "Lunas").length,
    Semua: transactions.length
  };

  const filtered = React.useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return transactions.filter((trx) => {
      const matchTab = tab === "Semua" || trx.paymentStatus === tab;
      const matchKeyword = keyword.length === 0 || `${trx.invoice} ${trx.customer}`.toLowerCase().includes(keyword);
      return matchTab && matchKeyword;
    });
  }, [tab, search]);

  const totalTagihan = transactions.reduce((sum, t) => sum + t.total, 0);
  const totalDibayar = transactions.reduce((sum, t) => sum + t.paid, 0);
  const totalSisa = totalTagihan - totalDibayar;

  const columns: Column<Transaction>[] = [
    {
      key: "invoice",
      header: "Invoice",
      width: "140px",
      sortValue: (row) => row.invoice,
      render: (row) => <span className="font-mono text-[11px] font-semibold text-sky-700">{row.invoice}</span>
    },
    { key: "date", header: "Tanggal", sortValue: (row) => row.date, render: (row) => formatDate(row.date) },
    { key: "customer", header: "Customer", sortValue: (row) => row.customer, render: (row) => <span className="text-xs font-medium text-slate-700">{row.customer}</span> },
    { key: "total", header: "Total Tagihan", align: "right", sortValue: (row) => row.total, render: (row) => formatRp(row.total) },
    { key: "paid", header: "Dibayar", align: "right", sortValue: (row) => row.paid, render: (row) => <span className="text-emerald-600">{formatRp(row.paid)}</span> },
    {
      key: "sisa",
      header: "Sisa",
      align: "right",
      sortValue: (row) => sisaOf(row),
      render: (row) => {
        const sisa = sisaOf(row);
        return <span className={cn("font-semibold", sisa > 0 ? "text-rose-600" : "text-emerald-600")}>{formatRp(sisa)}</span>;
      }
    },
    { key: "status", header: "Status", render: (row) => <StatusBadge value={row.paymentStatus} />, sortValue: (row) => row.paymentStatus },
    { key: "method", header: "Metode", render: (row) => <span className="text-xs text-slate-500">{row.paymentMethod}</span>, sortValue: (row) => row.paymentMethod },
    {
      key: "action",
      header: "",
      width: "120px",
      align: "right",
      render: (row) => (
        <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
          <Button
            size="sm"
            variant={sisaOf(row) > 0 ? "primary" : "outline"}
            onClick={() => setSelected(row)}
          >
            {sisaOf(row) > 0 ? "Bayar" : "Detail"}
          </Button>
        </div>
      )
    }
  ];

  const history = selected ? payments.filter((p) => p.invoice === selected.invoice) : [];
  const sisaSelected = selected ? sisaOf(selected) : 0;
  const inputAmount = Number(amount || 0);
  const afterPay = Math.max(sisaSelected - inputAmount, 0);

  return (
    <div className="space-y-3">
      <PageHeader
        title="Pembayaran"
        description="Pantau tagihan, catat DP dan pelunasan, serta unggah bukti transfer dari customer."
        actions={
          <Button variant="outline" asChild>
            <Link href="/invoice">
              <Receipt className="h-3.5 w-3.5" /> Lihat Invoice
            </Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Tagihan" value={formatRp(totalTagihan)} detail={`${transactions.length} invoice`} icon={Receipt} tone="sky" />
        <StatCard label="Sudah Dibayar" value={formatRp(totalDibayar)} detail="Akumulasi penerimaan" icon={Banknote} tone="emerald" />
        <StatCard label="Piutang" value={formatRp(totalSisa)} detail="Sisa belum tertagih" icon={WalletCards} tone="amber" />
        <StatCard label="Transaksi DP" value={String(counts.DP)} detail={`${counts["Belum Dibayar"]} belum dibayar`} icon={Clock} tone="rose" />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
          <TabsList>
            <TabsTrigger value="Semua">Semua ({counts.Semua})</TabsTrigger>
            <TabsTrigger value="Belum Dibayar">Belum Dibayar ({counts["Belum Dibayar"]})</TabsTrigger>
            <TabsTrigger value="DP">DP ({counts.DP})</TabsTrigger>
            <TabsTrigger value="Lunas">Lunas ({counts.Lunas})</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="text-xs text-slate-500">{filtered.length} invoice ditampilkan</div>
      </div>

      <TableToolbar search={search} onSearch={setSearch} placeholder="Cari invoice atau nama customer…" />

      <DataTable
        columns={columns}
        rows={filtered}
        getRowId={(row) => row.invoice}
        onRowClick={setSelected}
        activeRowId={selected?.invoice}
        emptyTitle="Tidak ada tagihan"
        emptyDescription="Tidak ada transaksi pada tab ini."
      />

      {/* Drawer detail pembayaran */}
      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? `Pembayaran ${selected.invoice}` : ""}
        description={selected ? `${selected.customer} · ${formatDate(selected.date)}` : ""}
        width="md"
        footer={
          <>
            <Button onClick={() => setSelected(null)}>Tutup</Button>
            <Button
              variant="primary"
              disabled={sisaSelected === 0}
              onClick={() => {
                setPreview(selected);
                setSelected(null);
              }}
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Simpan Pembayaran
            </Button>
          </>
        }
      >
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <StatusBadge value={selected.paymentStatus} />
              <Badge tone="neutral">{selected.paymentMethod}</Badge>
              <Badge tone="neutral">Admin: {selected.admin}</Badge>
            </div>

            <div className="grid grid-cols-3 gap-3 rounded-md border border-border p-3 text-center">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Total</p>
                <p className="text-sm font-semibold text-slate-800">{formatRp(selected.total)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Dibayar</p>
                <p className="text-sm font-semibold text-emerald-600">{formatRp(selected.paid)}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Sisa</p>
                <p className={cn("text-sm font-semibold", sisaSelected > 0 ? "text-rose-600" : "text-emerald-600")}>
                  {formatRp(sisaSelected)}
                </p>
              </div>
            </div>

            {/* Riwayat pembayaran */}
            <div>
              <h3 className="mb-2 text-sm font-semibold text-slate-800">Riwayat Pembayaran</h3>
              {history.length === 0 ? (
                <p className="rounded-md border border-dashed border-border px-3 py-4 text-center text-xs text-slate-400">
                  Belum ada pembayaran tercatat untuk invoice ini.
                </p>
              ) : (
                <div className="divide-y divide-border rounded-md border border-border">
                  {history.map((pay) => (
                    <div key={pay.id} className="flex items-center justify-between gap-2 px-3 py-2.5">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-700">
                          {formatRp(pay.amount)} · {pay.method}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {pay.date} · {pay.admin}
                          {pay.note ? ` · ${pay.note}` : ""}
                        </p>
                      </div>
                      {pay.proofName ? <Badge tone="info">{pay.proofName}</Badge> : null}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form pembayaran baru */}
            {sisaSelected > 0 ? (
              <div className="space-y-3 rounded-md border border-border p-3">
                <h3 className="text-sm font-semibold text-slate-800">Catat Pembayaran Baru</h3>
                <div className="grid grid-cols-2 gap-3">
                  <label className="flex flex-col gap-1">
                    <Label>Jumlah Bayar (Rp)</Label>
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      max={sisaSelected}
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    <Label>Metode</Label>
                    <Select value={method} onChange={(e) => setMethod(e.target.value as PaymentMethod)}>
                      <option value="Cash">Cash</option>
                      <option value="Transfer Manual">Transfer Manual</option>
                      <option value="QRIS" disabled>
                        QRIS (segera hadir)
                      </option>
                      <option value="Virtual Account" disabled>
                        Virtual Account (segera hadir)
                      </option>
                    </Select>
                  </label>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => setAmount(String(sisaSelected))}>
                    Lunasi sisa ({formatRp(sisaSelected)})
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setAmount(String(Math.round(selected.total / 2)))}>
                    Isi 50%
                  </Button>
                </div>

                <div>
                  <Label>Bukti Transfer</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => setProof("bukti-transfer.jpg")}>
                      <Upload className="h-3.5 w-3.5" /> Pilih File
                    </Button>
                    {proof ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] text-slate-600">
                        {proof}
                        <button type="button" onClick={() => setProof(null)} aria-label="Hapus bukti">
                          <X className="h-3 w-3 text-slate-400 hover:text-rose-500" />
                        </button>
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Opsional untuk Cash, disarankan untuk Transfer.</span>
                    )}
                  </div>
                </div>

                <div className="rounded-md bg-slate-50 px-3 py-2 text-xs">
                  <span className="text-slate-500">Sisa setelah pembayaran ini:</span>{" "}
                  <strong className={afterPay > 0 ? "text-rose-600" : "text-emerald-600"}>{formatRp(afterPay)}</strong>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-700">
                <CheckCircle2 className="h-4 w-4" /> Invoice ini sudah lunas.
              </div>
            )}
          </div>
        ) : null}
      </Drawer>

      {/* Pratinjau invoice setelah pembayaran */}
      <Drawer
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        title="Pratinjau Invoice Terbaru"
        description={preview ? `${preview.invoice} · ${preview.customer}` : ""}
        width="lg"
        footer={
          <>
            <Button onClick={() => setPreview(null)}>Tutup</Button>
            <Button variant="primary" onClick={() => window.print()}>
              Cetak Invoice
            </Button>
          </>
        }
      >
        {preview ? <InvoicePreview transaction={preview} /> : null}
      </Drawer>
    </div>
  );
}
