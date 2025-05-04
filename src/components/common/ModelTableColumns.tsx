import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import { IoEyeSharp } from "react-icons/io5";
import { Heading } from "@/components/common/Heading";
import { AvatarUser } from "@/components/AvatarUser";
import { Button } from "@/components/ui/button";
import { Model } from "@/components/model-table/types";
import { ColumnConfig } from "@/features/bim-viewer/modals/managements/ColumnsConfig";

type ColumnOptions = {
  hasAction: boolean;
  actionTypes?: string[];
  setSelectedRow: (row: Model) => void;
  setOpenDeleteDialog: (open: boolean) => void;
  setOpenModifiedDialog: (open: boolean) => void;
  table: any;
  configs: ColumnConfig[];
};

export const getModelTableColumns = ({
  hasAction,
  actionTypes,
  setSelectedRow,
  setOpenDeleteDialog,
  setOpenModifiedDialog,
  table,
  configs,
}: ColumnOptions): ColumnDef<Model>[] => {
  return configs
  .filter((config) => config.renderType !== "actions" || hasAction)
  .map((config): ColumnDef<Model> => {
    switch (config.renderType) {
      case "index":
        return {
          id: config.id,
          header: config.header,
          cell: ({ row }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            const absoluteIndex = pageIndex * pageSize + row.index + 1;
            return (
              <Heading level={6} className="text-zinc-400">{absoluteIndex}</Heading>
            );
          },
          size: 50,
        };

      case "avatar":
        return {
          accessorKey: config.accessorKey,
          header: config.header,
          cell: ({ row }) => {
            const uploader = row.getValue(config.accessorKey!) as Model["uploader"];
            return (
              <AvatarUser img={uploader.avatar} name={uploader.email} size="md" />
            );
          },
        };

      case "actions":
        return {
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
        };

      case "text":
      default:
        return {
          accessorKey: config.accessorKey,
          header: ({ column }) =>
            config.sortable ? (
              <Button
                variant="ghost"
                className="px-0"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                {config.header}
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              config.header
            ),
          cell: ({ row }) => {
            const value = row.getValue(config.accessorKey!);
            if (config.accessorKey === "size") {
              return <div className="text-50 font-medium">{(value as number).toFixed(2)} MB</div>;
            }
            return <div className="text-50 font-medium">{value}</div>;
          },
          enableSorting: config.sortable,
        };
    }
  });
};
