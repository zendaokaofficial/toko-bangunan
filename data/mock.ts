// ---------------------------------------------------------------------------
// Dummy data lokal untuk prototype admin toko bangunan.
// Struktur sengaja dibuat mendekati bentuk API response supaya nanti mudah
// diganti dengan service layer / fetch tanpa mengubah konsep layar.
// ---------------------------------------------------------------------------

export type Role = "Super Admin" | "Admin Stock" | "Admin Pembayaran" | "Admin Kirim";

export type PaymentStatus = "Belum Dibayar" | "DP" | "Lunas";
export type DeliveryStatus = "Dijadwalkan" | "Diproses" | "Dikirim" | "Selesai" | "Gagal";
export type PaymentMethod = "Cash" | "Transfer Manual" | "QRIS" | "Virtual Account";
export type MovementType = "stock_in" | "stock_out" | "adjustment" | "return";
export type ProductStatus = "Aktif" | "Nonaktif";

export type Product = {
  sku: string;
  name: string;
  category: string;
  variant: string;
  brand: string;
  size: string;
  unit: string;
  stock: number;
  minStock: number;
  price: number;
  cost: number;
  status: ProductStatus;
  location: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  type: "Retail" | "Proyek" | "Kontraktor";
  transactions: number;
  outstanding: number;
  since: string;
};

export type TransactionItem = {
  sku: string;
  name: string;
  qty: number;
  price: number;
};

export type Transaction = {
  invoice: string;
  date: string;
  customer: string;
  customerId: string;
  items: TransactionItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paid: number;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
  paymentMethod: PaymentMethod;
  admin: string;
  note?: string;
};

export type Payment = {
  id: string;
  invoice: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  admin: string;
  proofName?: string;
  note?: string;
};

export type StockMovement = {
  id: string;
  date: string;
  sku: string;
  item: string;
  type: MovementType;
  qty: number;
  note: string;
  admin: string;
};

export type Delivery = {
  id: string;
  date: string;
  time: string;
  invoice: string;
  customer: string;
  address: string;
  items: string;
  status: DeliveryStatus;
  driver: string;
  vehicle: string;
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "Aktif" | "Nonaktif";
  lastLogin: string;
};

