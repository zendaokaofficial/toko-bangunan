import { Badge } from "@/components/ui/badge";

export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral" | "purple";

/**
 * Petakan sebuah status menjadi nada warna yang konsisten.
 * Dipakai oleh semua modul agar status pembayaran, pengiriman, stok, dsb seragam.
 */
export function statusTone(value: string): StatusTone {
  const v = value.toLowerCase();
  if (/(lunas|selesai|aktif|aman|valid|stock_in|masuk|berhasil)/.test(v)) return "success";
  if (/(dp|dijadwalkan|diproses|rendah|warning|sebagian|selisih)/.test(v)) return "warning";
  if (/(belum|gagal|error|habis|nonaktif|batal|kurang|stock_out)/.test(v)) return "danger";
  if (/(dikirim|invoice|return|adjustment|info)/.test(v)) return "info";
  if (/(proyek|kontraktor|retail)/.test(v)) return "purple";
  return "neutral";
}

export function StatusBadge({ value, className }: { value: string; className?: string }) {
  // Perbaiki label movement agar lebih enak dibaca.
  const label = value
    .replace("stock_in", "Stock In")
    .replace("stock_out", "Stock Out")
    .replace("adjustment", "Adjustment");
  return (
    <Badge tone={statusTone(value)} className={className}>
      {label}
    </Badge>
  );
}
