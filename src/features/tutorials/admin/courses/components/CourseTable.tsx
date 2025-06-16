import { useMemo } from "react";
import { TableContent } from "@/components/model-table/TableContent";
import { LoadingState } from "@/components/common/LoadingState";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { CourseColumns } from "./CourseColumns";
import { Course } from "./types";

interface CourseTableProps {
  data: Course[] | null;
  filter: string;
  onEdit: (row: Course) => void;
  onDelete: (row: Course) => void;
  onView: (row: Course) => void;
}

export const CourseTable = ({
  data,
  filter,
  onEdit,
  onDelete,
  onView,
}: CourseTableProps) => {
  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item) =>
      item?.title?.toLowerCase().includes(filter.toLowerCase())
    );
  }, [data, filter]);

  const columns = useMemo(
    () => CourseColumns({ onEdit, onDelete, onView }),
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