// ---------------------------------------------------------------------------
// Produk / katalog
// ---------------------------------------------------------------------------
export const products: Product[] = [
  { sku: "KRM-100-ASW", name: "Keramik Lantai Glossy", category: "Keramik", variant: "100x100 Asia Tile Putih", brand: "Asia Tile", size: "100x100", unit: "dus", stock: 42, minStock: 12, price: 185000, cost: 148000, status: "Aktif", location: "A1-02" },
  { sku: "KRM-050-PLC", name: "Keramik Lantai Matte", category: "Keramik", variant: "50x50 Platinum Cream", brand: "Platinum", size: "50x50", unit: "dus", stock: 9, minStock: 15, price: 92000, cost: 71000, status: "Aktif", location: "A1-03" },
  { sku: "KRM-060-MTA", name: "Keramik Dinding", category: "Keramik", variant: "60x60 Milan Abu", brand: "Milan", size: "60x60", unit: "dus", stock: 31, minStock: 10, price: 128000, cost: 99000, status: "Aktif", location: "A1-04" },
  { sku: "KRM-040-ROM", name: "Keramik Lantai Rustic", category: "Keramik", variant: "40x40 Roman Terra", brand: "Roman", size: "40x40", unit: "dus", stock: 58, minStock: 20, price: 76000, cost: 58000, status: "Aktif", location: "A1-05" },
  { sku: "KRM-080-GRN", name: "Keramik Granit", category: "Keramik", variant: "80x80 Granito Matt", brand: "Granito", size: "80x80", unit: "dus", stock: 5, minStock: 12, price: 210000, cost: 168000, status: "Aktif", location: "A2-01" },
  { sku: "TRN-1000-PGN", name: "Toren Air", category: "Toren", variant: "1000L Penguin Orange", brand: "Penguin", size: "1000L", unit: "unit", stock: 6, minStock: 4, price: 1850000, cost: 1520000, status: "Aktif", location: "Yard-01" },
  { sku: "TRN-550-PGN", name: "Toren Air", category: "Toren", variant: "550L Penguin Biru", brand: "Penguin", size: "550L", unit: "unit", stock: 3, minStock: 5, price: 1090000, cost: 880000, status: "Aktif", location: "Yard-01" },
  { sku: "TRN-2000-PGN", name: "Toren Air Kecil", category: "Toren", variant: "2000L Penguin Tanam", brand: "Penguin", size: "2000L", unit: "unit", stock: 2, minStock: 3, price: 3250000, cost: 2700000, status: "Aktif", location: "Yard-02" },
  { sku: "SMN-50-TGR", name: "Semen Portland", category: "Semen", variant: "50kg Tiga Roda", brand: "Tiga Roda", size: "50kg", unit: "sak", stock: 180, minStock: 50, price: 69000, cost: 58000, status: "Aktif", location: "B2-01" },
  { sku: "SMN-40-GRS", name: "Semen Mortar", category: "Semen", variant: "40kg Grand Mortar", brand: "Grand Mortar", size: "40kg", unit: "sak", stock: 26, minStock: 30, price: 81000, cost: 67000, status: "Aktif", location: "B2-02" },
  { sku: "SMN-50-SMK", name: "Semen Putih", category: "Semen", variant: "50kg Semen Merah Putih", brand: "Semen Merah Putih", size: "50kg", unit: "sak", stock: 74, minStock: 40, price: 78000, cost: 64000, status: "Aktif", location: "B2-03" },
  { sku: "CAT-25-DLX", name: "Cat Interior", category: "Cat", variant: "2.5L Dulux Putih", brand: "Dulux", size: "2.5L", unit: "pail", stock: 22, minStock: 8, price: 176000, cost: 138000, status: "Aktif", location: "C1-02" },
  { sku: "CAT-20-NPN", name: "Cat Eksterior", category: "Cat", variant: "20L Nippon Weatherbond", brand: "Nippon", size: "20L", unit: "pail", stock: 7, minStock: 5, price: 1240000, cost: 1020000, status: "Aktif", location: "C1-03" },
  { sku: "CAT-05-AVN", name: "Cat Tembok", category: "Cat", variant: "5kg Avian Pro", brand: "Avian", size: "5kg", unit: "pail", stock: 34, minStock: 12, price: 245000, cost: 196000, status: "Aktif", location: "C1-05" },
  { sku: "PIP-075-WVN", name: "Pipa PVC", category: "Pipa", variant: "3 inch Wavin AW", brand: "Wavin", size: "3 inch", unit: "batang", stock: 74, minStock: 20, price: 96000, cost: 77000, status: "Aktif", location: "D1-01" },
  { sku: "PIP-050-RJN", name: "Pipa PVC", category: "Pipa", variant: "2 inch Rucika D", brand: "Rucika", size: "2 inch", unit: "batang", stock: 14, minStock: 18, price: 52000, cost: 41000, status: "Aktif", location: "D1-02" },
  { sku: "PIP-025-WVN", name: "Pipa PVC", category: "Pipa", variant: "1 inch Wavin AW", brand: "Wavin", size: "1 inch", unit: "batang", stock: 96, minStock: 24, price: 31000, cost: 24000, status: "Aktif", location: "D1-03" },
  { sku: "BSI-010-KRA", name: "Besi Beton Ulir", category: "Besi", variant: "10mm Krakatau", brand: "Krakatau", size: "10mm", unit: "batang", stock: 63, minStock: 25, price: 72000, cost: 58000, status: "Aktif", location: "E1-01" },
  { sku: "BSI-012-KRA", name: "Besi Beton Ulir", category: "Besi", variant: "12mm Krakatau", brand: "Krakatau", size: "12mm", unit: "batang", stock: 18, minStock: 20, price: 98000, cost: 79000, status: "Aktif", location: "E1-02" },
  { sku: "BSI-008-KRA", name: "Besi Beton Polos", category: "Besi", variant: "8mm Krakatau", brand: "Krakatau", size: "8mm", unit: "batang", stock: 120, minStock: 30, price: 46000, cost: 37000, status: "Aktif", location: "E1-03" },
  { sku: "GTG-PLC-MRN", name: "Genteng Beton", category: "Genteng", variant: "Flat Maroon Palentong", brand: "Palentong", size: "Flat", unit: "pcs", stock: 540, minStock: 150, price: 8400, cost: 6500, status: "Aktif", location: "Yard-03" },
  { sku: "GTG-KRM-RED", name: "Genteng Keramik", category: "Genteng", variant: "Kanmuri Merah", brand: "Kanmuri", size: "Standar", unit: "pcs", stock: 128, minStock: 200, price: 12800, cost: 10200, status: "Aktif", location: "Yard-03" },
  { sku: "PAS-001-KLI", name: "Pasir Bangka", category: "Material Curah", variant: "Ayak halus", brand: "Lokal", size: "m3", unit: "m3", stock: 16, minStock: 6, price: 310000, cost: 240000, status: "Aktif", location: "Yard-04" },
  { sku: "KRK-001-SPL", name: "Koral Split", category: "Material Curah", variant: "Split 1-2", brand: "Lokal", size: "m3", unit: "m3", stock: 9, minStock: 5, price: 285000, cost: 220000, status: "Aktif", location: "Yard-04" },
  { sku: "BAT-001-MRH", name: "Bata Merah", category: "Bata", variant: "Press standar", brand: "Lokal", size: "standar", unit: "pcs", stock: 4200, minStock: 1000, price: 950, cost: 720, status: "Aktif", location: "Yard-05" },
  { sku: "HBL-010-BLC", name: "Hebel", category: "Bata", variant: "10cm Blesscon", brand: "Blesscon", size: "10cm", unit: "pcs", stock: 280, minStock: 120, price: 11800, cost: 9400, status: "Aktif", location: "Yard-06" },
  { sku: "KYN-004-AVN", name: "Kuas Cat", category: "Perkakas", variant: "4 inch Avian", brand: "Avian", size: "4 inch", unit: "pcs", stock: 2, minStock: 10, price: 18000, cost: 13000, status: "Aktif", location: "C2-01" },
  { sku: "SKP-020-TGR", name: "Sekop Gagang Kayu", category: "Perkakas", variant: "20 inch Truper", brand: "Truper", size: "20 inch", unit: "pcs", stock: 11, minStock: 6, price: 96000, cost: 74000, status: "Aktif", location: "F1-01" },
  { sku: "PLM-001-SNI", name: "Plamir Tembok", category: "Cat", variant: "5kg Sanlex", brand: "Sanlex", size: "5kg", unit: "pail", stock: 0, minStock: 8, price: 48000, cost: 37000, status: "Nonaktif", location: "C1-04" },
  { sku: "AKS-002-KRM", name: "Kran Air Kuningan", category: "Perkakas", variant: "1/2 inch Sanwa", brand: "Sanwa", size: "1/2 inch", unit: "pcs", stock: 47, minStock: 15, price: 64000, cost: 48000, status: "Aktif", location: "F1-02" }
];

