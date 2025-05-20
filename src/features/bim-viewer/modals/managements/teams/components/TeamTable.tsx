import React from "react";
import { useReactTable, getCoreRowModel, ColumnDef } from "@tanstack/react-table";
import { TableContent } from "@/components/model-table/TableContent";

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
}

export function TeamTable({ data, showNo = true, onTeamClick }: TeamTableProps) {
  const columns = React.useMemo<ColumnDef<TeamRow>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      {
        accessorKey: "name",
        header: "Team Name",
        cell: ({ row }) => (
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
        cell: ({ row }) => row.original.owner?.name || "-",
      },
      { accessorKey: "members_count", header: "Members" },
      { accessorKey: "created_at", header: "Created At" },
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
