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
import { Pencil, Trash2, ExternalLink, ArrowUpDown, Link2 } from "lucide-react";
import { AvatarUser } from "@/components/AvatarUser";
import { LogoWord } from "@/components/LogoWord";
import { ConfirmDeleteDialog } from "@/components/ConfirmDeleteDialog";
import { apiRequest } from "@/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormDialogTemplate } from "@/components/common/FormDialogTemplate";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { Heading } from "@/components/common/Heading";
import LinkMark from "@/components/auth/LinkMark";
import { Link } from "@tanstack/react-router";
import { IoEyeSharp } from "react-icons/io5";

// Kiểu Model
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
  viewId: string; // Add viewId property
};

// Props của ModelTable
type ModelTableProps = {
  data: Model[];
  refeshData: () => void;
};



export function ModelTable({ data, refeshData }: ModelTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pageSize, setPageSize] = React.useState<number>(10);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false);
  const [openModifiedDialog, setOpenModifiedDialog] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<Model | null>(null);

  const fields = [
    { name: "filename", label: "Filename", type: "text" },
    { name: "description", label: "Description", type: "textarea" },
    { name: "status", label: "Status", type: "text" },
  ];

  const initialValues = (row: Model) => {
    return {
      filename: row.name,        // map name -> filename input
      description: "",           // Media model của bạn hiện chưa có description, để rỗng hoặc nếu sau này có thì fill vào
      isPublic: row.status === "Public",
      status: row.status,
    };
  };

  const memoInitialValues = React.useMemo(() => {
    if (openModifiedDialog && selectedRow) {
      return initialValues(selectedRow);
    }
    return {};
  }, [openModifiedDialog, selectedRow]);



  const columns: ColumnDef<Model>[] = [
    {
      id: "no",
      header: "#",
      cell: ({ row }) => {
        const indexOnPage = row.index; // index của row trong page hiện tại
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        const absoluteIndex = pageIndex * pageSize + indexOnPage + 1; // ✅ Tính đúng số thứ tự
        return (
          <div className="text-left font-medium">
            <Heading level={6} className="text-zinc-400" >{absoluteIndex}</Heading>
          </div>
        );
      },
      size: 50,
    },
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
          <span className="text-50 font-medium">{row.getValue("name")}</span>
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div className="flex items-center text-50">
          <span className="text-50 font-medium">
            {row.getValue("status")}
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
          <div className="flex items-center text-50 font-medium">
            <AvatarUser img={uploader.avatar} name={uploader.email} size="md" />
          </div>
        );
      },
    },
    {
      accessorKey: "modified",
      header: "Modified",
      cell: ({ row }) => {
        return <>
          <span className="flex items-center text-50 font-medium">{row.getValue("modified")}</span>
        </>
      }
    },
    {
      accessorKey: "size",
      header: "Size (MB)",
      cell: ({ row }) => {
        const size = row.getValue("size") as number;
        return (
          <div className="flex items-center text-50 font-medium">
            {size.toFixed(2)} MB
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-start gap-2">
          {
            (import.meta.env.VITE_ENV !== 'production') &&
            (
              <>
                <Pencil
                  className="w-4 h-4 cursor-pointer hover:text-yellow-600 text-50"
                  onClick={
                    () => {
                      setSelectedRow(row.original);
                      setOpenModifiedDialog(true);
                    }
                  }
                />
                <Trash2
                  className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-700"
                  onClick={() => {
                    setSelectedRow(row.original);
                    setOpenDeleteDialog(true);
                  }}
                />
              </>
            )}
          <a href={`/view?v=${row.original.viewId}`} target="_blank" rel="noopener noreferrer">
            <IoEyeSharp className="w-4 h-4 cursor-pointer hover:text-blue-600 text-50" />
          </a>
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
      <Heading level={6} className='px-4 pt-2 text-150 italic' position="right">(Total item: {data.length})</Heading>
      <div className="rounded-md border border-zinc-400 overflow-auto ">
        <Table className="border-collapse w-full ">
          <TableHeader className="table-header shadow-md ">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-muted"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-left">
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
                <TableRow
                  key={row.id}
                  className="border-b border-muted "
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="text-zinc-300" title={`ID: ${row.original.id}`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-sm text-center py-8 text-150 italic">
                  No data available. Please upload or <LinkMark to={'/sign-in'}>sig-in</LinkMark> again if you are a guest.
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
          refeshData(); // ✅ sau khi xoá thì gọi refresh
        }}
        itemName={selectedRow?.name}
      />


      <FormDialogTemplate
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



      {/* Footer */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2 text-50">
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
          <Button variant="ghost" size="icon" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
            <MdKeyboardDoubleArrowRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
