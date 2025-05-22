import React from "react";
import { useReactTable, getCoreRowModel, ColumnDef } from "@tanstack/react-table";
import { TableContent } from "@/components/model-table/TableContent";
import { IdDisplay } from "@/components/common/IdDisplay";
import { useLocation } from "@tanstack/react-router";
import { Pencil, Trash2, Eye } from "lucide-react";
import { AvatarUser } from "@/components/AvatarUser";
import { AvatarGroup } from "@/components/AvatarGroup";
import { Button } from "@/components/ui/button";
import { DateTimeDisplay } from "@/components/bim-viewer/common/DateTimeDisplay";

export interface TeamRow {
  id: number;
  name: string;
  description: string;
  owner?: { id: number; name: string; picture?: string; user_name?: string };
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
            className="text-primary cursor-pointer underline"
            onClick={() => onTeamClick?.(row.original)}
          >
            {row.original.name}
          </span>
        ),
      },
      { accessorKey: "description", header: "Description" },
      {
        accessorKey: "owner",
        header: "Owner",
        cell: ({ row }) =>
          row.original.owner ? (
            <AvatarUser
              img={row.original.owner.picture}
              name={row.original.owner.user_name}
              size="md"
            />
          ) : (
            <span>-</span>
          ),
      },
      { 
        accessorKey: "members_count", 
        header: "Members",
        cell: ({ row }) => {
          const users = (row.original.members).map(item => item.user);;
          return (
            <span>
              <AvatarGroup members={users} maxDisplay={3}/>
            </span>
        )
      }
    },
    { 
      accessorKey: "created_at", 
      header: "Created At",
      cell: ({ row }) => {
        return (
          <DateTimeDisplay isoDate={row.original.created_at} />
        )
      }
    },
    {
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }) => (
        <div className="flex items-center gap-0 justify-center">
          <Button
            variant='ghost' size='icon'
            className="p-1 hover:bg-zinc-200 rounded "
            title="Edit"
            onClick={() => onEdit?.(row.original)}
          >
            <Pencil size={18} />
          </Button>
          <Button
            variant='ghost' size='icon'
            className="p-1 hover:bg-zinc-200 rounded text-red-500"
            title="Delete"
            onClick={() => onRemove?.(row.original)}
          >
            <Trash2 size={18} />
          </Button>
          <Button
            variant='ghost' size='icon'
            className="p-1 hover:bg-zinc-200 rounded"
            title="View"
            onClick={() => onView?.(row.original)}
          >
            <Eye size={18} />
          </Button>
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
