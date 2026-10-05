"use client";

import * as React from "react";
import { Download, Eye, FileText, Printer, ReceiptText, Search, Send } from "lucide-react";
import { DataTable, type Column } from "@/components/data-table";
import { InvoicePreview } from "@/components/invoice-preview";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatRp, formatDate } from "@/lib/format";
import { transactions, type PaymentStatus, type Transaction } from "@/data/mock";
import { cn } from "@/lib/utils";

const sisaOf = (trx: Transaction) => Math.max(trx.total - trx.paid, 0);

export function InvoicePage() {
  const [tab, setTab] = React.useState<PaymentStatus | "Semua">("Semua");
  const [search, setSearch] = React.useState("");
  const [preview, setPreview] = React.useState<Transaction | null>(null);

  const counts = {
    Semua: transactions.length,
    "Belum Dibayar": transactions.filter((t) => t.paymentStatus === "Belum Dibayar").length,
    DP: transactions.filter((t) => t.paymentStatus === "DP").length,
    Lunas: transactions.filter((t) => t.paymentStatus === "Lunas").length
  };

  const filtered = React.useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return transactions
      .filter((t) => tab === "Semua" || t.paymentStatus === tab)
      .filter((t) => keyword.length === 0 || `${t.invoice} ${t.customer}`.toLowerCase().includes(keyword))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [tab, search]);

  const totalNilai = transactions.reduce((s, t) => s + t.total, 0);
  const lunasNilai = transactions.filter((t) => t.paymentStatus === "Lunas").reduce((s, t) => s + t.total, 0);

  const columns: Column<Transaction>[] = [
    {
      key: "invoice",
      header: "No. Invoice",
      width: "150px",
      sortValue: (row) => row.invoice,
      render: (row) => <span className="font-mono text-[11px] font-semibold text-sky-700">{row.invoice}</span>
    },
    { key: "date", header: "Tanggal", sortValue: (row) => row.date, render: (row) => formatDate(row.date) },
    {
      key: "customer",
      header: "Customer",
      sortValue: (row) => row.customer,
      render: (row) => (
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-700">{row.customer}</p>
          <p className="text-[10px] text-slate-400">{row.customerId}</p>
        </div>
      )
    },
    {
      key: "items",
      header: "Item",
      align: "center",
      sortValue: (row) => row.items.length,
      render: (row) => <Badge tone="neutral">{row.items.length} item</Badge>
    },
    { key: "total", header: "Total", align: "right", sortValue: (row) => row.total, render: (row) => formatRp(row.total) },
    {
      key: "paid",
      header: "Dibayar",
      align: "right",
      sortValue: (row) => row.paid,
      render: (row) => <span className="text-emerald-600">{formatRp(row.paid)}</span>
    },
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
    { key: "status", header: "Status", sortValue: (row) => row.paymentStatus, render: (row) => <StatusBadge value={row.paymentStatus} /> },
    {
      key: "action",
      header: "",
      width: "140px",
      align: "right",
      render: (row) => (
        <div onClick={(e) => e.stopPropagation()} className="flex justify-end gap-1">
          <Button size="icon" variant="ghost" title="Lihat" onClick={() => setPreview(row)}>
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button size="icon" variant="ghost" title="Cetak" onClick={() => setPreview(row)}>
            <Printer className="h-3.5 w-3.5" />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-3">
      <PageHeader
        title="Invoice"
        description="Kelola semua invoice penjualan, lihat pratinjau cetak, dan pantau status pembayaran."
        actions={
          <>
            <Button variant="outline">
              <Download className="h-3.5 w-3.5" /> Export PDF
            </Button>
            <Button variant="primary">
              <ReceiptText className="h-3.5 w-3.5" /> Buat Invoice
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Invoice" value={String(transactions.length)} detail="Semua periode" icon={FileText} tone="sky" />
        <StatCard label="Nilai Invoice" value={formatRp(totalNilai)} detail="Akumulasi" icon={ReceiptText} tone="violet" />
        <StatCard label="Sudah Lunas" value={formatRp(lunasNilai)} detail={`${counts.Lunas} invoice`} icon={Send} tone="emerald" />
        <StatCard label="Belum Lunas" value={String(counts["Belum Dibayar"] + counts.DP)} detail="Perlu ditagih" icon={Search} tone="amber" />
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
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari no. invoice / customer…"
          className="w-full max-w-xs"
        />
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        getRowId={(row) => row.invoice}
        onRowClick={setPreview}
        activeRowId={preview?.invoice}
        emptyTitle="Tidak ada invoice"
        emptyDescription="Tidak ada invoice pada filter ini."
      />

      <Drawer
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        title={preview ? `Invoice ${preview.invoice}` : ""}
        description={preview ? `${preview.customer} · ${formatDate(preview.date)}` : ""}
        width="lg"
        footer={
          <>
            <Button onClick={() => setPreview(null)}>Tutup</Button>
            <Button variant="outline">
              <Download className="h-3.5 w-3.5" /> Unduh PDF
            </Button>
            <Button variant="primary" onClick={() => window.print()}>
              <Printer className="h-3.5 w-3.5" /> Cetak
            </Button>
          </>
        }
      >
        {preview ? <InvoicePreview transaction={preview} /> : null}
      </Drawer>
    </div>
  );
}
