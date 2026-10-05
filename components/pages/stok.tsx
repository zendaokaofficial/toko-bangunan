"use client";

import * as React from "react";
import { AlertTriangle, ArrowDownToLine, ArrowUpFromLine, Boxes, History, PackageX, Settings2 } from "lucide-react";
import { DataTable, type Column } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { TableToolbar } from "@/components/table-toolbar";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber, formatDate } from "@/lib/format";
import { products, stockMovements, type MovementType, type Product, type StockMovement } from "@/data/mock";
import { cn } from "@/lib/utils";

/* --------------------------- form mutasi stok --------------------------- */

type MovementForm = {
  sku: string;
  qty: string;
  note: string;
  admin: string;
};

const movementMeta: Record<MovementType, { label: string; action: string; tone: string }> = {
  stock_in: { label: "Barang Masuk", action: "Tambah Stok (Masuk)", tone: "text-emerald-600" },
  stock_out: { label: "Barang Keluar", action: "Kurangi Stok (Keluar)", tone: "text-rose-600" },
  adjustment: { label: "Penyesuaian", action: "Set Ulang Stok (Opname)", tone: "text-amber-600" },
  return: { label: "Retur", action: "Catat Retur Barang", tone: "text-violet-600" }
};

function StockMutationModal({
  open,
  onClose,
  type,
  product
}: {
  open: boolean;
  onClose: () => void;
  type: MovementType;
  product: Product | null;
}) {
  const [form, setForm] = React.useState<MovementForm>({ sku: "", qty: "0", note: "", admin: "Rudi Hartono" });

  React.useEffect(() => {
    if (open) setForm({ sku: product?.sku ?? "", qty: "0", note: "", admin: "Rudi Hartono" });
  }, [open, product]);

  const meta = movementMeta[type];
  const currentStock = products.find((item) => item.sku === form.sku);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={meta.action}
      description="Catat pergerakan stok. Stok aktual diperbarui setelah disimpan (dummy di prototype ini)."
      size="md"
      footer={
        <>
          <Button onClick={onClose}>Batal</Button>
          <Button variant="primary" onClick={onClose}>
            Simpan Mutasi
          </Button>
        </>
      }
    >
      <div className="space-y-3">
        <label className="flex flex-col gap-1">
          <Label>Pilih Barang</Label>
          <Select value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}>
            <option value="">— Pilih barang —</option>
            {products.map((item) => (
              <option key={item.sku} value={item.sku}>
                {item.sku} · {item.name}
              </option>
            ))}
          </Select>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1">
            <Label>{type === "adjustment" ? "Stok Aktual" : "Jumlah (Qty)"}</Label>
            <Input type="number" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} />
          </label>
          <label className="flex flex-col gap-1">
            <Label>Petugas</Label>
            <Input value={form.admin} onChange={(e) => setForm({ ...form, admin: e.target.value })} />
          </label>
        </div>
        <label className="flex flex-col gap-1">
          <Label>Catatan</Label>
          <Input
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder={type === "stock_in" ? "No. surat jalan / supplier" : "Alasan mutasi"}
          />
        </label>
        {currentStock ? (
          <div className="rounded-md border border-border bg-slate-50 px-3 py-2 text-xs">
            <span className="text-slate-500">Stok saat ini:</span>{" "}
            <strong className="text-slate-700">
              {formatNumber(currentStock.stock)} {currentStock.unit}
            </strong>
            <span className="mx-2 text-slate-300">→</span>
            <span className="text-slate-500">Setelah mutasi:</span>{" "}
            <strong className={meta.tone}>
              {type === "stock_in"
                ? formatNumber(currentStock.stock + Number(form.qty || 0))
                : type === "stock_out"
                  ? formatNumber(Math.max(currentStock.stock - Number(form.qty || 0), 0))
                  : formatNumber(Number(form.qty || 0))}{" "}
              {currentStock.unit}
            </strong>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}

/* ------------------------------- halaman ------------------------------- */

export function StokPage() {
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [only, setOnly] = React.useState<"all" | "low" | "out">("all");
  const [mutation, setMutation] = React.useState<{ type: MovementType; product: Product | null } | null>(null);
  const [selected, setSelected] = React.useState<Product | null>(null);

  const filteredProducts = React.useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return products.filter((item) => {
      const matchKeyword = keyword.length === 0 || `${item.sku} ${item.name} ${item.brand}`.toLowerCase().includes(keyword);
      const matchCategory = category === "all" || item.category === category;
      const matchOnly = only === "all" || (only === "low" && item.stock <= item.minStock) || (only === "out" && item.stock === 0);
      return matchKeyword && matchCategory && matchOnly;
    });
  }, [search, category, only]);

  const filteredMovements = React.useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return stockMovements.filter((item) => {
      const matchKeyword = keyword.length === 0 || `${item.sku} ${item.item} ${item.note} ${item.id}`.toLowerCase().includes(keyword);
      const matchType = only === "all" || (only === "low" && item.type === "stock_out") || (only === "out" && item.type === "return");
      return matchKeyword && matchType;
    });
  }, [search, only]);

  const productColumns: Column<Product>[] = [
    { key: "sku", header: "SKU", width: "120px", sortValue: (row) => row.sku, render: (row) => <span className="font-mono text-[11px] font-medium text-slate-700">{row.sku}</span> },
    {
      key: "name",
      header: "Barang",
      sortValue: (row) => row.name,
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-800">{row.name}</p>
          <p className="text-[11px] text-slate-400">
            {row.brand} · {row.location}
          </p>
        </div>
      )
    },
    { key: "category", header: "Kategori", render: (row) => row.category, sortValue: (row) => row.category },
    {
      key: "stock",
      header: "Stok",
      align: "right",
      sortValue: (row) => row.stock,
      render: (row) => (
        <span className={cn("font-semibold", row.stock === 0 ? "text-rose-600" : row.stock <= row.minStock ? "text-amber-600" : "text-slate-700")}>
          {formatNumber(row.stock)} {row.unit}
        </span>
      )
    },
    { key: "min", header: "Min", align: "right", sortValue: (row) => row.minStock, render: (row) => formatNumber(row.minStock) },
    {
      key: "state",
      header: "Status Stok",
      render: (row) =>
        row.stock === 0 ? (
          <StatusBadge value="Nonaktif" className="bg-rose-100 text-rose-700" />
        ) : row.stock <= row.minStock ? (
          <StatusBadge value="DP" className="bg-amber-100 text-amber-700" />
        ) : (
          <StatusBadge value="Aktif" />
        )
    },
    {
      key: "action",
      header: "",
      width: "180px",
      render: (row) => (
        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Button size="sm" variant="outline" onClick={() => setMutation({ type: "stock_in", product: row })}>
            <ArrowDownToLine className="h-3.5 w-3.5" /> Masuk
          </Button>
          <Button size="sm" variant="outline" onClick={() => setMutation({ type: "stock_out", product: row })}>
            <ArrowUpFromLine className="h-3.5 w-3.5" /> Keluar
          </Button>
        </div>
      )
    }
  ];

  const movementColumns: Column<StockMovement>[] = [
    { key: "id", header: "Kode", width: "100px", sortValue: (row) => row.id, render: (row) => <span className="font-mono text-[11px] text-slate-600">{row.id}</span> },
    { key: "date", header: "Tanggal", sortValue: (row) => row.date, render: (row) => formatDate(row.date) },
    { key: "sku", header: "SKU", width: "120px", render: (row) => <span className="font-mono text-[11px] text-slate-600">{row.sku}</span>, sortValue: (row) => row.sku },
    { key: "item", header: "Barang", sortValue: (row) => row.item, render: (row) => <span className="text-xs font-medium text-slate-700">{row.item}</span> },
    { key: "type", header: "Tipe", render: (row) => <StatusBadge value={row.type} />, sortValue: (row) => row.type },
    {
      key: "qty",
      header: "Qty",
      align: "right",
      sortValue: (row) => row.qty,
      render: (row) => (
        <span className={cn("font-semibold", row.type === "stock_in" || row.type === "return" ? "text-emerald-600" : "text-rose-600")}>
          {row.type === "stock_in" || row.type === "return" ? "+" : "-"}
          {formatNumber(row.qty)}
        </span>
      )
    },
    { key: "note", header: "Catatan", render: (row) => <span className="text-xs text-slate-500">{row.note}</span> },
    { key: "admin", header: "Petugas", render: (row) => row.admin, sortValue: (row) => row.admin }
  ];

  const lowCount = products.filter((p) => p.stock <= p.minStock && p.stock > 0).length;
  const outCount = products.filter((p) => p.stock === 0).length;
  const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);

  return (
    <div className="space-y-3">
      <PageHeader
        title="Stok"
        description="Pantau ketersediaan barang, catat mutasi masuk/keluar, dan lakukan penyesuaian stok."
        actions={
          <>
            <Button onClick={() => setMutation({ type: "adjustment", product: null })}>
              <Settings2 className="h-3.5 w-3.5" /> Penyesuaian
            </Button>
            <Button onClick={() => setMutation({ type: "stock_out", product: null })}>
              <ArrowUpFromLine className="h-3.5 w-3.5" /> Stok Keluar
            </Button>
            <Button variant="primary" onClick={() => setMutation({ type: "stock_in", product: null })}>
              <ArrowDownToLine className="h-3.5 w-3.5" /> Stok Masuk
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Unit Stok" value={formatNumber(totalUnits)} detail={`${products.length} jenis barang`} icon={Boxes} tone="sky" />
        <StatCard label="Stok Rendah" value={formatNumber(lowCount)} detail="Di bawah stok minimum" icon={AlertTriangle} tone="amber" />
        <StatCard label="Stok Habis" value={formatNumber(outCount)} detail="Perlu segera restok" icon={PackageX} tone="rose" />
        <StatCard label="Mutasi Tercatat" value={formatNumber(stockMovements.length)} detail="Riwayat pergerakan" icon={History} tone="violet" />
      </div>

      <Tabs defaultValue="persediaan">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <TabsList>
            <TabsTrigger value="persediaan">Persediaan Barang</TabsTrigger>
            <TabsTrigger value="mutasi">Riwayat Mutasi</TabsTrigger>
          </TabsList>
          <div className="text-xs text-slate-500">
            {filteredProducts.length} barang · {filteredMovements.length} mutasi
          </div>
        </div>

        <TabsContent value="persediaan" className="space-y-3">
          <TableToolbar search={search} onSearch={setSearch} placeholder="Cari SKU atau nama barang…">
            <Select className="w-40" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">Semua Kategori</option>
              {Array.from(new Set(products.map((p) => p.category))).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </Select>
            <Select className="w-40" value={only} onChange={(e) => setOnly(e.target.value as "all" | "low" | "out")}>
              <option value="all">Semua Stok</option>
              <option value="low">Stok Rendah</option>
              <option value="out">Stok Habis</option>
            </Select>
          </TableToolbar>
          <DataTable
            columns={productColumns}
            rows={filteredProducts}
            getRowId={(row) => row.sku}
            onRowClick={setSelected}
            activeRowId={selected?.sku}
            emptyTitle="Barang tidak ditemukan"
          />
        </TabsContent>

        <TabsContent value="mutasi" className="space-y-3">
          <TableToolbar search={search} onSearch={setSearch} placeholder="Cari kode, SKU, atau catatan mutasi…">
            <Select className="w-40" value={only} onChange={(e) => setOnly(e.target.value as "all" | "low" | "out")}>
              <option value="all">Semua Tipe</option>
              <option value="low">Barang Keluar</option>
              <option value="out">Retur</option>
            </Select>
          </TableToolbar>
          <DataTable
            columns={movementColumns}
            rows={filteredMovements}
            getRowId={(row) => row.id}
            emptyTitle="Belum ada mutasi stok"
            emptyDescription="Catat stok masuk/keluar untuk melihat riwayat di sini."
          />
        </TabsContent>
      </Tabs>

      {/* Detail barang */}
      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ""}
        description={selected ? `${selected.sku} · ${selected.category} · lokasi ${selected.location}` : ""}
        size="md"
        footer={
          <>
            <Button onClick={() => setSelected(null)}>Tutup</Button>
            <Button variant="primary" onClick={() => { setMutation({ type: "stock_in", product: selected }); setSelected(null); }}>
              Catat Mutasi
            </Button>
          </>
        }
      >
        {selected ? (
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
            {[
              ["Stok Saat Ini", `${formatNumber(selected.stock)} ${selected.unit}`],
              ["Stok Minimum", `${formatNumber(selected.minStock)} ${selected.unit}`],
              ["Merk", selected.brand],
              ["Tipe / Varian", selected.variant || "-"],
              ["Ukuran", selected.size || "-"],
              ["Lokasi Rak", selected.location]
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] uppercase tracking-wide text-slate-400">{label}</dt>
                <dd className="mt-0.5 font-medium text-slate-700">{value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </Modal>

      <StockMutationModal
        open={Boolean(mutation)}
        onClose={() => setMutation(null)}
        type={mutation?.type ?? "stock_in"}
        product={mutation?.product ?? null}
      />
    </div>
  );
}
