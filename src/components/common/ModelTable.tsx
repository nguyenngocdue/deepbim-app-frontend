"use client";

import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  ColumnDef,
} from "@tanstack/react-table";


import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Heading } from "@/components/common/Heading";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { FormAlertDialogTemplate } from "@/components/common/FormAlertDialogTemplate";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { MdKeyboardDoubleArrowLeft, MdKeyboardDoubleArrowRight } from "react-icons/md";

import { apiRequest } from "@/api";
import { TableContent } from "../model-table/TableContent";
import { getModelTableColumns } from "@/components/common/ModelTableColumns";
import { ColumnConfig } from "@/features/bim-viewer/modals/managements/ColumnsConfig";

export type Model = {
  id: string;
  name: string;
  status: string;
  size: number;
  uploader: {
    email: string;
    avatar: string;
  };
  modified: string;
  viewId: string;
};

type ModelTableProps = {
  data: Model[];
  refeshData: () => void;
  hasAction: boolean;
  actionTypes: string[];
  columnsConfig: ColumnConfig[];
};

export function ModelTable({ data, refeshData, hasAction, actionTypes, columnsConfig }: ModelTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openModifiedDialog, setOpenModifiedDialog] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<Model | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isInitialLoad, setIsInitialLoad] = React.useState(true);

  // Khởi tạo columns trước với table = undefined (vì chưa tạo)
  const [columns, setColumns] = React.useState<ColumnDef<Model>[]>([]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: { pageSize },
    },
  });

  // Tạo columns sau khi table đã khởi tạo
  React.useEffect(() => {
    const columns = getModelTableColumns({
        hasAction,
        setSelectedRow,
        setOpenDeleteDialog,
        setOpenModifiedDialog,
        table,
        actionTypes,
        configs: columnsConfig, // lấy từ props
      });
    setColumns(columns);
  }, [hasAction, actionTypes, setSelectedRow, setOpenDeleteDialog, setOpenModifiedDialog]);

  console.log(columns);
  // Loading giả lập
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false);
      setIsInitialLoad(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [data]);

  React.useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  const fields = [
    { name: "filename", label: "Filename", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "status", label: "Status", type: "text" },
  ];

  const initialValues = (row: Model) => ({
    filename: row.name,
    description: "",
    isPublic: row.status === "Public",
    status: row.status,
  });

  const memoInitialValues = React.useMemo(() => {
    if (openModifiedDialog && selectedRow) {
      return initialValues(selectedRow);
    }
    return {};
  }, [openModifiedDialog, selectedRow]);

  if (isInitialLoad && isLoading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="rounded-md border border-zinc-400 overflow-hidden p-4 space-y-4">
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
    );
  }

  return (
    <div className="space-y-4">
      <Heading level={6} className="px-4 pt-2 text-150 italic" position="right">
        (Total item: {data.length})
      </Heading>
       <TableContent table={table} />
      <ConfirmDeleteDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={async () => {
          if (!selectedRow) return;
          await apiRequest(`/media/${selectedRow.id}`, "DELETE");
          setOpenDeleteDialog(false);
          refeshData();
        }}
        itemName={selectedRow?.name}
      />

      <FormAlertDialogTemplate
        open={openModifiedDialog}
        onClose={() => setOpenModifiedDialog(false)}
        title="Update Media"
        fields={fields}
        initialValues={memoInitialValues}
        onSubmit={async (values) => {
          if (!selectedRow) return;
          await apiRequest(`/media/${selectedRow.id}`, "PATCH", values);
          refeshData();
        }}
      />

      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2 text-50">
          <span>Rows per page:</span>
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-50">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            <MdKeyboardDoubleArrowLeft />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <IoIosArrowBack />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <IoIosArrowForward />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <MdKeyboardDoubleArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
