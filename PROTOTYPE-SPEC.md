# Spesifikasi Prototype Frontend

## Prinsip

Admin panel ini harus terasa seperti software kerja toko bangunan, bukan template SaaS generik. Prioritas utama adalah tabel, filter, form cepat, status yang jelas, dan navigasi efisien.

## Entitas Data Awal

- Produk/katalog
- Kategori
- Customer
- Transaksi
- Pembayaran
- Stock movement
- Jadwal pengiriman
- Invoice
- Admin user
- Role/permission

## Alur Utama

1. Admin mencari produk di katalog.
2. Admin stock melakukan stock in, stock out, adjustment, atau upload file.
3. Admin pembayaran membuat transaksi cash lunas atau cash DP.
4. Sistem menampilkan invoice.
5. Admin kirim melihat jadwal dan mencetak surat jalan.
6. Super admin memantau laporan dan statistik.

## Field Produk

- SKU
- Nama barang
- Kategori
- Tipe/varian
- Merk
- Ukuran
- Satuan
- Stok
- Stok minimum
- Harga jual
- Status
- Lokasi gudang/rak

## Status Pembayaran

- Belum Dibayar
- DP
- Lunas

## Status Pengiriman

- Dijadwalkan
- Diproses
- Dikirim
- Selesai
- Gagal

## Integrasi Backend Nanti

Struktur dummy data di `data/mock.ts` bisa dijadikan referensi awal untuk API response. Setelah backend tersedia, data lokal dapat diganti dengan fetcher/service layer tanpa mengubah konsep layar.
