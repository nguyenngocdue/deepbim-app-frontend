import { useMemo } from "react";
import { TableContent } from "@/components/model-table/TableContent";
import { LoadingState } from "@/components/common/LoadingState";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { LessonColumns } from "./LessonColumns";
import { Lesson } from "./types";

interface LessonTableProps {
  data: Lesson[] | null;
  filter: string;
  onEdit: (row: Lesson) => void;
  onDelete: (row: Lesson) => void;
  onView: (row: Lesson) => void;
}

export const LessonTable = ({
  data,
  filter,
  onEdit,
  onDelete,
  onView,
}: LessonTableProps) => {
  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item) =>
      item?.title?.toLowerCase().includes(filter.toLowerCase())
    );
  }, [data, filter]);

  const columns = useMemo(
    () => LessonColumns({ onEdit, onDelete, onView }),
    [onEdit, onDelete, onView]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return data === null ? (
    <LoadingState />
  ) : (
    <TableContent table={table} key={filteredData.length} />
  );
};