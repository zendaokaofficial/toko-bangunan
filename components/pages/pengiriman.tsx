"use client";

import * as React from "react";
import {
  CalendarDays,
  CheckCircle2,
  CircleDashed,
  MapPin,
  PackageCheck,
  Printer,
  Truck,
  User
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { Select } from "@/components/ui/select";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatDate } from "@/lib/format";
import { deliveries, type Delivery, type DeliveryStatus } from "@/data/mock";
import { cn } from "@/lib/utils";

const statusFlow: DeliveryStatus[] = ["Dijadwalkan", "Diproses", "Dikirim", "Selesai"];

/* Kumpulan tanggal unik untuk kalender minggu ini (start Senin). */
const anchorDate = "2026-10-05";
const weekDays = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

function buildWeek(anchor: string) {
  const base = new Date(`${anchor}T00:00:00`);
  const dow = (base.getDay() + 6) % 7; // 0 = Senin
  const monday = new Date(base);
  monday.setDate(base.getDate() - dow);
  return weekDays.map((label, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = d.toISOString().slice(0, 10);
    return { label, iso, day: d.getDate() };
  });
}

export function PengirimanPage() {
  const [statusFilter, setStatusFilter] = React.useState<DeliveryStatus | "Semua">("Semua");
  const [selected, setSelected] = React.useState<Delivery | null>(null);
  const [dateFilter, setDateFilter] = React.useState<string | "all">("all");

  const week = React.useMemo(() => buildWeek(anchorDate), []);

  const counts = React.useMemo(() => {
    const c: Record<string, number> = { Semua: deliveries.length };
    statusFlow.forEach((s) => (c[s] = deliveries.filter((d) => d.status === s).length));
    c.Gagal = deliveries.filter((d) => d.status === "Gagal").length;
    return c;
  }, []);

  const filtered = React.useMemo(() => {
    return deliveries
      .filter((d) => statusFilter === "Semua" || d.status === statusFilter)
      .filter((d) => dateFilter === "all" || d.date === dateFilter)
      .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));
  }, [statusFilter, dateFilter]);

  const todayDeliveries = deliveries.filter((d) => d.date === anchorDate);
  const inTransit = deliveries.filter((d) => d.status === "Dikirim").length;
  const done = deliveries.filter((d) => d.status === "Selesai").length;

  return (
    <div className="space-y-3">
      <PageHeader
        title="Pengiriman"
        description="Jadwalkan armada, pantau status kirim, dan cetak surat jalan untuk setiap pesanan."
        actions={
          <Button variant="primary">
            <CalendarDays className="h-3.5 w-3.5" /> Jadwalkan Pengiriman
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Kirim Hari Ini" value={String(todayDeliveries.length)} detail={formatDate(anchorDate)} icon={Truck} tone="sky" />
        <StatCard label="Sedang Diantar" value={String(inTransit)} detail="Armada di jalan" icon={CircleDashed} tone="amber" />
        <StatCard label="Selesai" value={String(done)} detail="Terkirim & diterima" icon={CheckCircle2} tone="emerald" />
        <StatCard label="Total Jadwal" value={String(deliveries.length)} detail="Minggu ini" icon={PackageCheck} tone="violet" />
      </div>

      {/* Kalender mingguan */}
      <div className="admin-card">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <h2 className="text-sm font-semibold text-slate-800">Jadwal Minggu Ini</h2>
          <span className="text-[11px] text-slate-400">5 – 11 Okt 2026</span>
        </div>
        <div className="grid grid-cols-7 divide-x divide-border">
          {week.map((day) => {
            const items = deliveries.filter((d) => d.date === day.iso);
            const isToday = day.iso === anchorDate;
            return (
              <button
                key={day.iso}
                type="button"
                onClick={() => setDateFilter((prev) => (prev === day.iso ? "all" : day.iso))}
                className={cn(
                  "min-h-[120px] p-2 text-left transition-colors hover:bg-slate-50",
                  dateFilter === day.iso && "bg-sky-50/70",
                  isToday && "bg-sky-50/40"
                )}
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase text-slate-400">{day.label}</span>
                  <span className={cn("text-[11px]", isToday ? "font-semibold text-sky-600" : "text-slate-400")}>
                    {day.day}
                  </span>
                </div>
                <div className="space-y-1">
                  {items.length === 0 ? (
                    <span className="text-[10px] text-slate-300">—</span>
                  ) : (
                    items.map((d) => (
                      <div
                        key={d.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected(d);
                        }}
                        className="rounded border border-border bg-white px-1.5 py-1 text-[10px] leading-tight shadow-sm hover:border-sky-300"
                      >
                        <span className="block font-mono text-[9px] text-sky-700">{d.time}</span>
                        <span className="block truncate font-medium text-slate-700">{d.customer}</span>
                      </div>
                    ))
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as DeliveryStatus | "Semua")}
          className="w-44"
        >
          <option value="Semua">Semua Status ({counts.Semua})</option>
          {statusFlow.map((s) => (
            <option key={s} value={s}>
              {s} ({counts[s]})
            </option>
          ))}
          <option value="Gagal">Gagal ({counts.Gagal})</option>
        </Select>
        {dateFilter !== "all" ? (
          <button
            type="button"
            onClick={() => setDateFilter("all")}
            className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 px-2.5 py-1 text-[11px] text-sky-700"
          >
            Tanggal: {formatDate(dateFilter)} ✕
          </button>
        ) : null}
        <span className="ml-auto text-xs text-slate-500">{filtered.length} jadwal</span>
      </div>

      {/* Daftar pengiriman */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((d) => (
          <button
            key={d.id}
            type="button"
            onClick={() => setSelected(d)}
            className="admin-card group flex flex-col gap-2 p-3 text-left transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-mono text-[11px] font-semibold text-sky-700">{d.id}</span>
                <p className="text-sm font-semibold text-slate-800">{d.customer}</p>
              </div>
              <StatusBadge value={d.status} />
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <CalendarDays className="h-3 w-3" /> {formatDate(d.date)} · {d.time}
            </div>
            <div className="flex items-start gap-1.5 text-[11px] text-slate-500">
              <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
              <span className="line-clamp-2">{d.address}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Truck className="h-3 w-3" /> {d.vehicle}
            </div>
            <div className="mt-1 flex items-center justify-between border-t border-border pt-2">
              <span className="font-mono text-[10px] text-slate-400">{d.invoice}</span>
              <span className="inline-flex items-center gap-1 text-[11px] text-slate-600">
                <User className="h-3 w-3" /> {d.driver}
              </span>
            </div>
          </button>
        ))}
        {filtered.length === 0 ? (
          <div className="admin-card col-span-full p-8 text-center text-xs text-slate-400">
            Tidak ada jadwal pengiriman untuk filter ini.
          </div>
        ) : null}
      </div>

      {/* Drawer detail pengiriman */}
      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? `Pengiriman ${selected.id}` : ""}
        description={selected ? `${selected.invoice} · ${selected.customer}` : ""}
        width="md"
        footer={
          <>
            <Button onClick={() => setSelected(null)}>Tutup</Button>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="h-3.5 w-3.5" /> Cetak Surat Jalan
            </Button>
            <Button
              variant="primary"
              disabled={
                !selected ||
                selected.status === "Selesai" ||
                selected.status === "Gagal"
              }
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Perbarui Status
            </Button>
          </>
        }
      >
        {selected ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <StatusBadge value={selected.status} />
              <Badge tone="neutral">{selected.vehicle}</Badge>
            </div>

            {/* Progress status */}
            <div className="flex items-center gap-1">
              {statusFlow.map((step, i) => {
                const activeIndex = statusFlow.indexOf(selected.status);
                const reached = i <= activeIndex && selected.status !== "Gagal";
                return (
                  <React.Fragment key={step}>
                    <div className="flex flex-1 flex-col items-center gap-1">
                      <div
                        className={cn(
                          "flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold",
                          reached ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-400"
                        )}
                      >
                        {i + 1}
                      </div>
                      <span className={cn("text-[10px]", reached ? "text-slate-700" : "text-slate-400")}>{step}</span>
                    </div>
                    {i < statusFlow.length - 1 ? (
                      <div className={cn("mb-4 h-0.5 flex-1", reached ? "bg-sky-500" : "bg-slate-200")} />
                    ) : null}
                  </React.Fragment>
                );
              })}
            </div>
            {selected.status === "Gagal" ? (
              <div className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">
                Pengiriman gagal / dibatalkan. Silakan jadwalkan ulang.
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Tanggal & Waktu</p>
                <p className="font-medium text-slate-700">
                  {formatDate(selected.date)} · {selected.time}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Invoice</p>
                <p className="font-mono font-medium text-sky-700">{selected.invoice}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Alamat Kirim</p>
                <p className="text-slate-700">{selected.address}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Driver</p>
                <p className="font-medium text-slate-700">{selected.driver}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wide text-slate-400">Kendaraan</p>
                <p className="font-medium text-slate-700">{selected.vehicle}</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-800">Barang Diangkut</p>
              <div className="divide-y divide-border rounded-md border border-border text-xs">
                {selected.items.split(", ").map((item, i) => (
                  <div key={i} className="px-3 py-2 text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-md border border-dashed border-border p-3">
              <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">Ubah Status</p>
              <Select defaultValue={selected.status} className="w-full">
                {statusFlow.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
                <option value="Gagal">Gagal</option>
              </Select>
              <p className="mt-2 text-[10px] text-slate-400">
                Catatan: perubahan status pada prototype ini bersifat dummy.
              </p>
            </div>
          </div>
        ) : null}
      </Drawer>
    </div>
  );
}
