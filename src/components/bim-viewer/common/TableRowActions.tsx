// components/TableRowActions.tsx
import { Pencil, Trash2 } from "lucide-react";
import { IoEyeSharp } from "react-icons/io5";

export function TableRowActions({
  row,
  onEdit,
  onDelete,
  onView,
  showEdit = true,
  showDelete = true,
  showView = false,
  viewUrl,
}: {
  row: any;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  onView?: (row: any) => void;
  showEdit?: boolean;
  showDelete?: boolean;
  showView?: boolean;
  viewUrl?: string;
}) {
  return (
    <div className="flex gap-2">
      {showEdit && (
        <Pencil
          className="w-4 h-4 cursor-pointer hover:text-yellow-600"
          onClick={() => onEdit?.(row)}
        />
      )}
      {showDelete && (
        <Trash2
          className="w-4 h-4 cursor-pointer text-red-500 hover:text-red-700"
          onClick={() => onDelete?.(row)}
        />
      )}
      {showView && (
         <IoEyeSharp
          className="w-4 h-4 cursor-pointer hover:text-blue-600"
          onClick={() => onView?.(row)}
        />
      )}
    </div>
  );
}