// ---------------------------------------------------------------------------
// Customer
// ---------------------------------------------------------------------------
export const customers: Customer[] = [
  { id: "CST-001", name: "Budi Hartono", phone: "0812-1100-2300", address: "Jl. Sawo Raya No. 18", city: "Bekasi", type: "Retail", transactions: 8, outstanding: 1250000, since: "2024-03-11" },
  { id: "CST-002", name: "CV Karya Mandiri", phone: "0813-8850-7712", address: "Ruko Sentra Niaga Blok C7", city: "Cikarang", type: "Kontraktor", transactions: 21, outstanding: 4850000, since: "2023-08-02" },
  { id: "CST-003", name: "Nadia Pratama", phone: "0878-3100-6612", address: "Perumahan Griya Citra Blok D2", city: "Depok", type: "Retail", transactions: 3, outstanding: 0, since: "2025-01-20" },
  { id: "CST-004", name: "Kontraktor Sinar Jaya", phone: "0821-9900-4421", address: "Jl. Raya Narogong KM 12", city: "Bogor", type: "Proyek", transactions: 14, outstanding: 7200000, since: "2023-11-15" },
  { id: "CST-005", name: "Hendra Wijaya", phone: "0817-2311-8080", address: "Jl. Melati 4 No. 9", city: "Tangerang", type: "Retail", transactions: 5, outstanding: 0, since: "2024-07-09" },
  { id: "CST-006", name: "PT Graha Renovasi", phone: "0811-7522-3010", address: "Jl. Pangeran Antasari No. 44", city: "Jakarta", type: "Proyek", transactions: 18, outstanding: 3000000, since: "2023-05-30" },
  { id: "CST-007", name: "Siti Aminah", phone: "0857-6612-0081", address: "Jl. Kutilang No. 7", city: "Bekasi", type: "Retail", transactions: 2, outstanding: 650000, since: "2025-04-02" },
  { id: "CST-008", name: "Mandor Agus", phone: "0896-4400-7711", address: "Proyek Cluster Magnolia", city: "Serpong", type: "Kontraktor", transactions: 11, outstanding: 2100000, since: "2024-01-25" }
];

