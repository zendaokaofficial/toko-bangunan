import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AppShell } from "@/components/layout/app-shell";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

export const metadata: Metadata = {
  title: "Admin Toko Bangunan",
  description: "Prototype admin operasional toko bangunan: katalog, stok, transaksi, pembayaran, pengiriman, invoice, dan laporan"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={geist.variable}>
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
