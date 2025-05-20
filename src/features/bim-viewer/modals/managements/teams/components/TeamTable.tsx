import React from "react";
import { useReactTable, getCoreRowModel, ColumnDef } from "@tanstack/react-table";
import { TableContent } from "@/components/model-table/TableContent";
import { IdDisplay } from "@/components/common/IdDisplay";
import { useRouter } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";

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