// ---------------------------------------------------------------------------
// Transaksi
// ---------------------------------------------------------------------------
export const transactions: Transaction[] = [
  {
    invoice: "INV-2026-1001", date: "2026-10-05", customer: "CV Karya Mandiri", customerId: "CST-002",
    items: [
      { sku: "KRM-100-ASW", name: "Keramik Lantai Glossy 100x100", qty: 30, price: 185000 },
      { sku: "SMN-50-TGR", name: "Semen Portland 50kg", qty: 20, price: 69000 }
    ],
    subtotal: 6930000, discount: 95000, shipping: 1000000, total: 7835000, paid: 3000000,
    paymentStatus: "DP", deliveryStatus: "Dijadwalkan", paymentMethod: "Cash", admin: "Rina", note: "Proyek ruko blok C"
  },
  {
    invoice: "INV-2026-1002", date: "2026-10-05", customer: "Budi Hartono", customerId: "CST-001",
    items: [
      { sku: "PIP-050-RJN", name: "Pipa PVC 2 inch Rucika D", qty: 10, price: 52000 },
      { sku: "CAT-25-DLX", name: "Cat Interior 2.5L Dulux", qty: 4, price: 176000 }
    ],
    subtotal: 1224000, discount: 0, shipping: 26000, total: 1250000, paid: 0,
    paymentStatus: "Belum Dibayar", deliveryStatus: "Diproses", paymentMethod: "Cash", admin: "Dewi"
  },
  {
    invoice: "INV-2026-1003", date: "2026-10-04", customer: "Nadia Pratama", customerId: "CST-003",
    items: [{ sku: "CAT-20-NPN", name: "Cat Eksterior 20L Nippon", qty: 2, price: 1240000 }],
    subtotal: 2480000, discount: 50000, shipping: 950000, total: 3380000, paid: 3380000,
    paymentStatus: "Lunas", deliveryStatus: "Selesai", paymentMethod: "Transfer Manual", admin: "Dewi"
  },
  {
    invoice: "INV-2026-1004", date: "2026-10-04", customer: "Kontraktor Sinar Jaya", customerId: "CST-004",
    items: [
      { sku: "BSI-012-KRA", name: "Besi Beton Ulir 12mm", qty: 60, price: 98000 },
      { sku: "SMN-40-GRS", name: "Semen Mortar 40kg", qty: 40, price: 81000 }
    ],
    subtotal: 9120000, discount: 220000, shipping: 500000, total: 9400000, paid: 2200000,
    paymentStatus: "DP", deliveryStatus: "Dikirim", paymentMethod: "Cash", admin: "Rina", note: "Kirim bertahap 2 truk"
  },
  {
    invoice: "INV-2026-1005", date: "2026-10-03", customer: "Hendra Wijaya", customerId: "CST-005",
    items: [
      { sku: "KYN-004-AVN", name: "Kuas Cat 4 inch Avian", qty: 3, price: 18000 },
      { sku: "CAT-05-AVN", name: "Cat Tembok 5kg Avian", qty: 3, price: 245000 }
    ],
    subtotal: 789000, discount: 0, shipping: 86000, total: 875000, paid: 875000,
    paymentStatus: "Lunas", deliveryStatus: "Selesai", paymentMethod: "Cash", admin: "Dewi"
  },
  {
    invoice: "INV-2026-1006", date: "2026-10-03", customer: "PT Graha Renovasi", customerId: "CST-006",
    items: [
      { sku: "TRN-1000-PGN", name: "Toren 1000L Penguin", qty: 2, price: 1850000 },
      { sku: "PIP-075-WVN", name: "Pipa PVC 3 inch Wavin", qty: 25, price: 96000 }
    ],
    subtotal: 6100000, discount: 0, shipping: 300000, total: 6400000, paid: 3400000,
    paymentStatus: "DP", deliveryStatus: "Dijadwalkan", paymentMethod: "Transfer Manual", admin: "Rina"
  },
  {
    invoice: "INV-2026-1007", date: "2026-10-02", customer: "Siti Aminah", customerId: "CST-007",
    items: [{ sku: "KRM-050-PLC", name: "Keramik 50x50 Platinum Cream", qty: 5, price: 92000 }],
    subtotal: 460000, discount: 0, shipping: 190000, total: 650000, paid: 0,
    paymentStatus: "Belum Dibayar", deliveryStatus: "Dijadwalkan", paymentMethod: "Cash", admin: "Dewi"
  },
  {
    invoice: "INV-2026-1008", date: "2026-10-02", customer: "Mandor Agus", customerId: "CST-008",
    items: [
      { sku: "BAT-001-MRH", name: "Bata Merah Press", qty: 2000, price: 950 },
      { sku: "SMN-50-TGR", name: "Semen Portland 50kg", qty: 30, price: 69000 }
    ],
    subtotal: 3970000, discount: 120000, shipping: 330000, total: 4180000, paid: 2080000,
    paymentStatus: "DP", deliveryStatus: "Diproses", paymentMethod: "Cash", admin: "Rina"
  },
  {
    invoice: "INV-2026-1009", date: "2026-10-01", customer: "CV Karya Mandiri", customerId: "CST-002",
    items: [{ sku: "HBL-010-BLC", name: "Hebel 10cm Blesscon", qty: 180, price: 11800 }],
    subtotal: 2124000, discount: 44000, shipping: 70000, total: 2150000, paid: 2150000,
    paymentStatus: "Lunas", deliveryStatus: "Selesai", paymentMethod: "Transfer Manual", admin: "Dewi"
  },
  {
    invoice: "INV-2026-1010", date: "2026-10-01", customer: "Budi Hartono", customerId: "CST-001",
    items: [
      { sku: "TRN-550-PGN", name: "Toren 550L Penguin Biru", qty: 1, price: 1090000 },
      { sku: "AKS-002-KRM", name: "Kran Air 1/2 inch", qty: 10, price: 64000 }
    ],
    subtotal: 1730000, discount: 40000, shipping: 150000, total: 1840000, paid: 1840000,
    paymentStatus: "Lunas", deliveryStatus: "Selesai", paymentMethod: "Cash", admin: "Rina"
  }
];

