"use client";

import * as React from "react";
import {
  BarChart3,
  Boxes,
  Download,
  FileSpreadsheet,
  Printer,
  TrendingUp,
  WalletCards
} from "lucide-react";
import { DataTable, type Column } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber, formatRp } from "@/lib/format";
import { products, salesSeries, transactions, type Product } from "@/data/mock";

type BestSeller = { sku: string; name: string; qty: number; revenue: number; trx: number };

export function LaporanPage() {
  const [period, setPeriod] = React.useState("Minggu Ini");

  const totalSales = transactions.reduce((s, t) => s + t.total, 0);
  const totalPaid = transactions.reduce((s, t) => s + t.paid, 0);
  const totalSisa = totalSales - totalPaid;
  const stockValue = products.reduce((s, p) => s + p.stock * p.cost, 0);

  const bestSellers = React.useMemo<BestSeller[]>(() => {
    const map = new Map<string, BestSeller>();
    transactions.forEach((trx) => {
      trx.items.forEach((item) => {
        const existing = map.get(item.sku) ?? {
          sku: item.sku,
          name: item.name,
          qty: 0,
          revenue: 0,
          trx: 0
        };
        existing.qty += item.qty;
        existing.revenue += item.qty * item.price;
        existing.trx += 1;
        map.set(item.sku, existing);
      });
    });
    return Array.from(map.values()).sort((a, b) => b.qty - a.qty);
  }, []);

  const lowStock = React.useMemo(
    () => products.filter((p) => p.stock <= p.minStock).sort((a, b) => a.stock - b.stock),
    []
  );

  const maxSeries = Math.max(...salesSeries.map((d) => d.value), 1);

  const bestColumns: Column<BestSeller>[] = [
    { key: "sku", header: "SKU", width: "120px", sortValue: (r) => r.sku, render: (r) => <span className="font-mono text-[11px] text-slate-500">{r.sku}</span> },
    { key: "name", header: "Nama Barang", sortValue: (r) => r.name, render: (r) => <span className="text-xs font-medium text-slate-700">{r.name}</span> },
    { key: "trx", header: "Frekuensi", align: "center", sortValue: (r) => r.trx, render: (r) => <span className="text-xs text-slate-600">{r.trx}×</span> },
    { key: "qty", header: "Terjual", align: "right", sortValue: (r) => r.qty, render: (r) => <span className="text-xs font-semibold text-slate-700">{formatNumber(r.qty)}</span> },
    { key: "revenue", header: "Pendapatan", align: "right", sortValue: (r) => r.revenue, render: (r) => <span className="text-xs font-semibold text-emerald-600">{formatRp(r.revenue)}</span> }
  ];

  const stockColumns: Column<Product>[] = [
    { key: "sku", header: "SKU", width: "120px", sortValue: (r) => r.sku, render: (r) => <span className="font-mono text-[11px] text-slate-500">{r.sku}</span> },
    { key: "name", header: "Barang", sortValue: (r) => r.name, render: (r) => <span className="text-xs font-medium text-slate-700">{r.name}</span> },
    { key: "category", header: "Kategori", sortValue: (r) => r.category, render: (r) => <span className="text-xs text-slate-600">{r.category}</span> },
    { key: "stock", header: "Stok", align: "right", sortValue: (r) => r.stock, render: (r) => <span className="text-xs font-semibold text-rose-600">{formatNumber(r.stock)}</span> },
    { key: "minStock", header: "Min", align: "right", sortValue: (r) => r.minStock, render: (r) => <span className="text-xs text-slate-500">{formatNumber(r.minStock)}</span> },
    { key: "value", header: "Nilai HPP", align: "right", sortValue: (r) => r.stock * r.cost, render: (r) => formatRp(r.stock * r.cost) }
  ];

  return (
    <div className="space-y-3">
      <PageHeader
        title="Laporan"
        description="Ringkasan performa penjualan, barang terlaris, nilai persediaan, dan piutang."
        actions={
          <>
            <Button variant="outline">
              <FileSpreadsheet className="h-3.5 w-3.5" /> Export Excel
            </Button>
            <Button variant="primary" onClick={() => window.print()}>
              <Printer className="h-3.5 w-3.5" /> Cetak Laporan
            </Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <Select value={period} onChange={(e) => setPeriod(e.target.value)} className="w-44">
          <option>Hari Ini</option>
          <option>Minggu Ini</option>
          <option>Bulan Ini</option>
          <option>Kuartal Ini</option>
        </Select>
        <span className="text-xs text-slate-400">Periode aktif: {period} (5 – 11 Okt 2026)</span>
        <Button variant="ghost" size="sm" className="ml-auto" title="Unduh ringkasan">
          <Download className="h-3.5 w-3.5" /> Unduh Ringkasan
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Penjualan" value={formatRp(totalSales)} detail={`${transactions.length} transaksi`} icon={TrendingUp} tone="sky" />
        <StatCard label="Penerimaan" value={formatRp(totalPaid)} detail="Kas & transfer" icon={BarChart3} tone="emerald" />
        <StatCard label="Nilai Persediaan" value={formatRp(stockValue)} detail={`${products.length} SKU`} icon={Boxes} tone="violet" />
        <StatCard label="Piutang Berjalan" value={formatRp(totalSisa)} detail="Belum tertagih" icon={WalletCards} tone="rose" />
      </div>

      {/* Grafik penjualan mingguan */}
      <div className="admin-card p-3">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Tren Penjualan Mingguan</h2>
          <span className="text-[11px] text-slate-400">Total minggu: {formatRp(salesSeries.reduce((s, d) => s + d.value, 0))}</span>
        </div>
        <div className="flex h-44 items-end gap-2">
          {salesSeries.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-[10px] text-slate-500">{formatRp(d.value).replace("Rp", "")}</span>
              <div
                className="w-full rounded-t bg-sky-500/80 transition-all hover:bg-sky-600"
                style={{ height: `${Math.max((d.value / maxSeries) * 100, 4)}%` }}
                title={`${d.day} ${d.date}: ${formatRp(d.value)} (${d.trx} trx)`}
              />
              <span className="text-[10px] font-medium text-slate-500">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      <Tabs defaultValue="terlaris">
        <TabsList>
          <TabsTrigger value="terlaris">Barang Terlaris</TabsTrigger>
          <TabsTrigger value="persediaan">Nilai Persediaan</TabsTrigger>
          <TabsTrigger value="restok">Perlu Restok</TabsTrigger>
        </TabsList>

        <TabsContent value="terlaris" className="mt-3">
          <DataTable
            columns={bestColumns}
            rows={bestSellers}
            getRowId={(r) => r.sku}
            emptyTitle="Belum ada penjualan"
            emptyDescription="Data barang terlaris akan tampil setelah ada transaksi."
          />
        </TabsContent>

        <TabsContent value="persediaan" className="mt-3">
          <DataTable
            columns={stockColumns}
            rows={[...products].sort((a, b) => b.stock * b.cost - a.stock * a.cost)}
            getRowId={(r) => r.sku}
            emptyTitle="Belum ada produk"
            emptyDescription="Data persediaan belum tersedia."
          />
        </TabsContent>

        <TabsContent value="restok" className="mt-3">
          <DataTable
            columns={stockColumns}
            rows={lowStock}
            getRowId={(r) => r.sku}
            emptyTitle="Semua stok aman"
            emptyDescription="Tidak ada barang yang perlu segera direstok."
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
