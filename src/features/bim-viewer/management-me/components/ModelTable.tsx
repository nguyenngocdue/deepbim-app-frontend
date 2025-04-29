"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
} from "@tanstack/react-table";

import { TableContent } from "@/components/model-table/TableContent";
import { TableFooter } from "@/components/model-table/TableFooter";
import { TableToolbar } from "@/components/model-table/TableToolbar";
import { DeleteDialog } from "@/components/model-table/DeleteDialog";
import { ModifyDialog } from "@/components/model-table/ModifyDialog";
import { ModelTableProps, Model } from "@/components/model-table/types";
import { getColumns } from "@/components/model-table/Columns";
import { Skeleton } from "@/components/ui/skeleton";

export function ModelTable({ data, refeshData }: ModelTableProps) {
  const [sorting, setSorting] = React.useState([]);
  const [pageSize, setPageSize] = React.useState(10);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openModifiedDialog, setOpenModifiedDialog] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<Model | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const columns = React.useMemo(
    () => getColumns(setSelectedRow, setOpenModifiedDialog, setOpenDeleteDialog),
    [setSelectedRow, setOpenModifiedDialog, setOpenDeleteDialog]
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  React.useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      if (data.length > 0) {
        setIsLoading(false);
      }
    }, 0); // ⏳ Giả lập nhẹ chỉ 1s
    return () => clearTimeout(timeout);
  }, [data]);

  if (isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        {/* Table Skeleton */}
        <div className="rounded-md border border-zinc-400 overflow-hidden">
          <div className="p-4 space-y-4">
            {Array.from({ length: pageSize }).map((_, index) => (
              <div key={index} className="grid grid-cols-6 gap-4 items-center">
                <Skeleton className="h-4 col-span-1 rounded bg-slate-300" />
                <Skeleton className="h-4 col-span-2 rounded bg-slate-300" />
                <Skeleton className="h-4 col-span-1 rounded bg-slate-300" />
                <Skeleton className="h-4 col-span-2 rounded bg-slate-300" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TableToolbar total={data.length} />
      <TableContent table={table} columns={columns} />
      <DeleteDialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} selectedRow={selectedRow} refeshData={refeshData} />
      <ModifyDialog open={openModifiedDialog} onClose={() => setOpenModifiedDialog(false)} selectedRow={selectedRow} refeshData={refeshData} />
      <TableFooter table={table} pageSize={pageSize} setPageSize={setPageSize} />
    </div>
  );
}