// ---------------------------------------------------------------------------
// Riwayat pembayaran (DP + pelunasan)
// ---------------------------------------------------------------------------
export const payments: Payment[] = [
  { id: "PAY-0001", invoice: "INV-2026-1001", date: "2026-10-05 08:40", amount: 3000000, method: "Cash", admin: "Dewi", note: "DP awal" },
  { id: "PAY-0002", invoice: "INV-2026-1003", date: "2026-10-04 11:15", amount: 3380000, method: "Transfer Manual", admin: "Dewi", proofName: "bukti-nadia-1003.jpg", note: "Pelunasan penuh" },
  { id: "PAY-0003", invoice: "INV-2026-1004", date: "2026-10-04 09:20", amount: 2200000, method: "Cash", admin: "Dewi", note: "DP 1" },
  { id: "PAY-0004", invoice: "INV-2026-1005", date: "2026-10-03 15:05", amount: 875000, method: "Cash", admin: "Dewi", note: "Lunas di toko" },
  { id: "PAY-0005", invoice: "INV-2026-1006", date: "2026-10-03 10:10", amount: 3400000, method: "Transfer Manual", admin: "Dewi", proofName: "transfer-graha-1006.pdf", note: "DP proyek" },
  { id: "PAY-0006", invoice: "INV-2026-1008", date: "2026-10-02 13:45", amount: 2080000, method: "Cash", admin: "Dewi", note: "DP mandor" },
  { id: "PAY-0007", invoice: "INV-2026-1009", date: "2026-10-01 09:35", amount: 2150000, method: "Transfer Manual", admin: "Dewi", proofName: "bukti-karya-1009.jpg" },
  { id: "PAY-0008", invoice: "INV-2026-1010", date: "2026-10-01 16:20", amount: 1840000, method: "Cash", admin: "Dewi" }
];

