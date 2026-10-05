# Prototype Admin Toko Bangunan

Prototype frontend ini dibuat untuk admin operasional toko bangunan. Fokusnya adalah alur kerja internal: katalog barang, persediaan, transaksi, pembayaran DP/tunai, pengiriman, invoice, customer, laporan, dan role admin.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Komponen bergaya shadcn/ui
- lucide-react untuk icon
- Dummy data lokal di `data/mock.ts`

## Cara Menjalankan

```bash
npm install
npm run dev
```

Buka:

```text
http://localhost:3000
```

## Modul Prototype

- Dashboard statistik
- Katalog barang dengan search, filter kategori, sort, status, dan action
- Stok dengan stock in, stock out, adjustment, dan riwayat movement
- Upload data katalog/stok dengan preview validasi
- Transaksi penjualan cash lunas, cash DP, transfer manual, QRIS/VA soon
- Pembayaran dengan tab belum dibayar, DP, lunas, semua
- Pengiriman dengan kalender sederhana dan surat jalan
- Invoice dengan preview cetak/download dummy
- Customer
- Laporan
- Admin & Role

## Role

- Super Admin
- Admin Stock
- Admin Pembayaran
- Admin Kirim

Role switcher ada di topbar agar prototype bisa dilihat dari sudut pandang tiap admin.

## Catatan Desain

Prototype ini sengaja tidak memakai landing page, hero section, gradient besar, kartu dekoratif berlebihan, atau copywriting promosi. UI diarahkan sebagai aplikasi operasional harian yang padat, jelas, dan cepat dipakai staf toko/gudang.

## Rencana Lanjutan

- Pecah halaman menjadi route per modul
- Tambahkan komponen shadcn/ui resmi lewat CLI saat dependency siap
- Sambungkan data ke API backend
- Tambahkan autentikasi dan permission guard
- Tambahkan export PDF/Excel sungguhan
- Tambahkan integrasi QRIS dan Virtual Account
