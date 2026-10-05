"use client";

import { Printer, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatRp, formatDate } from "@/lib/format";
import type { Transaction } from "@/data/mock";
import { cn } from "@/lib/utils";

/**
 * Pratinjau invoice siap cetak. Dipakai di modul Transaksi, Pembayaran, dan Invoice.
 */
export function InvoicePreview({
  transaction,
  className,
  showActions = false,
  onPrint
}: {
  transaction: Transaction;
  className?: string;
  showActions?: boolean;
  onPrint?: () => void;
}) {
  const sisa = Math.max(transaction.total - transaction.paid, 0);

  return (
    <div className={cn("rounded-md border border-border bg-white shadow-admin", className)}>
      {showActions ? (
        <div className="no-print flex items-center justify-between gap-2 border-b border-border px-4 py-2.5">
          <h3 className="text-sm font-semibold text-slate-800">Pratinjau Invoice</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={onPrint}>
              <Printer className="h-3.5 w-3.5" /> Cetak
            </Button>
            <Button size="sm" variant="primary" onClick={onPrint}>
              <Send className="h-3.5 w-3.5" /> Kirim ke Customer
            </Button>
          </div>
        </div>
      ) : null}

      <div className="p-5">
        {/* Kop */}
        <div className="flex items-start justify-between gap-4 border-b border-dashed border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                TB
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">Toko Bangunan Sumber Rejeki</p>
                <p className="text-[11px] text-slate-500">Material & Alat Bangunan</p>
              </div>
            </div>
            <p className="mt-2 text-[11px] leading-5 text-slate-500">
              Jl. Raya Bekasi Timur No. 128, Bekasi
              <br />
              Telp/WA: 0812-3456-7890 · NPWP: 01.234.567.8-901.000
            </p>
          </div>
          <div className="text-right">
            <p className="text-base font-bold uppercase tracking-wide text-slate-800">Invoice</p>
            <p className="font-mono text-xs font-semibold text-sky-700">{transaction.invoice}</p>
            <p className="mt-1 text-[11px] text-slate-500">Tanggal: {formatDate(transaction.date)}</p>
            <div className="mt-2 flex justify-end">
              <StatusBadge value={transaction.paymentStatus} />
            </div>
          </div>
        </div>

        {/* Info customer + pengiriman */}
        <div className="grid grid-cols-2 gap-4 border-b border-dashed border-border py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Ditagihkan Kepada</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{transaction.customer}</p>
            <p className="text-[11px] text-slate-500">{transaction.customerId}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Status Pengiriman</p>
            <div className="mt-1">
              <StatusBadge value={transaction.deliveryStatus} />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Metode bayar: <span className="font-medium text-slate-700">{transaction.paymentMethod}</span>
            </p>
          </div>
        </div>

        {/* Tabel item */}
        <div className="overflow-hidden rounded border border-border">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2 text-left font-semibold">Barang</th>
                <th className="px-3 py-2 text-right font-semibold">Qty</th>
                <th className="px-3 py-2 text-right font-semibold">Harga</th>
                <th className="px-3 py-2 text-right font-semibold">Jumlah</th>
              </tr>
            </thead>
            <tbody>
              {transaction.items.map((item) => (
                <tr key={item.sku} className="border-t border-border">
                  <td className="px-3 py-2">
                    <p className="font-medium text-slate-700">{item.name}</p>
                    <p className="font-mono text-[10px] text-slate-400">{item.sku}</p>
                  </td>
                  <td className="px-3 py-2 text-right text-slate-600">{item.qty}</td>
                  <td className="px-3 py-2 text-right text-slate-600">{formatRp(item.price)}</td>
                  <td className="px-3 py-2 text-right font-medium text-slate-700">{formatRp(item.qty * item.price)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Ringkasan */}
        <div className="mt-4 flex justify-end">
          <div className="w-full max-w-xs space-y-1.5 text-xs">
            <Line label="Subtotal" value={formatRp(transaction.subtotal)} />
            {transaction.discount > 0 ? <Line label="Diskon" value={`- ${formatRp(transaction.discount)}`} /> : null}
            <Line label="Ongkos Kirim" value={formatRp(transaction.shipping)} />
            <div className="flex items-center justify-between border-t border-border pt-1.5">
              <span className="font-semibold text-slate-700">Total Tagihan</span>
              <span className="text-sm font-bold text-slate-900">{formatRp(transaction.total)}</span>
            </div>
            <Line label="Sudah Dibayar" value={formatRp(transaction.paid)} tone="text-emerald-600" />
            <div className="flex items-center justify-between rounded bg-slate-50 px-2 py-1.5">
              <span className="font-semibold text-slate-700">Sisa Tagihan</span>
              <span className={cn("text-sm font-bold", sisa > 0 ? "text-rose-600" : "text-emerald-600")}>{formatRp(sisa)}</span>
            </div>
          </div>
        </div>

        {transaction.note ? (
          <p className="mt-4 rounded border border-dashed border-border bg-slate-50 px-3 py-2 text-[11px] text-slate-500">
            Catatan: {transaction.note}
          </p>
        ) : null}

        <div className="mt-5 flex items-end justify-between border-t border-dashed border-border pt-3 text-[11px] text-slate-500">
          <p>
            Pembayaran dianggap sah bila dana diterima ke rekening toko. Barang yang sudah dibeli tidak dapat ditukar kecuali rusak
            dari pabrik.
          </p>
          <div className="text-right">
            <p className="text-slate-400">Hormat kami,</p>
            <p className="mt-6 font-medium text-slate-700">{transaction.admin}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Line({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className={cn("font-medium text-slate-700", tone)}>{value}</span>
    </div>
  );
}