// ---------------------------------------------------------------------------
// Pergerakan stok
// ---------------------------------------------------------------------------
export const stockMovements: StockMovement[] = [
  { id: "MV-0001", date: "2026-10-05 08:20", sku: "SMN-50-TGR", item: "Semen 50kg Tiga Roda", type: "stock_in", qty: 80, note: "Masuk dari supplier reguler", admin: "Arman" },
  { id: "MV-0002", date: "2026-10-05 09:10", sku: "KRM-100-ASW", item: "Keramik 100x100 Asia Tile Putih", type: "stock_out", qty: -30, note: "Keluar untuk INV-2026-1001", admin: "Arman" },
  { id: "MV-0003", date: "2026-10-05 10:35", sku: "TRN-550-PGN", item: "Toren 550L Penguin Biru", type: "adjustment", qty: -1, note: "Koreksi unit retak", admin: "Arman" },
  { id: "MV-0004", date: "2026-10-04 11:00", sku: "PIP-075-WVN", item: "Pipa PVC 3 inch Wavin AW", type: "stock_out", qty: -25, note: "Keluar untuk proyek Narogong", admin: "Tono" },
  { id: "MV-0005", date: "2026-10-04 14:20", sku: "BSI-012-KRA", item: "Besi Beton 12mm Krakatau", type: "stock_in", qty: 40, note: "Restock besi", admin: "Arman" },
  { id: "MV-0006", date: "2026-10-03 08:45", sku: "CAT-25-DLX", item: "Cat Interior 2.5L Dulux Putih", type: "return", qty: 2, note: "Return barang belum dibuka", admin: "Tono" },
  { id: "MV-0007", date: "2026-10-03 15:30", sku: "KYN-004-AVN", item: "Kuas Cat 4 inch Avian", type: "stock_out", qty: -8, note: "Penjualan retail", admin: "Arman" },
  { id: "MV-0008", date: "2026-10-02 16:00", sku: "GTG-PLC-MRN", item: "Genteng Beton Flat Maroon", type: "stock_out", qty: -250, note: "Keluar bertahap proyek", admin: "Tono" },
  { id: "MV-0009", date: "2026-10-02 17:15", sku: "SMN-40-GRS", item: "Semen Mortar 40kg", type: "adjustment", qty: -3, note: "Sak sobek", admin: "Arman" },
  { id: "MV-0010", date: "2026-10-01 09:00", sku: "BAT-001-MRH", item: "Bata Merah Press", type: "stock_in", qty: 1800, note: "Masuk batch pagi", admin: "Tono" },
  { id: "MV-0011", date: "2026-10-01 10:20", sku: "KRM-080-GRN", item: "Keramik Granit 80x80", type: "stock_out", qty: -10, note: "Sample showroom", admin: "Tono" },
  { id: "MV-0012", date: "2026-09-30 16:40", sku: "GTG-KRM-RED", item: "Genteng Keramik Kanmuri", type: "stock_out", qty: -120, note: "Pengiriman proyek", admin: "Arman" }
];

