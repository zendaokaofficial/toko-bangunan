"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Boxes,
  ClipboardList,
  TrendingDown,
  TrendingUp,
  Truck,
  WalletCards
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { DataTable, type Column } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatRp, formatNumber, formatDate } from "@/lib/format";
import {
  deliveries,
  products,
  salesSeries,
  stockMovements,
  transactions,
  type Transaction
} from "@/data/mock";
import { cn } from "@/lib/utils";

/* ------------------------------ derivasi data ----------------------------- */

const lowStock = products.filter((item) => item.stock <= item.minStock);
const outStock = products.filter((item) => item.stock === 0);
const today = "2026-10-05";

const todaySales = transactions
  .filter((trx) => trx.date === today)
  .reduce((sum, trx) => sum + trx.total, 0);

const monthSales = transactions.reduce((sum, trx) => sum + trx.total, 0);
const receivable = transactions.reduce((sum, trx) => sum + Math.max(trx.total - trx.paid, 0), 0);
const dpCount = transactions.filter((trx) => trx.paymentStatus === "DP").length;
const todayDeliveries = deliveries.filter((item) => item.date === today);

// Barang paling laku: agregasi qty terjual dari semua transaksi.
const soldMap = new Map<string, { name: string; qty: number; revenue: number }>();
for (const trx of transactions) {
  for (const item of trx.items) {
    const current = soldMap.get(item.sku) ?? { name: item.name, qty: 0, revenue: 0 };
    current.qty += item.qty;
    current.revenue += item.qty * item.price;
    soldMap.set(item.sku, current);
  }
}
const bestSellers = [...soldMap.entries()]
  .map(([sku, value]) => ({ sku, ...value }))
  .sort((a, b) => b.qty - a.qty)
  .slice(0, 5);

// Ringkasan pergerakan stok minggu ini.
const movementSummary = {
  stock_in: stockMovements.filter((m) => m.type === "stock_in").length,
  stock_out: stockMovements.filter((m) => m.type === "stock_out").length,
  adjustment: stockMovements.filter((m) => m.type === "adjustment").length,
  return: stockMovements.filter((m) => m.type === "return").length
};

const maxWeekValue = Math.max(...salesSeries.map((item) => item.value));

const recent: Transaction[] = [...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6);

const columns: Column<Transaction>[] = [
  { key: "invoice", header: "Invoice", render: (row) => <span className="font-medium text-slate-800">{row.invoice}</span>, sortValue: (row) => row.invoice },
  { key: "date", header: "Tanggal", render: (row) => formatDate(row.date), sortValue: (row) => row.date },
  { key: "customer", header: "Customer", render: (row) => row.customer, sortValue: (row) => row.customer },
  { key: "total", header: "Total", align: "right", render: (row) => formatRp(row.total), sortValue: (row) => row.total },
  { key: "bayar", header: "Pembayaran", render: (row) => <StatusBadge value={row.paymentStatus} />, sortValue: (row) => row.paymentStatus },
  { key: "kirim", header: "Pengiriman", render: (row) => <StatusBadge value={row.deliveryStatus} />, sortValue: (row) => row.deliveryStatus }
];

/* ------------------------------ komponen ------------------------------ */

