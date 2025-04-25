"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Pencil, Trash2, ExternalLink, ArrowUpDown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Upload from "@/components/Upload"

type Model = {
  name: string
  status: string
  uploader: {
    email: string
    avatar: string
  }
  modified: string
}

const defaultData: Model[] = [
  {
    name: "small",
    status: "Private",
    uploader: {
      email: "duengocnguyen@gmail.com",
      avatar: "https://i.pravatar.cc/40?img=1",
    },
    modified: "09/04/2025",
  },
  {
    name: "CenterConference",
    status: "Private",
    uploader: {
      email: "duengocnguyen@gmail.com",
      avatar: "https://i.pravatar.cc/40?img=1",
    },
    modified: "24/01/2025",
  },
  {
    name: "Archicad",
    status: "Private",
    uploader: {
      email: "duengocnguyen@gmail.com",
      avatar: "https://i.pravatar.cc/40?img=1",
    },
    modified: "24/01/2025",
  },
  {
    name: "Archicad",
    status: "Private",
    uploader: {
      email: "duengocnguyen@gmail.com",
      avatar: "https://i.pravatar.cc/40?img=1",
    },
    modified: "24/01/2025",
  },
]

export default function ModelTable() {
  const [data] = React.useState<Model[]>(defaultData)
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pageSize, setPageSize] = React.useState<number>(10)

  const columns: ColumnDef<Model>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <span>▶ {row.getValue("name")}</span>,
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className="text-orange-500 font-medium">🔒 {row.getValue("status")}</span>
      ),
    },
    {
      accessorKey: "uploader",
      header: "Upload By",
      cell: ({ row }) => {
        const uploader = row.getValue("uploader") as Model["uploader"]
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={uploader.avatar} alt="avatar" />
              <AvatarFallback>DG</AvatarFallback>
            </Avatar>
            {uploader.email}
          </div>
        )
      },
    },
    {
      accessorKey: "modified",
      header: "Modified",
      cell: ({ row }) => row.getValue("modified"),
    },
    {
      id: "actions",
      header: "Action",
      cell: () => (
        <div className="flex justify-center gap-2">
          <Pencil className="w-4 h-4 cursor-pointer hover:text-primary" />
          <ExternalLink className="w-4 h-4 cursor-pointer hover:text-yellow-600" />
          <Trash2 className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-700" />
        </div>
      ),
    },
  ]

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
  })

  React.useEffect(() => {
    table.setPageSize(pageSize)
  }, [pageSize, table])

  return (
    <div className="space-y-4">
      {/* Table */}
      <div className="rounded-md border overflow-auto">
        <Table className="bg-slate-900 text-white border-collapse w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-slate-700">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-white">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className="border-b border-slate-800">
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-white">
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

      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}</div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>{"<<"}</Button>
          <Button variant="ghost" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>{"<"}</Button>
          <Button variant="ghost" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>{">"}</Button>
          <Button variant="ghost" size="icon" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>{">>"}</Button>
        </div>
      </div>
    </div>
  )
}