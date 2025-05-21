import React from "react";
import { useReactTable, getCoreRowModel, ColumnDef } from "@tanstack/react-table";
import { TableContent } from "@/components/model-table/TableContent";
import { IdDisplay } from "@/components/common/IdDisplay";
import { useLocation } from "@tanstack/react-router";
import { Pencil, Trash2, Eye } from "lucide-react";

export interface TeamRow {
  id: number;
  name: string;
  description: string;
  owner?: { id: number; name: string };
  members_count: number;
  created_at: string;
}

interface TeamTableProps {
  data: TeamRow[];
  showNo?: boolean;
  onTeamClick?: (team: TeamRow) => void;
  onEdit?: (team: TeamRow) => void;
  onRemove?: (team: TeamRow) => void;
  onView?: (team: TeamRow) => void;
}

export function TeamTable({ data, showNo = true, onTeamClick, onEdit, onRemove, onView }: TeamTableProps) {
  const location = useLocation(); 
  const pathname = location.pathname;
  
  const columns = React.useMemo<ColumnDef<TeamRow>[]>(
    () => [
      { 
        accessorKey: "id", 
        header: "ID",
        cell: ({row}) => (
          <IdDisplay id={row.original.id} link={`${pathname}/${row.original.id}`} />
        )
      },
      {
        accessorKey: "name",
        header: "Team Name",
        cell: ({ row }: { row: { original: TeamRow } }) => (
          <span
            // className="text-primary cursor-pointer underline"
            // onClick={() => onTeamClick?.(row.original)}
          >
            {row.original.name}
          </span>
        ),
      },
      { accessorKey: "description", header: "Description" },
      {
        accessorKey: "owner",
        header: "Owner",
        cell: ({ row }) => row.original.owner?.name || "-",
      },
      { accessorKey: "members_count", header: "Members" },
      { accessorKey: "created_at", header: "Created At" },
{
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }) => (
        <div className="flex items-center gap-4 justify-center">
          <button
            className="p-1 hover:bg-zinc-800 rounded"
            title="Edit"
            onClick={() => onEdit?.(row.original)}
          >
            <Pencil size={18} />
          </button>
          <button
            className="p-1 hover:bg-zinc-800 rounded text-red-500"
            title="Delete"
            onClick={() => onRemove?.(row.original)}
          >
            <Trash2 size={18} />
          </button>
          <button
            className="p-1 hover:bg-zinc-800 rounded"
            title="View"
            onClick={() => onView?.(row.original)}
          >
            <Eye size={18} />
          </button>
        </div>
      ),
    }
      
    ],
    [onTeamClick]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <TableContent table={table} showNo={showNo} />;
}

export default TeamTable;
