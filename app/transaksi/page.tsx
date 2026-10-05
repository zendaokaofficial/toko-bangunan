import { Suspense } from "react";
import { TransaksiPage } from "@/components/pages/transaksi";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Memuat transaksi…</div>}>
      <TransaksiPage />
    </Suspense>
  );
}
