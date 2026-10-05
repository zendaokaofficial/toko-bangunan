"use client";

import * as React from "react";
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  UploadCloud,
  X
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { categories } from "@/data/mock";
import { cn } from "@/lib/utils";

type RowState = "valid" | "warning" | "error";

type PreviewRow = {
  id: number;
  sku: string;
  name: string;
  category: string;
  unit: string;
  stock: string;
  price: string;
  state: RowState;
  message: string;
};

const catalogRows: PreviewRow[] = [
  { id: 1, sku: "SMN-011", name: "Semen Merah Putih 40kg", category: "Semen", unit: "sak", stock: "120", price: "58000", state: "valid", message: "Siap diimpor" },
  { id: 2, sku: "KRM-014", name: "Keramik Roman 40x40 Abu", category: "Keramik", unit: "dus", stock: "80", price: "72000", state: "valid", message: "Siap diimpor" },
  { id: 3, sku: "PAK-090", name: "Paku Beton 7cm (per kg)", category: "Perkakas", unit: "kg", stock: "45", price: "22000", state: "warning", message: "Nama mirip PAK-002 yang sudah ada" },
  { id: 4, sku: "CAT-021", name: "Cat Dulux Pentalite 5kg", category: "Cat", unit: "pcs", stock: "", price: "185000", state: "error", message: "Kolom stok kosong" },
  { id: 5, sku: "PIP-033", name: "Pipa PVC Wavin 3 inch", category: "Pipa", unit: "batang", stock: "60", price: "89000", state: "valid", message: "Siap diimpor" },
  { id: 6, sku: "BESI-044", name: "Besi Beton Polos 10mm", category: "Besi", unit: "batang", stock: "150", price: "68000", state: "valid", message: "Siap diimpor" },
  { id: 7, sku: "SMN-011", name: "Semen Merah Putih 40kg (duplikat)", category: "Semen", unit: "sak", stock: "10", price: "58000", state: "error", message: "SKU duplikat di dalam file" }
];

const stockRows: PreviewRow[] = [
  { id: 1, sku: "SMN-001", name: "Semen Gresik 40kg", category: "Semen", unit: "sak", stock: "240", price: "-", state: "valid", message: "Update stok 210 → 240" },
  { id: 2, sku: "KRM-002", name: "Keramik Platinum 60x60", category: "Keramik", unit: "dus", stock: "55", price: "-", state: "warning", message: "Selisih cukup besar (Δ +40)" },
  { id: 3, sku: "BESI-005", name: "Besi Beton Ulir 12mm", category: "Besi", unit: "batang", stock: "0", price: "-", state: "error", message: "Stok 0 di bawah minimum (10)" },
  { id: 4, sku: "CAT-003", name: "Cat Avitex Interior 20kg", category: "Cat", unit: "pcs", stock: "18", price: "-", state: "valid", message: "Update stok 12 → 18" }
];

function stateBadge(state: RowState) {
  if (state === "valid") return <Badge tone="success">Valid</Badge>;
  if (state === "warning") return <Badge tone="warning">Peringatan</Badge>;
  return <Badge tone="danger">Error</Badge>;
}

