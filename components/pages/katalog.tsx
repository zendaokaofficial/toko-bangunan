"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  Boxes,
  Check,
  Filter,
  Package,
  PackagePlus,
  SortAsc,
  Upload
} from "lucide-react";
import { DataTable, type Column } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { TableToolbar } from "@/components/table-toolbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatRp, formatNumber } from "@/lib/format";
import { categories, products, type Product, type ProductStatus } from "@/data/mock";
import { cn } from "@/lib/utils";

const emptyForm = {
  sku: "",
  name: "",
  category: "Semen",
  variant: "",
  brand: "",
  size: "",
  unit: "sak",
  stock: "0",
  minStock: "0",
  price: "0",
  cost: "0",
  status: "Aktif" as ProductStatus,
  location: ""
};

/** Kolom form dibagi agar modal tetap ringkas dan mudah dipindai. */
function Field({
  label,
  children,
  className
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1", className)}>
      <Label>{label}</Label>
      {children}
    </label>
  );
}

function ProductForm({
  value,
  onChange
}: {
  value: typeof emptyForm;
  onChange: (next: typeof emptyForm) => void;
}) {
  const set = (key: keyof typeof emptyForm, val: string) => onChange({ ...value, [key]: val });
  return (
    <div className="grid grid-cols-2 gap-3">
      <Field label="SKU">
        <Input value={value.sku} onChange={(e) => set("sku", e.target.value)} placeholder="SMN-001" />
      </Field>
      <Field label="Status">
        <Select value={value.status} onChange={(e) => set("status", e.target.value)}>
          <option value="Aktif">Aktif</option>
          <option value="Nonaktif">Nonaktif</option>
        </Select>
      </Field>
      <Field label="Nama Barang" className="col-span-2">
        <Input value={value.name} onChange={(e) => set("name", e.target.value)} placeholder="Semen Gresik 40kg" />
      </Field>
      <Field label="Kategori">
        <Select value={value.category} onChange={(e) => set("category", e.target.value)}>
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Merk">
        <Input value={value.brand} onChange={(e) => set("brand", e.target.value)} placeholder="Gresik" />
      </Field>
      <Field label="Tipe / Varian">
        <Input value={value.variant} onChange={(e) => set("variant", e.target.value)} placeholder="PC / 40kg" />
      </Field>
      <Field label="Ukuran">
        <Input value={value.size} onChange={(e) => set("size", e.target.value)} placeholder="40 kg" />
      </Field>
      <Field label="Satuan">
        <Input value={value.unit} onChange={(e) => set("unit", e.target.value)} placeholder="sak" />
      </Field>
      <Field label="Lokasi Rak">
        <Input value={value.location} onChange={(e) => set("location", e.target.value)} placeholder="Rak A2" />
      </Field>
      <Field label="Harga Jual">
        <Input type="number" value={value.price} onChange={(e) => set("price", e.target.value)} />
      </Field>
      <Field label="Harga Beli (HPP)">
        <Input type="number" value={value.cost} onChange={(e) => set("cost", e.target.value)} />
      </Field>
      <Field label="Stok Saat Ini">
        <Input type="number" value={value.stock} onChange={(e) => set("stock", e.target.value)} />
      </Field>
      <Field label="Stok Minimum">
        <Input type="number" value={value.minStock} onChange={(e) => set("minStock", e.target.value)} />
      </Field>
    </div>
  );
}

