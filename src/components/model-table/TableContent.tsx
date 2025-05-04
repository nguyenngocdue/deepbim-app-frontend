import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender, Table as TableType } from "@tanstack/react-table";

interface TableContentProps<T> {
  table: TableType<T>;
}

export function TableContent<T>({ table }: TableContentProps<T>) {
  const headers = table.getHeaderGroups();
  const rows = table.getRowModel().rows;

  return (
    <div className="rounded-2xl border border-border bg-background shadow-sm overflow-auto max-h-[600px]">
      <Table className="w-full border-collapse">
        <TableHeader className="bg-muted sticky top-0 z-10 shadow-sm">
          {headers.map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b border-border">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {rows.length ? (
            rows.map((row) => (
              <TableRow
                key={row.id}
                className="border-b border-border hover:bg-muted/50 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="px-4 py-2 text-sm text-foreground"
                    title={`ID: ${(row.original as any)?.id ?? "unknown"}`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={headers[0]?.headers.length || 1}
                className="text-center py-12 text-muted-foreground italic"
              >
                No data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
