// src/components/model-table/modelTableColumns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import { IoEyeSharp } from "react-icons/io5";
import { Heading } from "@/components/common/Heading";
import { LogoWord } from "@/components/LogoWord";
import { AvatarUser } from "@/components/AvatarUser";
import { Button } from "@/components/ui/button";
import { Model } from "@/components/model-table/types";

type ColumnOptions = {
  hasAction: boolean;
  setSelectedRow: (row: Model) => void;
  setOpenDeleteDialog: (open: boolean) => void;
  setOpenModifiedDialog: (open: boolean) => void;
  table: any; // Kiểu cụ thể: Table<Model> nếu có
  actionTypes?: string[]; // Optional property to specify action types
};

export const getModelTableColumns = ({
  hasAction,
  setSelectedRow,
  setOpenDeleteDialog,
  setOpenModifiedDialog,
  table,
  actionTypes,
}: ColumnOptions): ColumnDef<Model>[] => {
  const columns: ColumnDef<Model>[] = [
    {
      id: "no",
      header: "#",
      cell: ({ row }) => {
        const indexOnPage = row.index;
        const pageIndex = table.getState().pagination.pageIndex;
        const pageSize = table.getState().pagination.pageSize;
        const absoluteIndex = pageIndex * pageSize + indexOnPage + 1;
        return (
          <div className="text-left font-medium">
            <Heading level={6} className="text-zinc-400">{absoluteIndex}</Heading>
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
        <div className="flex items-center text-50 font-medium">
          {row.getValue("status")}
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
      cell: ({ row }) => (
        <span className="flex items-center text-50 font-medium">{row.getValue("modified")}</span>
      ),
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
  ];

  if (hasAction) {
    columns.push({
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-start gap-2">
          {import.meta.env.VITE_ENV !== "production" && (
            <>
              {actionTypes?.includes("Edit") && (
                <Pencil
                  className="w-4 h-4 cursor-pointer hover:text-yellow-600 text-50"
                  onClick={() => {
                    setSelectedRow(row.original);
                    setOpenModifiedDialog(true);
                  }}
                />
              )}
  
              {actionTypes?.includes("Delete") && (
                <Trash2
                  className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-700"
                  onClick={() => {
                    setSelectedRow(row.original);
                    setOpenDeleteDialog(true);
                  }}
                />
              )}
            </>
          )}
  
          {actionTypes?.includes("View") && (
            <a href={`/view?v=${row.original.viewId}`} target="_blank" rel="noopener noreferrer">
              <IoEyeSharp className="w-4 h-4 cursor-pointer hover:text-blue-600 text-50" />
            </a>
          )}
        </div>
      ),
    });
  }
  

  return columns;
};