// ---------------------------------------------------------------------------
// Pengiriman
// ---------------------------------------------------------------------------
export const deliveries: Delivery[] = [
  { id: "DLV-001", date: "2026-10-05", time: "09:00", invoice: "INV-2026-1001", customer: "CV Karya Mandiri", address: "Ruko Sentra Niaga Blok C7, Cikarang", items: "Keramik 100x100 (30), Semen 50kg (20)", status: "Dijadwalkan", driver: "Jajang", vehicle: "L300 - B 9012 XYZ" },
  { id: "DLV-002", date: "2026-10-05", time: "10:30", invoice: "INV-2026-1002", customer: "Budi Hartono", address: "Jl. Sawo Raya No. 18, Bekasi", items: "Pipa PVC (10), Cat Dulux (4)", status: "Diproses", driver: "Ucup", vehicle: "Pickup - B 7788 KLM" },
  { id: "DLV-003", date: "2026-10-05", time: "13:00", invoice: "INV-2026-1004", customer: "Kontraktor Sinar Jaya", address: "Jl. Raya Narogong KM 12, Bogor", items: "Besi 12mm (60), Semen Mortar (40)", status: "Dikirim", driver: "Jajang", vehicle: "Truk - B 9210 TRK" },
  { id: "DLV-004", date: "2026-10-06", time: "08:00", invoice: "INV-2026-1006", customer: "PT Graha Renovasi", address: "Jl. Pangeran Antasari No. 44, Jakarta", items: "Toren 1000L (2), Pipa PVC (25)", status: "Dijadwalkan", driver: "Rudi", vehicle: "Truk - B 9210 TRK" },
  { id: "DLV-005", date: "2026-10-06", time: "14:00", invoice: "INV-2026-1007", customer: "Siti Aminah", address: "Jl. Kutilang No. 7, Bekasi", items: "Keramik 50x50 (5)", status: "Dijadwalkan", driver: "Ucup", vehicle: "Pickup - B 7788 KLM" },
  { id: "DLV-006", date: "2026-10-07", time: "09:30", invoice: "INV-2026-1008", customer: "Mandor Agus", address: "Proyek Cluster Magnolia, Serpong", items: "Bata merah (2000), Semen (30)", status: "Diproses", driver: "Rudi", vehicle: "Truk - B 9210 TRK" },
  { id: "DLV-007", date: "2026-10-04", time: "11:00", invoice: "INV-2026-1003", customer: "Nadia Pratama", address: "Perumahan Griya Citra Blok D2, Depok", items: "Cat Nippon (2)", status: "Selesai", driver: "Jajang", vehicle: "L300 - B 9012 XYZ" },
  { id: "DLV-008", date: "2026-10-03", time: "15:30", invoice: "INV-2026-1005", customer: "Hendra Wijaya", address: "Jl. Melati 4 No. 9, Tangerang", items: "Kuas (3), Cat Avian (3)", status: "Selesai", driver: "Ucup", vehicle: "Pickup - B 7788 KLM" }
];

