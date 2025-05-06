import React, { useMemo } from "react";
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { TableContent } from "@/components/model-table/TableContent";


export const Selections: React.FC = () => {
  const data = [
    {
      id: 1,
      name: "Initial resistance check for coil A",
      status: "OK",
      resistance: 12.35,
    },
    {
      id: 2,
      name: "Selection rejected due to broken wire - Coil B",
      status: "NG",
      resistance: null,
    },
    {
      id: 3,
      name: "Awaiting supervisor validation - Coil C",
      status: "WAITING",
      resistance: 15.02,
    },
    {
      id: 4,
      name: "Retest required - Coil D low resistance",
      status: "OK",
      resistance: 10.85,
    },
    {
      id: 5,
      name: "Turn count insufficient on Coil E",
      status: "NG",
      resistance: 9.64,
    },
    {
      id: 6,
      name: "Pending visual inspection - Coil F",
      status: "WAITING",
      resistance: null,
    },
    {
      id: 7,
      name: "Coil G passed electrical standards",
      status: "OK",
      resistance: 13.21,
    },
    {
      id: 8,
      name: "Wire insulation defect detected on Coil H",
      status: "NG",
      resistance: 8.77,
    },
    {
      id: 9,
      name: "Temporary hold for recheck - Coil I",
      status: "WAITING",
      resistance: 14.09,
    },
    {
      id: 10,
      name: "Preliminary test result - Coil J",
      status: "OK",
      resistance: null,
    },
  ];
  

  type ColumnMeta = {
    inputType?: "text" | "checkbox" | "textarea" | "select";
    options?: string[]; // nếu là select
  };
  
  const columns: ColumnDef<typeof data[0]>[] = [
    {
      header: "ID",
      accessorKey: "id",
      meta: { inputType: "text" } as ColumnMeta,
    },
    {
      header: "Name",
      accessorKey: "name",
      meta: { inputType: "text" } as ColumnMeta, // ⬅️ đã đổi từ textarea sang text
    },
    {
      header: "Status",
      accessorKey: "status",
      meta: {
        inputType: "select",
        options: ["OK", "NG", "WAITING"],
      } as ColumnMeta,
    },
    {
      header: "Resistance (Ω)",
      accessorKey: "resistance",
      meta: { inputType: "text" } as ColumnMeta,
    },
  ];
  
  

  const memoData = useMemo(() => data, []);
  const memoColumns = useMemo(() => columns, []);
  
  const table = useReactTable({
    data: memoData,
    columns: memoColumns,
    getCoreRowModel: getCoreRowModel(),
  });



  return <TableContent table={table} />;
  
}





