import { Suspense } from "react";
import { KatalogPage } from "@/components/pages/katalog";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-xs text-slate-400">Memuat katalog…</div>}>
      <KatalogPage />
    </Suspense>
  );
}
