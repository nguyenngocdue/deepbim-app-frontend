import { useMemo } from "react";
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { TableContent } from "@/components/model-table/TableContent";

// Định nghĩa kiểu dữ liệu
interface ModelInfo {
  id: string;
  modelName: string;
  createdAt: string;
  updatedAt: string;
  size: string;
  owner: string;
}

export default function ModelCombineTable() {
  // Dữ liệu tạm
  const data: ModelInfo[] = [
    {
      id: "1",
      modelName: "Building A",
      createdAt: "2024-03-10T14:23:00Z",
      updatedAt: "2025-01-15T09:10:00Z",
      size: "25.3 MB",
      owner: "Alice",
    },
    {
      id: "2",
      modelName: "Office Tower",
      createdAt: "2023-12-01T08:00:00Z",
      updatedAt: "2025-04-20T13:55:00Z",
      size: "48.6 MB",
      owner: "Bob",
    },
    {
      id: "3",
      modelName: "Factory Zone",
      createdAt: "2024-06-21T10:45:00Z",
      updatedAt: "2025-02-10T11:20:00Z",
      size: "32.1 MB",
      owner: "Charlie",
    },
  ];

  // Định nghĩa column cho bảng
  const columns: ColumnDef<ModelInfo>[] = useMemo(
    () => [
      {
        accessorKey: "modelName",
        header: "Model Name",
        cell: (info) => <span className="font-medium">{info.getValue() as string}</span>,
      },
      {
        accessorKey: "createdAt",
        header: "Created",
        cell: (info) =>
          format(new Date(info.getValue() as string), "dd MMM yyyy"),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated",
        cell: (info) =>
          format(new Date(info.getValue() as string), "dd MMM yyyy"),
      },
      {
        accessorKey: "size",
        header: "Size",
      },
      {
        accessorKey: "owner",
        header: "Owner",
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3 text-foreground">Model Combine Table</h2>
      <TableContent table={table} />
    </div>
  );
}
