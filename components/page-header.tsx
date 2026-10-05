import * as React from "react";
import { Breadcrumb } from "@/components/layout/breadcrumb";

/**
 * Header halaman: breadcrumb, judul, deskripsi, dan area aksi (kanan).
 */
export function PageHeader({
  title,
  description,
  actions
}: {
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border pb-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <Breadcrumb title={title} />
        <h1 className="mt-1.5 text-lg font-semibold text-slate-900">{title}</h1>
        <p className="mt-0.5 max-w-2xl text-xs leading-5 text-slate-500">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
}