// ---------------------------------------------------------------------------
// Admin & role
// ---------------------------------------------------------------------------
export const admins: AdminUser[] = [
  { id: "USR-001", name: "Sari Wulandari", email: "sari@tokobangunan.local", role: "Super Admin", status: "Aktif", lastLogin: "2026-10-05 08:02" },
  { id: "USR-002", name: "Arman Saputra", email: "arman@tokobangunan.local", role: "Admin Stock", status: "Aktif", lastLogin: "2026-10-05 10:41" },
  { id: "USR-003", name: "Dewi Anggraeni", email: "dewi@tokobangunan.local", role: "Admin Pembayaran", status: "Aktif", lastLogin: "2026-10-05 09:54" },
  { id: "USR-004", name: "Tono Prasetyo", email: "tono@tokobangunan.local", role: "Admin Stock", status: "Aktif", lastLogin: "2026-10-04 17:10" },
  { id: "USR-005", name: "Rudi Firmansyah", email: "rudi@tokobangunan.local", role: "Admin Kirim", status: "Aktif", lastLogin: "2026-10-05 07:45" }
];

// ---------------------------------------------------------------------------
// Turunan / agregat
// ---------------------------------------------------------------------------
export const salesSeries = [
  { day: "Sen", date: "2026-09-29", value: 4200000, trx: 3 },
  { day: "Sel", date: "2026-09-30", value: 6100000, trx: 4 },
  { day: "Rab", date: "2026-10-01", value: 5100000, trx: 3 },
  { day: "Kam", date: "2026-10-02", value: 7800000, trx: 5 },
  { day: "Jum", date: "2026-10-03", value: 8900000, trx: 4 },
  { day: "Sab", date: "2026-10-04", value: 11300000, trx: 6 },
  { day: "Min", date: "2026-10-05", value: 3600000, trx: 2 }
];

export const categories = Array.from(new Set(products.map((item) => item.category))).sort();

export const permissionMatrix: {
  permission: string;
  "Super Admin": string;
  "Admin Stock": string;
  "Admin Pembayaran": string;
  "Admin Kirim": string;
}[] = [
  { permission: "Kelola produk", "Super Admin": "Ya", "Admin Stock": "Ya", "Admin Pembayaran": "Lihat", "Admin Kirim": "Lihat" },
  { permission: "Update stok", "Super Admin": "Ya", "Admin Stock": "Ya", "Admin Pembayaran": "Tidak", "Admin Kirim": "Tidak" },
  { permission: "Upload data", "Super Admin": "Ya", "Admin Stock": "Ya", "Admin Pembayaran": "Tidak", "Admin Kirim": "Tidak" },
  { permission: "Buat transaksi", "Super Admin": "Ya", "Admin Stock": "Tidak", "Admin Pembayaran": "Ya", "Admin Kirim": "Tidak" },
  { permission: "Konfirmasi pembayaran", "Super Admin": "Ya", "Admin Stock": "Tidak", "Admin Pembayaran": "Ya", "Admin Kirim": "Tidak" },
  { permission: "Cetak invoice", "Super Admin": "Ya", "Admin Stock": "Tidak", "Admin Pembayaran": "Ya", "Admin Kirim": "Ya" },
  { permission: "Update pengiriman", "Super Admin": "Ya", "Admin Stock": "Tidak", "Admin Pembayaran": "Tidak", "Admin Kirim": "Ya" },
  { permission: "Lihat laporan", "Super Admin": "Ya", "Admin Stock": "Stok", "Admin Pembayaran": "Keuangan", "Admin Kirim": "Tidak" }
];
