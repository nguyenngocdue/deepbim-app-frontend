import { ColumnDef } from "@tanstack/react-table";
import { TableRowActions } from "@/components/bim-viewer/common/TableRowActions";

interface BuildColumnsProps<T> {
  baseColumns: ColumnDef<T, any>[];
  withActions?: boolean;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onView?: (row: T) => void;
}

export function BuildColumns<T>({
  baseColumns,
  withActions = true,
  onEdit,
  onDelete,
  onView,
}: BuildColumnsProps<T>): ColumnDef<T>[] {
  if (!withActions) return baseColumns;

  return [
    ...baseColumns,
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <TableRowActions
          row={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ),
    },
  ];
}
