const rupiah = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
});

const number = new Intl.NumberFormat("id-ID");

/** Format angka menjadi Rupiah tanpa desimal: Rp1.250.000 */
export function formatRp(value: number): string {
  return rupiah.format(Number.isFinite(value) ? value : 0);
}

/** Format angka ribuan: 12.500 */
export function formatNumber(value: number): string {
  return number.format(Number.isFinite(value) ? value : 0);
}

/** Format tanggal ISO (YYYY-MM-DD) menjadi 5 Okt 2026 */
export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
}

/** Format tanggal + jam: 5 Okt 2026 09:00 */
export function formatDateTime(value: string): string {
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

/** Nama hari singkat dari tanggal ISO: Sen, Sel, ... */
export function weekdayShort(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(date);
}

/** Hitung sisa tagihan, tidak pernah negatif. */
export function remaining(total: number, paid: number): number {
  return Math.max(total - paid, 0);
}
