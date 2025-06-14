// components/common/GenericTable.tsx
import { useMemo } from "react";
import { TableContent } from "@/components/model-table/TableContent";
import { LoadingState } from "@/components/common/LoadingState";
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
} from "@tanstack/react-table";

interface GenericTableProps<T> {
  data: T[] | null;
  filter?: string;
  columns: ColumnDef<T, any>[];
  filterBy?: (row: T, filter: string) => boolean;
  loadingMessage?: string;
}

export function GenericTable<T>({
  data,
  filter = "",
  columns,
  filterBy,
  loadingMessage = "Loading...",
}: GenericTableProps<T>) {
  const filteredData = useMemo(() => {
    if (!data) return [];
    if (!filterBy || !filter.trim()) return data;
    return data.filter((item) => filterBy(item, filter));
  }, [data, filter, filterBy]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return data === null ? (
    <LoadingState message={loadingMessage} />
  ) : (
    <TableContent table={table} key={filteredData.length} />
  );
}
