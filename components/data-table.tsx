"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState } from "@/components/ui/empty-state";

export type Column<T> = {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  /** Bila diisi, kolom dapat diurutkan memakai nilai ini. */
  sortValue?: (row: T) => string | number;
  align?: "left" | "right" | "center";
  width?: string;
  className?: string;
};

export type DataTableProps<T> = {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  /** Baris yang sedang aktif (mis. sedang dibuka di panel detail). */
  activeRowId?: string;
  dense?: boolean;
};

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  emptyTitle,
  emptyDescription,
  onRowClick,
  activeRowId,
  dense
}: DataTableProps<T>) {
  const [sort, setSort] = React.useState<{ key: string; dir: "asc" | "desc" } | null>(null);

  const sorted = React.useMemo(() => {
    if (!sort) return rows;
    const column = columns.find((item) => item.key === sort.key);
    if (!column?.sortValue) return rows;
    return [...rows].sort((a, b) => {
      const av = column.sortValue!(a);
      const bv = column.sortValue!(b);
      const result = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv), "id");
      return sort.dir === "asc" ? result : -result;
    });
  }, [rows, sort, columns]);

  const toggleSort = (column: Column<T>) => {
    if (!column.sortValue) return;
    setSort((prev) => {
      if (!prev || prev.key !== column.key) return { key: column.key, dir: "asc" };
      if (prev.dir === "asc") return { key: column.key, dir: "desc" };
      return null;
    });
  };

  return (
    <div className="overflow-hidden rounded-md border border-border bg-card shadow-admin">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => {
              const sortable = Boolean(column.sortValue);
              const isActive = sort?.key === column.key;
              return (
                <TableHead
                  key={column.key}
                  style={column.width ? { width: column.width } : undefined}
                  className={cn(
                    column.align === "right" && "text-right",
                    column.align === "center" && "text-center",
                    sortable && "cursor-pointer select-none hover:text-slate-700",
                    column.className
                  )}
                  onClick={() => toggleSort(column)}
                >
                  <span className={cn("inline-flex items-center gap-1", column.align === "right" && "flex-row-reverse")}>
                    {column.header}
                    {sortable ? (
                      isActive ? (
                        sort?.dir === "asc" ? (
                          <ArrowUp className="h-3 w-3 text-sky-600" />
                        ) : (
                          <ArrowDown className="h-3 w-3 text-sky-600" />
                        )
                      ) : (
                        <ChevronsUpDown className="h-3 w-3 text-slate-300" />
                      )
                    ) : null}
                  </span>
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.length === 0 ? (
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={columns.length} className="p-0">
                <EmptyState
                  title={emptyTitle ?? "Tidak ada data"}
                  description={emptyDescription ?? "Coba ubah kata kunci atau filter yang dipakai."}
                />
              </TableCell>
            </TableRow>
          ) : (
            sorted.map((row) => {
              const id = getRowId(row);
              return (
                <TableRow
                  key={id}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    onRowClick && "cursor-pointer",
                    activeRowId === id && "bg-sky-50/70 hover:bg-sky-50"
                  )}
                >
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn(
                        dense && "py-1.5",
                        column.align === "right" && "text-right",
                        column.align === "center" && "text-center",
                        column.className
                      )}
                    >
                      {column.render(row)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
