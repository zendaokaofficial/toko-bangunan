import type { Role } from "@/data/mock";

export type NavKey =
  | "dashboard"
  | "katalog"
  | "stok"
  | "upload"
  | "transaksi"
  | "pembayaran"
  | "pengiriman"
  | "invoice"
  | "customer"
  | "laporan"
  | "admin-role";

export type NavItem = {
  key: NavKey;
  label: string;
  href: string;
  icon: string; // nama ikon lucide, dipetakan di sidebar
  roles: Role[];
  group: "Operasional" | "Keuangan" | "Pengaturan";
  description: string;
};

/** Definisi navigasi tunggal yang dipakai sidebar, breadcrumb, dan halaman. */
export const navItems: NavItem[] = [
  { key: "dashboard", label: "Dashboard", href: "/", icon: "LayoutDashboard", group: "Operasional", description: "Ringkasan operasional harian", roles: ["Super Admin", "Admin Stock", "Admin Pembayaran", "Admin Kirim"] },
  { key: "katalog", label: "Katalog Barang", href: "/katalog", icon: "Boxes", group: "Operasional", description: "Daftar produk dan harga jual", roles: ["Super Admin", "Admin Stock", "Admin Pembayaran", "Admin Kirim"] },
  { key: "stok", label: "Stok", href: "/stok", icon: "PackagePlus", group: "Operasional", description: "Persediaan dan pergerakan stok", roles: ["Super Admin", "Admin Stock"] },
  { key: "upload", label: "Upload Data", href: "/upload", icon: "Upload", group: "Operasional", description: "Import katalog dan update stok", roles: ["Super Admin", "Admin Stock"] },
  { key: "transaksi", label: "Transaksi", href: "/transaksi", icon: "ClipboardList", group: "Keuangan", description: "Daftar dan pembuatan transaksi", roles: ["Super Admin", "Admin Pembayaran"] },
  { key: "pembayaran", label: "Pembayaran", href: "/pembayaran", icon: "WalletCards", group: "Keuangan", description: "DP, pelunasan, dan bukti transfer", roles: ["Super Admin", "Admin Pembayaran"] },
  { key: "pengiriman", label: "Pengiriman", href: "/pengiriman", icon: "Truck", group: "Operasional", description: "Jadwal kirim dan surat jalan", roles: ["Super Admin", "Admin Kirim"] },
  { key: "invoice", label: "Invoice", href: "/invoice", icon: "ReceiptText", group: "Keuangan", description: "Cetak dan unduh invoice", roles: ["Super Admin", "Admin Pembayaran", "Admin Kirim"] },
  { key: "customer", label: "Customer", href: "/customer", icon: "Users", group: "Operasional", description: "Data pelanggan dan piutang", roles: ["Super Admin", "Admin Pembayaran", "Admin Kirim"] },
  { key: "laporan", label: "Laporan", href: "/laporan", icon: "BarChart3", group: "Keuangan", description: "Laporan penjualan dan stok", roles: ["Super Admin"] },
  { key: "admin-role", label: "Admin & Role", href: "/admin-role", icon: "ShieldCheck", group: "Pengaturan", description: "Manajemen user dan hak akses", roles: ["Super Admin"] }
];

export const allRoles: Role[] = ["Super Admin", "Admin Stock", "Admin Pembayaran", "Admin Kirim"];

export function navForRole(role: Role): NavItem[] {
  return navItems.filter((item) => item.roles.includes(role));
}

export function findNav(pathname: string): NavItem | undefined {
  if (pathname === "/") return navItems.find((item) => item.key === "dashboard");
  return navItems.find((item) => item.href !== "/" && pathname.startsWith(item.href));
}
