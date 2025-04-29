"use client";

import * as React from "react";
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel } from "@tanstack/react-table";
import { TableContent } from "@/components/model-table/TableContent";
import { TableFooter } from "@/components/model-table/TableFooter";
import { TableToolbar } from "@/components/model-table/TableToolbar";
import { DeleteDialog } from "@/components/model-table/DeleteDialog";
import { ModifyDialog } from "@/components/model-table/ModifyDialog";
import { ModelTableProps, Model } from "@/components/model-table/types";
import { getColumns } from "@/components/model-table/Columns";

export function ModelTable({ data, refeshData }: ModelTableProps) {
  const [sorting, setSorting] = React.useState([]);
  const [pageSize, setPageSize] = React.useState(10);
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openModifiedDialog, setOpenModifiedDialog] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<Model | null>(null);

  const table = useReactTable({
    data,
    columns: getColumns(setSelectedRow, setOpenModifiedDialog, setOpenDeleteDialog),
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

  return (
    <div className="space-y-4">
      <TableToolbar total={data.length} />
      <TableContent table={table} columns={getColumns(setSelectedRow, setOpenModifiedDialog, setOpenDeleteDialog, table)} />
      <DeleteDialog open={openDeleteDialog} onClose={() => setOpenDeleteDialog(false)} selectedRow={selectedRow} refeshData={refeshData} />
      <ModifyDialog open={openModifiedDialog} onClose={() => setOpenModifiedDialog(false)} selectedRow={selectedRow} refeshData={refeshData} />
      <TableFooter table={table} pageSize={pageSize} setPageSize={setPageSize} />
    </div>
  );
}