function UploadPreview({ rows, label }: { rows: PreviewRow[]; label: string }) {
  const [data, setData] = React.useState(rows);
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [dragging, setDragging] = React.useState(false);

  React.useEffect(() => setData(rows), [rows]);

  const valid = data.filter((r) => r.state === "valid").length;
  const warning = data.filter((r) => r.state === "warning").length;
  const error = data.filter((r) => r.state === "error").length;

  const updateCell = (id: number, key: "sku" | "name" | "stock" | "price", value: string) => {
    setData((prev) =>
      prev.map((row) => {
        if (row.id !== id) return row;
        const next = { ...row, [key]: value };
        // Validasi ulang ringan setelah diedit.
        if (!next.sku.trim()) next.state = "error", next.message = "SKU wajib diisi";
        else if (!next.name.trim()) next.state = "error", next.message = "Nama barang wajib diisi";
        else if (next.stock !== "" && Number.isNaN(Number(next.stock))) next.state = "error", next.message = "Stok harus angka";
        else if (row.state === "error" && next.stock !== "") next.state = "warning", next.message = "Diperbaiki, perlu cek ulang";
        return next;
      })
    );
  };

  return (
    <div className="space-y-3">
      {/* Dropzone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) setFileName(file.name);
        }}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed bg-card px-6 py-8 text-center transition-colors",
          dragging ? "border-sky-400 bg-sky-50" : "border-border"
        )}
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-50 text-sky-600">
          <UploadCloud className="h-5 w-5" />
        </span>
        <p className="text-sm font-medium text-slate-700">Tarik file Excel/CSV ke sini</p>
        <p className="text-xs text-slate-500">Format didukung: .xlsx, .xls, .csv (maks. 5 MB)</p>
        <div className="mt-1 flex items-center gap-2">
          <Button variant="primary" size="sm" onClick={() => setFileName(`template-${label.toLowerCase().replace(/\s/g, "-")}.xlsx`)}>
            <FileSpreadsheet className="h-3.5 w-3.5" /> Pilih File
          </Button>
          <Button size="sm" variant="outline">
            <Download className="h-3.5 w-3.5" /> Unduh Template
          </Button>
        </div>
        {fileName ? (
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
            {fileName}
            <button type="button" onClick={() => setFileName(null)} aria-label="Hapus file">
              <X className="h-3.5 w-3.5 text-slate-400 hover:text-rose-500" />
            </button>
          </div>
        ) : null}
      </div>

      {fileName ? (
        <>
          <div className="grid grid-cols-3 gap-3">
            <StatCard label="Baris Valid" value={String(valid)} detail="Siap diimpor" icon={CheckCircle2} tone="emerald" />
            <StatCard label="Perlu Dicek" value={String(warning)} detail="Bisa diimpor dengan catatan" icon={AlertTriangle} tone="amber" />
            <StatCard label="Error" value={String(error)} detail="Harus diperbaiki dulu" icon={AlertOctagon} tone="rose" />
          </div>

          <div className="overflow-hidden rounded-md border border-border bg-card shadow-admin">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2.5">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Pratinjau Data</h3>
                <p className="text-xs text-slate-500">Sel yang bermasalah dapat diedit langsung sebelum impor.</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setFileName(null)}>
                  Batal
                </Button>
                <Button variant="primary" size="sm" disabled={error > 0}>
                  {error > 0 ? `Perbaiki ${error} error dulu` : "Konfirmasi Impor"}
                </Button>
              </div>
            </div>
            <div className="max-h-[420px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-10">#</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Nama Barang</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead>Stok</TableHead>
                    <TableHead>Harga</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Catatan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className={cn(
                        row.state === "error" && "bg-rose-50/60",
                        row.state === "warning" && "bg-amber-50/50"
                      )}
                    >
                      <TableCell className="text-[11px] text-slate-400">{index + 1}</TableCell>
                      <TableCell>
                        <Input className="h-7 w-28 font-mono text-[11px]" value={row.sku} onChange={(e) => updateCell(row.id, "sku", e.target.value)} />
                      </TableCell>
                      <TableCell>
                        <Input className="h-7 min-w-[180px] text-xs" value={row.name} onChange={(e) => updateCell(row.id, "name", e.target.value)} />
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">{row.category}</TableCell>
                      <TableCell className="text-xs text-slate-600">{row.unit}</TableCell>
                      <TableCell>
                        <Input className="h-7 w-20 text-xs" value={row.stock} onChange={(e) => updateCell(row.id, "stock", e.target.value)} />
                      </TableCell>
                      <TableCell className="text-xs text-slate-600">{row.price}</TableCell>
                      <TableCell>{stateBadge(row.state)}</TableCell>
                      <TableCell className="text-[11px] text-slate-500">{row.message}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
            <FileSpreadsheet className="h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">Belum ada file diunggah</p>
            <p className="max-w-md text-xs text-slate-400">
              Unggah file untuk melihat pratinjau dan validasi baris. Semua baris diberi tanda Valid, Peringatan, atau Error
              sebelum impor dijalankan.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function UploadPage() {
  return (
    <div className="space-y-3">
      <PageHeader
        title="Upload Data"
        description="Impor katalog barang baru atau pembaruan stok massal dari file Excel/CSV, lengkap dengan validasi baris."
        actions={
          <Button variant="outline">
            <Download className="h-3.5 w-3.5" /> Unduh Panduan Format
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Aturan Impor</CardTitle>
            <CardDescription>Ikuti kolom wajib agar file lolos validasi tanpa error.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-3 text-xs text-slate-600 sm:grid-cols-3">
          <div className="rounded-md border border-border p-3">
            <p className="font-semibold text-slate-700">Kolom wajib (Katalog)</p>
            <p className="mt-1 text-slate-500">SKU, Nama Barang, Kategori, Satuan, Stok Minimum, Harga Jual.</p>
          </div>
          <div className="rounded-md border border-border p-3">
            <p className="font-semibold text-slate-700">Kolom wajib (Update Stok)</p>
            <p className="mt-1 text-slate-500">SKU, Stok Aktual. Nama diabaikan bila SKU sudah ada.</p>
          </div>
          <div className="rounded-md border border-border p-3">
            <p className="font-semibold text-slate-700">Validasi</p>
            <p className="mt-1 text-slate-500">
              SKU duplikat & kolom kosong berstatus Error. Selisih stok besar / nama mirip berstatus Peringatan. Kategori harus salah
              satu dari: {categories.slice(0, 4).join(", ")}, …
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="katalog">
        <TabsList>
          <TabsTrigger value="katalog">Upload Katalog Baru</TabsTrigger>
          <TabsTrigger value="stok">Upload Update Stok</TabsTrigger>
        </TabsList>
        <TabsContent value="katalog">
          <UploadPreview rows={catalogRows} label="Katalog" />
        </TabsContent>
        <TabsContent value="stok">
          <UploadPreview rows={stockRows} label="Update Stok" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