export function KatalogPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = React.useState("");
  const [category, setCategory] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [lowOnly, setLowOnly] = React.useState(false);
  const [selected, setSelected] = React.useState<Product | null>(null);
  const [formOpen, setFormOpen] = React.useState(false);
  const [form, setForm] = React.useState(emptyForm);

  // Buka form tambah bila diarahkan dengan ?action=tambah
  React.useEffect(() => {
    if (searchParams.get("action") === "tambah") setFormOpen(true);
  }, [searchParams]);

  const filtered = React.useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return products.filter((item) => {
      const matchKeyword =
        keyword.length === 0 ||
        [item.sku, item.name, item.brand, item.variant].some((field) => field.toLowerCase().includes(keyword));
      const matchCategory = category === "all" || item.category === category;
      const matchStatus = status === "all" || item.status === status;
      const matchLow = !lowOnly || item.stock <= item.minStock;
      return matchKeyword && matchCategory && matchStatus && matchLow;
    });
  }, [search, category, status, lowOnly]);

  const columns: Column<Product>[] = [
    {
      key: "sku",
      header: "SKU",
      width: "120px",
      sortValue: (row) => row.sku,
      render: (row) => <span className="font-mono text-[11px] font-medium text-slate-700">{row.sku}</span>
    },
    {
      key: "name",
      header: "Nama Barang",
      sortValue: (row) => row.name,
      render: (row) => (
        <div className="min-w-0">
          <p className="truncate text-xs font-medium text-slate-800">{row.name}</p>
          <p className="text-[11px] text-slate-400">
            {row.brand} {row.variant ? `· ${row.variant}` : ""}
          </p>
        </div>
      )
    },
    { key: "category", header: "Kategori", sortValue: (row) => row.category, render: (row) => <Badge tone="neutral">{row.category}</Badge> },
    { key: "size", header: "Ukuran", render: (row) => row.size || "-", sortValue: (row) => row.size },
    { key: "unit", header: "Satuan", render: (row) => row.unit, sortValue: (row) => row.unit },
    {
      key: "stock",
      header: "Stok",
      align: "right",
      sortValue: (row) => row.stock,
      render: (row) => {
        const low = row.stock <= row.minStock;
        const out = row.stock === 0;
        return (
          <span className={cn("font-semibold", out ? "text-rose-600" : low ? "text-amber-600" : "text-slate-700")}>
            {formatNumber(row.stock)}
          </span>
        );
      }
    },
    { key: "price", header: "Harga Jual", align: "right", render: (row) => formatRp(row.price), sortValue: (row) => row.price },
    { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} />, sortValue: (row) => row.status },
    {
      key: "action",
      header: "",
      width: "56px",
      render: (row) => (
        <Button variant="ghost" size="sm" onClick={() => setSelected(row)}>
          Detail
        </Button>
      )
    }
  ];

  const activeCount = products.filter((p) => p.status === "Aktif").length;
  const lowCount = products.filter((p) => p.stock <= p.minStock).length;
  const totalValue = products.reduce((sum, p) => sum + p.stock * p.cost, 0);

  const handleSave = () => {
    // Prototype: aksi dummy, tidak menyimpan ke backend.
    setFormOpen(false);
    setForm(emptyForm);
  };

  return (
    <div className="space-y-3">
      <PageHeader
        title="Katalog Barang"
        description="Daftar semua barang toko beserta SKU, kategori, harga jual, dan status ketersediaan."
        actions={
          <>
            <Button asChild>
              <Link href="/upload">
                <Upload className="h-3.5 w-3.5" /> Upload Data
              </Link>
            </Button>
            <Button variant="primary" onClick={() => { setForm(emptyForm); setFormOpen(true); }}>
              <PackagePlus className="h-3.5 w-3.5" /> Tambah Barang
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Barang" value={formatNumber(products.length)} detail={`${categories.length} kategori`} icon={Package} tone="sky" />
        <StatCard label="Barang Aktif" value={formatNumber(activeCount)} detail={`${products.length - activeCount} nonaktif`} icon={Check} tone="emerald" />
        <StatCard label="Stok Rendah" value={formatNumber(lowCount)} detail="Perlu restok" icon={AlertTriangle} tone="rose" />
        <StatCard label="Nilai Stok (HPP)" value={formatRp(totalValue)} detail="Estimasi modal barang" icon={Boxes} tone="violet" />
      </div>

      <TableToolbar search={search} onSearch={setSearch} placeholder="Cari SKU, nama barang, atau merk…">
        <div className="relative">
          <Filter className="pointer-events-none absolute left-2 top-2 h-4 w-4 text-slate-400" />
          <Select className="w-40 pl-8" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">Semua Kategori</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>
        <Select className="w-36" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="all">Semua Status</option>
          <option value="Aktif">Aktif</option>
          <option value="Nonaktif">Nonaktif</option>
        </Select>
        <Button
          variant={lowOnly ? "primary" : "outline"}
          onClick={() => setLowOnly((prev) => !prev)}
        >
          <SortAsc className="h-3.5 w-3.5" /> {lowOnly ? "Filter: Stok Rendah" : "Stok Rendah"}
        </Button>
      </TableToolbar>

      <div className="flex items-center justify-between px-1 text-xs text-slate-500">
        <span>
          Menampilkan <strong className="text-slate-700">{filtered.length}</strong> dari {products.length} barang
        </span>
      </div>

      <DataTable
        columns={columns}
        rows={filtered}
        getRowId={(row) => row.sku}
        onRowClick={setSelected}
        activeRowId={selected?.sku}
        emptyTitle="Barang tidak ditemukan"
        emptyDescription="Ubah kata kunci atau kosongkan filter untuk melihat semua barang."
      />

      {/* Drawer detail barang */}
      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected?.name ?? ""}
        description={selected ? `${selected.sku} · ${selected.category}` : ""}
        size="lg"
        footer={
          <>
            <Button onClick={() => setSelected(null)}>Tutup</Button>
            <Button variant="primary" onClick={() => { setSelected(null); setForm(emptyForm); setFormOpen(true); }}>
              Edit Barang
            </Button>
          </>
        }
      >
        {selected ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <StatusBadge value={selected.status} />
              {selected.stock <= selected.minStock ? <Badge tone="danger">Stok Rendah</Badge> : <Badge tone="success">Stok Aman</Badge>}
              <Badge tone="neutral">{selected.location}</Badge>
            </div>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs sm:grid-cols-3">
              {[
                ["Merk", selected.brand],
                ["Tipe / Varian", selected.variant || "-"],
                ["Ukuran", selected.size || "-"],
                ["Satuan", selected.unit],
                ["Harga Jual", formatRp(selected.price)],
                ["Harga Beli (HPP)", formatRp(selected.cost)],
                ["Margin", `${Math.round(((selected.price - selected.cost) / selected.price) * 100)}%`],
                ["Stok Saat Ini", `${formatNumber(selected.stock)} ${selected.unit}`],
                ["Stok Minimum", `${formatNumber(selected.minStock)} ${selected.unit}`]
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[11px] uppercase tracking-wide text-slate-400">{label}</dt>
                  <dd className="mt-0.5 font-medium text-slate-700">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}
      </Modal>

      {/* Modal tambah barang */}
      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="Tambah Barang Baru"
        description="Lengkapi data barang. SKU harus unik dan tidak boleh sama dengan barang lain."
        size="xl"
        footer={
          <>
            <Button onClick={() => setFormOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={handleSave}>
              Simpan Barang
            </Button>
          </>
        }
      >
        <ProductForm value={form} onChange={setForm} />
      </Modal>
    </div>
  );
}
