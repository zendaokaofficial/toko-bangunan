"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  ClipboardList,
  Plus,
  Printer,
  Trash2,
  WalletCards
} from "lucide-react";
import { DataTable, type Column } from "@/components/data-table";
import { InvoicePreview } from "@/components/invoice-preview";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { TableToolbar } from "@/components/table-toolbar";
import { ActionMenu } from "@/components/ui/action-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatRp, formatDate, formatNumber } from "@/lib/format";
import { customers, products, transactions, type PaymentMethod, type Transaction } from "@/data/mock";
import { cn } from "@/lib/utils";

/* --------------------------- form transaksi baru --------------------------- */

type CartLine = { sku: string; name: string; qty: number; price: number };

function TransactionForm({
  open,
  onClose,
  onPreview
}: {
  open: boolean;
  onClose: () => void;
  onPreview: (trx: Transaction) => void;
}) {
  const [customerId, setCustomerId] = React.useState(customers[0]?.id ?? "");
  const [lines, setLines] = React.useState<CartLine[]>([]);
  const [pickSku, setPickSku] = React.useState("");
  const [discount, setDiscount] = React.useState("0");
  const [shipping, setShipping] = React.useState("0");
  const [method, setMethod] = React.useState<PaymentMethod>("Cash");
  const [payMode, setPayMode] = React.useState<"lunas" | "dp" | "belum">("lunas");
  const [dpAmount, setDpAmount] = React.useState("0");
  const [note, setNote] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setLines([]);
      setDiscount("0");
      setShipping("0");
      setMethod("Cash");
      setPayMode("lunas");
      setDpAmount("0");
      setNote("");
      setCustomerId(customers[0]?.id ?? "");
    }
  }, [open]);

  const addLine = () => {
    const product = products.find((item) => item.sku === pickSku);
    if (!product) return;
    setLines((prev) => {
      const existing = prev.find((line) => line.sku === product.sku);
      if (existing) {
        return prev.map((line) => (line.sku === product.sku ? { ...line, qty: line.qty + 1 } : line));
      }
      return [...prev, { sku: product.sku, name: product.name, qty: 1, price: product.price }];
    });
    setPickSku("");
  };

  const subtotal = lines.reduce((sum, line) => sum + line.qty * line.price, 0);
  const total = subtotal - Number(discount || 0) + Number(shipping || 0);
  const paid = payMode === "lunas" ? total : payMode === "dp" ? Math.min(Number(dpAmount || 0), total) : 0;
  const sisa = Math.max(total - paid, 0);

  const customer = customers.find((item) => item.id === customerId);

  const buildTransaction = (): Transaction => ({
    invoice: `INV-2026-${1000 + transactions.length + 1}`,
    date: "2026-10-05",
    customer: customer?.name ?? "-",
    customerId,
    items: lines.map((line) => ({ sku: line.sku, name: line.name, qty: line.qty, price: line.price })),
    subtotal,
    discount: Number(discount || 0),
    shipping: Number(shipping || 0),
    total,
    paid,
    paymentStatus: paid >= total && total > 0 ? "Lunas" : paid > 0 ? "DP" : "Belum Dibayar",
    deliveryStatus: "Dijadwalkan",
    paymentMethod: method,
    admin: "Dewi Anggraeni",
    note: note || undefined
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Transaksi Baru"
      description="Pilih customer, tambahkan barang ke keranjang, lalu atur pembayaran."
      size="xl"
      footer={
        <>
          <Button onClick={onClose}>Batal</Button>
          <Button
            variant="outline"
            disabled={lines.length === 0}
            onClick={() => {
              onPreview(buildTransaction());
            }}
          >
            <Printer className="h-3.5 w-3.5" /> Simpan & Pratinjau Invoice
          </Button>
          <Button variant="primary" disabled={lines.length === 0} onClick={onClose}>
            Simpan Transaksi
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <Label>Customer</Label>
            <Select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
              {customers.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} · {item.type}
                </option>
              ))}
            </Select>
          </label>
          <label className="flex flex-col gap-1">
            <Label>Metode Pembayaran</Label>
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

        {/* Pemilih barang */}
        <div className="rounded-md border border-border">
          <div className="flex flex-wrap items-center gap-2 border-b border-border p-2.5">
            <Select className="min-w-[260px] flex-1" value={pickSku} onChange={(e) => setPickSku(e.target.value)}>
              <option value="">— Pilih barang untuk ditambahkan —</option>
              {products.map((item) => (
                <option key={item.sku} value={item.sku}>
                  {item.sku} · {item.name} · {formatRp(item.price)}
                </option>
              ))}
            </Select>
            <Button variant="primary" onClick={addLine} disabled={!pickSku}>
              <Plus className="h-3.5 w-3.5" /> Tambah
            </Button>
          </div>

          {lines.length === 0 ? (
            <p className="px-3 py-6 text-center text-xs text-slate-400">
              Keranjang kosong. Pilih barang di atas untuk mulai membuat transaksi.
            </p>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-slate-100 text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-3 py-2 text-left font-semibold">Barang</th>
                  <th className="w-24 px-3 py-2 text-right font-semibold">Qty</th>
                  <th className="w-28 px-3 py-2 text-right font-semibold">Harga</th>
                  <th className="w-32 px-3 py-2 text-right font-semibold">Jumlah</th>
                  <th className="w-10 px-2 py-2" />
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.sku} className="border-t border-border">
                    <td className="px-3 py-2">
                      <p className="font-medium text-slate-700">{line.name}</p>
                      <p className="font-mono text-[10px] text-slate-400">{line.sku}</p>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <Input
                        className="h-7 w-16 text-right text-xs"
                        type="number"
                        value={line.qty}
                        min={1}
                        onChange={(e) =>
                          setLines((prev) =>
                            prev.map((item) =>
                              item.sku === line.sku ? { ...item, qty: Math.max(Number(e.target.value) || 1, 1) } : item
                            )
                          )
                        }
                      />
                    </td>
                    <td className="px-3 py-2 text-right text-slate-600">{formatRp(line.price)}</td>
                    <td className="px-3 py-2 text-right font-medium text-slate-700">{formatRp(line.qty * line.price)}</td>
                    <td className="px-2 py-2 text-right">
                      <button
                        type="button"
                        className="text-slate-400 hover:text-rose-500"
                        onClick={() => setLines((prev) => prev.filter((item) => item.sku !== line.sku))}
                        aria-label="Hapus baris"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Ringkasan + pembayaran */}
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <div className="space-y-3 rounded-md border border-border p-3">
            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1">
                <Label>Diskon (Rp)</Label>
                <Input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} />
              </label>
              <label className="flex flex-col gap-1">
                <Label>Ongkos Kirim (Rp)</Label>
                <Input type="number" value={shipping} onChange={(e) => setShipping(e.target.value)} />
              </label>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Skema Pembayaran</Label>
              <div className="flex gap-2">
                {(
                  [
                    { key: "lunas", label: "Lunas / Cash" },
                    { key: "dp", label: "DP (Uang Muka)" },
                    { key: "belum", label: "Belum Dibayar" }
                  ] as const
                ).map((option) => (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setPayMode(option.key)}
                    className={cn(
                      "flex-1 rounded-md border px-2 py-1.5 text-xs font-medium transition-colors",
                      payMode === option.key
                        ? "border-sky-300 bg-sky-50 text-sky-800"
                        : "border-border text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
            {payMode === "dp" ? (
              <label className="flex flex-col gap-1">
                <Label>Jumlah DP (Rp)</Label>
                <Input type="number" value={dpAmount} onChange={(e) => setDpAmount(e.target.value)} />
              </label>
            ) : null}
            <label className="flex flex-col gap-1">
              <Label>Catatan</Label>
              <Input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Nama proyek / permintaan khusus" />
            </label>
          </div>

          <div className="space-y-2 rounded-md border border-border bg-slate-50 p-3 text-xs">
            <Row label="Subtotal" value={formatRp(subtotal)} />
            <Row label="Diskon" value={`- ${formatRp(Number(discount || 0))}`} />
            <Row label="Ongkos Kirim" value={formatRp(Number(shipping || 0))} />
            <div className="flex items-center justify-between border-t border-border pt-2">
              <span className="font-semibold text-slate-700">Total</span>
              <span className="text-base font-bold text-slate-900">{formatRp(total)}</span>
            </div>
            <Row label="Dibayar" value={formatRp(paid)} tone="text-emerald-600" />
            <div className="flex items-center justify-between rounded bg-white px-2 py-1.5">
              <span className="font-semibold text-slate-700">Sisa Tagihan</span>
              <span className={cn("text-sm font-bold", sisa > 0 ? "text-rose-600" : "text-emerald-600")}>{formatRp(sisa)}</span>
            </div>
            <p className="pt-1 text-[11px] text-slate-400">
              {lines.length} baris · {formatNumber(lines.reduce((s, l) => s + l.qty, 0))} unit
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className={cn("font-medium text-slate-700", tone)}>{value}</span>
    </div>
  );
}

/* ------------------------------- halaman ------------------------------- */

export function TransaksiPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState("");
  const [payFilter, setPayFilter] = React.useState("all");
  const [shipFilter, setShipFilter] = React.useState("all");
  const [formOpen, setFormOpen] = React.useState(false);
  const [preview, setPreview] = React.useState<Transaction | null>(null);

  React.useEffect(() => {
    if (searchParams.get("action") === "baru") setFormOpen(true);
  }, [searchParams]);

  const filtered = React.useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return transactions.filter((trx) => {
      const matchKeyword =
        keyword.length === 0 || `${trx.invoice} ${trx.customer} ${trx.admin}`.toLowerCase().includes(keyword);
      const matchPay = payFilter === "all" || trx.paymentStatus === payFilter;
      const matchShip = shipFilter === "all" || trx.deliveryStatus === shipFilter;
      return matchKeyword && matchPay && matchShip;
    });
  }, [search, payFilter, shipFilter]);

  const totalNilai = transactions.reduce((sum, trx) => sum + trx.total, 0);
  const piutang = transactions.reduce((sum, trx) => sum + Math.max(trx.total - trx.paid, 0), 0);
  const lunas = transactions.filter((trx) => trx.paymentStatus === "Lunas").length;
  const belum = transactions.filter((trx) => trx.paymentStatus === "Belum Dibayar").length;

  const columns: Column<Transaction>[] = [
    {
      key: "invoice",
      header: "Invoice",
      width: "140px",
      sortValue: (row) => row.invoice,
      render: (row) => <span className="font-mono text-[11px] font-semibold text-sky-700">{row.invoice}</span>
    },
    { key: "date", header: "Tanggal", sortValue: (row) => row.date, render: (row) => formatDate(row.date) },
    {
      key: "customer",
      header: "Customer",
      sortValue: (row) => row.customer,
      render: (row) => (
        <div>
          <p className="text-xs font-medium text-slate-700">{row.customer}</p>
          <p className="text-[11px] text-slate-400">{row.items.length} barang</p>
        </div>
      )
    },
    { key: "total", header: "Total", align: "right", render: (row) => formatRp(row.total), sortValue: (row) => row.total },
    {
      key: "sisa",
      header: "Sisa",
      align: "right",
      sortValue: (row) => Math.max(row.total - row.paid, 0),
      render: (row) => {
        const sisa = Math.max(row.total - row.paid, 0);
        return <span className={cn("font-medium", sisa > 0 ? "text-rose-600" : "text-emerald-600")}>{formatRp(sisa)}</span>;
      }
    },
    { key: "pay", header: "Pembayaran", render: (row) => <StatusBadge value={row.paymentStatus} />, sortValue: (row) => row.paymentStatus },
    { key: "ship", header: "Pengiriman", render: (row) => <StatusBadge value={row.deliveryStatus} />, sortValue: (row) => row.deliveryStatus },
    { key: "method", header: "Metode", render: (row) => <span className="text-xs text-slate-500">{row.paymentMethod}</span>, sortValue: (row) => row.paymentMethod },
    { key: "admin", header: "Admin", render: (row) => row.admin, sortValue: (row) => row.admin },
    {
      key: "action",
      header: "",
      width: "56px",
      align: "right",
      render: (row) => (
        <div onClick={(e) => e.stopPropagation()} className="flex justify-end">
          <ActionMenu
            items={[
              { label: "Lihat invoice", icon: Printer, onSelect: () => setPreview(row) },
              { label: "Catat pembayaran", icon: WalletCards, onSelect: () => setPreview(row) },
              { label: "Ubah status kirim", icon: ClipboardList, disabled: true },
              { label: "Hapus transaksi", danger: true, onSelect: () => undefined }
            ]}
          />
        </div>
      )
    }
  ];

  return (
    <div className="space-y-3">
      <PageHeader
        title="Transaksi"
        description="Kelola semua transaksi penjualan: buat invoice, pantau status pembayaran, dan kirim ke customer."
        actions={
          <>
            <Button variant="outline">Ekspor Transaksi</Button>
            <Button variant="primary" onClick={() => setFormOpen(true)}>
              <Plus className="h-3.5 w-3.5" /> Transaksi Baru
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Nilai" value={formatRp(totalNilai)} detail={`${transactions.length} transaksi`} icon={ClipboardList} tone="sky" />
        <StatCard label="Piutang Berjalan" value={formatRp(piutang)} detail="Belum tertagih" icon={WalletCards} tone="amber" />
        <StatCard label="Lunas" value={String(lunas)} detail="Transaksi selesai bayar" icon={CheckCircle2} tone="emerald" />
        <StatCard label="Belum Dibayar" value={String(belum)} detail="Perlu ditindaklanjuti" icon={WalletCards} tone="rose" />
      </div>

      <TableToolbar search={search} onSearch={setSearch} placeholder="Cari invoice, nama customer, atau admin…">
        <Select className="w-40" value={payFilter} onChange={(e) => setPayFilter(e.target.value)}>
          <option value="all">Semua Pembayaran</option>
          <option value="Belum Dibayar">Belum Dibayar</option>
          <option value="DP">DP</option>
          <option value="Lunas">Lunas</option>
        </Select>
        <Select className="w-40" value={shipFilter} onChange={(e) => setShipFilter(e.target.value)}>
          <option value="all">Semua Pengiriman</option>
          <option value="Dijadwalkan">Dijadwalkan</option>
          <option value="Diproses">Diproses</option>
          <option value="Dikirim">Dikirim</option>
          <option value="Selesai">Selesai</option>
          <option value="Gagal">Gagal</option>
        </Select>
      </TableToolbar>

      <DataTable
        columns={columns}
        rows={filtered}
        getRowId={(row) => row.invoice}
        onRowClick={setPreview}
        activeRowId={preview?.invoice}
        emptyTitle="Transaksi tidak ditemukan"
        emptyDescription="Ubah kata kunci atau filter status pembayaran/pengiriman."
      />

      <TransactionForm open={formOpen} onClose={() => setFormOpen(false)} onPreview={setPreview} />

      <Modal
        open={Boolean(preview)}
        onClose={() => setPreview(null)}
        title={preview ? `Invoice ${preview.invoice}` : ""}
        description={preview ? `${preview.customer} · ${formatDate(preview.date)}` : ""}
        size="lg"
        footer={
          <>
            <Button onClick={() => setPreview(null)}>Tutup</Button>
            <Button variant="primary" onClick={() => window.print()}>
              <Printer className="h-3.5 w-3.5" /> Cetak Invoice
            </Button>
          </>
        }
      >
        {preview ? <InvoicePreview transaction={preview} /> : null}
      </Modal>
    </div>
  );
}
