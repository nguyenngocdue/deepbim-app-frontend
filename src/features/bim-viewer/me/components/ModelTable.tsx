import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, ExternalLink, ArrowUpDown } from "lucide-react";
import { AvatarUser } from "@/components/AvatarUser";
import { LogoWord } from "@/components/LogoWord";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { apiRequest } from "@/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Kiểu Model
export type Model = {
  id: string;
  name: string;
  status: string;
  uploader: {
    email: string;
    avatar: string;
  };
  modified: string;
};

// Props của ModelTable
type ModelTableProps = {
  data: Model[];
  onDeleteSuccess: () => void; // ✅ thêm callback để sau khi xoá sẽ fetch lại
};

export function ModelTable({ data, onDeleteSuccess }: ModelTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<Model | null>(null);

  const columns: ColumnDef<Model>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() =>
            column.toggleSorting(column.getIsSorted() === "asc")
          }
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex flex-nowrap items-center gap-2">
          <LogoWord isHiddenText={true} path="/images/logo_no_bg.png" size="sm" />
          <span>{row.getValue("name")}</span>
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center">
          <span className="text-orange-500 font-medium">
            🔒 {row.getValue("status")}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "uploader",
      header: "Uploaded By",
      cell: ({ row }) => {
        const uploader = row.getValue("uploader") as Model["uploader"];
        return (
          <div className="flex items-center">
            <AvatarUser img={uploader.avatar} name={uploader.email} size="md" />
          </div>
        );
      },
    },
    {
      accessorKey: "modified",
      header: "Modified",
      cell: ({ row }) => row.getValue("modified"),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <Pencil className="w-4 h-4 cursor-pointer hover:text-primary" />
          <ExternalLink className="w-4 h-4 cursor-pointer hover:text-yellow-600" />
          <Trash2
            className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-700"
            onClick={() => {
              setSelectedRow(row.original);
              setOpenDeleteDialog(true);
            }}
          />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
  });

  React.useEffect(() => {
    table.setPageSize(pageSize);
  }, [pageSize, table]);

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-zinc-500 overflow-auto">
        <Table className="border-collapse w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-zinc-300" title={`ID: ${row.original.id}`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <ConfirmDeleteDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={async () => {
          if (!selectedRow) return;
          await apiRequest(`/media/${selectedRow.id}`, "DELETE");
          setOpenDeleteDialog(false);
          onDeleteSuccess(); // ✅ sau khi xoá thì gọi refresh
        }}
        itemName={selectedRow?.name}
      />

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => setPageSize(Number(value))}
          >
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
        <div>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            {"<<"}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            {"<"}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            {">"}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
            {">>"}
          </Button>
        </div>
      </div>
    </div>
  );
}
