import { ColumnDef } from "@tanstack/react-table";
import { Model } from "./types";
import { Pencil, Trash2 } from "lucide-react";
import { IoEyeSharp } from "react-icons/io5";
import { LogoWord } from "@/components/LogoWord";
import { AvatarUser } from "@/components/AvatarUser";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { Heading } from "@/components/common/Heading";

export const getColumns = (
  setSelectedRow: (row: Model) => void,
  setOpenModifiedDialog: (state: boolean) => void,
  setOpenDeleteDialog: (state: boolean) => void,
  hasAction?:boolean,
) => {
  const columns: ColumnDef<Model>[] = [
    {
      id: "no",
      header: "#",
      cell: ({ row }) => {
        const pageIndex = row?.table?.getState().pagination.pageIndex ?? 0;
        const pageSize = row?.table?.getState().pagination.pageSize ?? 10;
        const absoluteIndex = pageIndex * pageSize + row.index + 1;
        return (
          <Heading level={6} className="text-zinc-400">{absoluteIndex}</Heading>
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
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <LogoWord isHiddenText path="/images/logo_no_bg.png" size="sm" />
          <span className="font-medium">{row.getValue("name")}</span>
        </div>
      ),
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("status")}</span>
      ),
    },
    {
      accessorKey: "uploader",
      header: "Uploaded By",
      cell: ({ row }) => {
        const uploader = row.getValue("uploader") as Model["uploader"];
        return (
          <AvatarUser img={uploader.avatar} name={uploader.email} size="md" />
        );
      },
    },
    {
      accessorKey: "modified",
      header: "Modified",
      cell: ({ row }) => (
        <span className="font-medium">{row.getValue("modified")}</span>
      ),
    },
    {
      accessorKey: "size",
      header: "Size (MB)",
      cell: ({ row }) => {
        const size = row.getValue("size") as number;
        return (
          <span className="font-medium">{size.toFixed(2)} MB</span>
        );
      },
    },
  ];
  if(hasAction) {
    columns.push(
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex gap-2">
            <Pencil
              className="w-4 h-4 cursor-pointer hover:text-yellow-600"
              onClick={() => {
                setSelectedRow(row.original);
                setOpenModifiedDialog(true);
              }}
            />
            <Trash2
              className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-700"
              onClick={() => {
                setSelectedRow(row.original);
                setOpenDeleteDialog(true);
              }}
            />
            <a
              href={`/view?v=${row.original.viewId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IoEyeSharp className="w-4 h-4 cursor-pointer hover:text-blue-600" />
            </a>
          </div>
        ),
      },
    )
  }
  return columns;
} 