export function DashboardPage() {
  return (
    <div className="space-y-3">
      <PageHeader
        title="Dashboard"
        description="Ringkasan operasional hari ini: penjualan, tagihan, stok kritis, dan jadwal pengiriman."
        actions={
          <>
            <Button asChild>
              <Link href="/laporan">Lihat Laporan</Link>
            </Button>
            <Button variant="primary" asChild>
              <Link href="/transaksi">Transaksi Baru</Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Penjualan Hari Ini"
          value={formatRp(todaySales)}
          detail={`${transactions.filter((t) => t.date === today).length} transaksi`}
          icon={TrendingUp}
          tone="emerald"
          trend={{ value: "6,2% vs kemarin", up: true }}
        />
        <StatCard
          label="Nilai Transaksi Bulan Ini"
          value={formatRp(monthSales)}
          detail={`${transactions.length} invoice tercatat`}
          icon={ClipboardList}
          tone="sky"
          trend={{ value: "3,1% vs bulan lalu", up: true }}
        />
        <StatCard
          label="Piutang / DP Belum Lunas"
          value={formatRp(receivable)}
          detail={`${dpCount} transaksi berstatus DP`}
          icon={WalletCards}
          tone="amber"
        />
        <StatCard
          label="Stok Rendah"
          value={formatNumber(lowStock.length)}
          detail={`${outStock.length} barang habis`}
          icon={Boxes}
          tone="rose"
          /* Spacer to keep icon alignment consistent across cards */
        />
        <StatCard
          label="Jadwal Kirim Hari Ini"
          value={formatNumber(todayDeliveries.length)}
          detail={`${deliveries.length} total jadwal aktif`}
          icon={Truck}
          tone="violet"
        />
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Grafik penjualan mingguan */}
        <div className="rounded-md border border-border bg-card p-4 shadow-admin lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-800">Penjualan 7 Hari Terakhir</h2>
              <p className="text-xs text-slate-500">Nilai invoice kotor per hari (termasuk DP).</p>
            </div>
            <span className="rounded bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
              Total {formatRp(salesSeries.reduce((s, i) => s + i.value, 0))}
            </span>
          </div>
          <div className="mt-4 flex h-44 items-end gap-3">
            {salesSeries.map((item) => {
              const height = maxWeekValue > 0 ? Math.max((item.value / maxWeekValue) * 100, 4) : 4;
              return (
                <div key={item.date} className="flex flex-1 flex-col items-center gap-1.5">
                  <span className="text-[10px] font-medium text-slate-500">
                    {item.value > 0 ? `${Math.round(item.value / 1000)}rb` : "0"}
                  </span>
                  <div className="flex w-full flex-1 items-end">
                    <div
                      className="w-full rounded-t bg-sky-500/80 transition-all hover:bg-sky-600"
                      style={{ height: `${height}%` }}
                      title={`${item.day} · ${formatRp(item.value)} · ${item.trx} transaksi`}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600">{item.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Ringkasan pergerakan stok */}
        <div className="rounded-md border border-border bg-card p-4 shadow-admin">
          <h2 className="text-sm font-semibold text-slate-800">Pergerakan Stok</h2>
          <p className="text-xs text-slate-500">Akumulasi catatan mutasi stok terkini.</p>
          <div className="mt-3 space-y-2">
            {[
              { label: "Barang Masuk", value: movementSummary.stock_in, icon: TrendingUp, tone: "text-emerald-600 bg-emerald-50" },
              { label: "Barang Keluar", value: movementSummary.stock_out, icon: TrendingDown, tone: "text-rose-600 bg-rose-50" },
              { label: "Penyesuaian", value: movementSummary.adjustment, icon: Boxes, tone: "text-amber-600 bg-amber-50" },
              { label: "Retur", value: movementSummary.return, icon: Truck, tone: "text-violet-600 bg-violet-50" }
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3 rounded-md border border-border px-3 py-2">
                <span className={cn("flex h-7 w-7 items-center justify-center rounded-md", row.tone)}>
                  <row.icon className="h-4 w-4" />
                </span>
                <span className="flex-1 text-xs font-medium text-slate-600">{row.label}</span>
                <span className="text-sm font-semibold text-slate-800">{formatNumber(row.value)}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" className="mt-3 w-full" asChild>
            <Link href="/stok">
              Buka Riwayat Stok <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* Barang paling laku */}
        <div className="rounded-md border border-border bg-card shadow-admin">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <h2 className="text-sm font-semibold text-slate-800">Barang Paling Laku</h2>
            <Link href="/katalog" className="text-xs font-medium text-sky-700 hover:underline">
              Katalog
            </Link>
          </div>
          <div className="divide-y divide-border">
            {bestSellers.map((item, index) => (
              <div key={item.sku} className="flex items-center gap-3 px-4 py-2.5">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-100 text-[11px] font-semibold text-slate-600">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-slate-700">{item.name}</p>
                  <p className="text-[11px] text-slate-400">{item.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-slate-800">{formatNumber(item.qty)} terjual</p>
                  <p className="text-[11px] text-slate-400">{formatRp(item.revenue)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Jadwal pengiriman hari ini */}
        <div className="rounded-md border border-border bg-card shadow-admin">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <h2 className="text-sm font-semibold text-slate-800">Pengiriman Hari Ini</h2>
            <Link href="/pengiriman" className="text-xs font-medium text-sky-700 hover:underline">
              Jadwal
            </Link>
          </div>
          {todayDeliveries.length === 0 ? (
            <p className="px-4 py-6 text-center text-xs text-slate-400">Belum ada pengiriman hari ini.</p>
          ) : (
            <div className="divide-y divide-border">
              {todayDeliveries.map((item) => (
                <div key={item.id} className="px-4 py-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-700">
                      {item.time} · {item.customer}
                    </span>
                    <StatusBadge value={item.status} />
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-slate-500">
                    {item.invoice} · {item.address}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Barang stok rendah */}
        <div className="rounded-md border border-border bg-card shadow-admin">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <h2 className="text-sm font-semibold text-slate-800">Perlu Restok</h2>
            <span className="rounded bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600">
              {lowStock.length} item
            </span>
          </div>
          <div className="divide-y divide-border">
            {lowStock.slice(0, 5).map((item) => (
              <div key={item.sku} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-slate-700">{item.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {item.sku} · min {item.minStock} {item.unit}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[11px] font-semibold",
                    item.stock === 0 ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                  )}
                >
                  {item.stock} {item.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-800">Transaksi Terbaru</h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/transaksi">
              Semua transaksi <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
        <DataTable
          columns={columns}
          rows={recent}
          getRowId={(row) => row.invoice}
          emptyTitle="Belum ada transaksi"
          emptyDescription="Transaksi akan muncul di sini setelah dibuat."
        />
      </div>
    </div>
  );
}
