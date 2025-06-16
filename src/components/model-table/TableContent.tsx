import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ColumnMeta, flexRender, Table as TableType } from "@tanstack/react-table"
import type { ColumnMeta as ColumnMetaType } from "@tanstack/react-table"

interface TableContentProps<T> {
  table: TableType<T>
  showNo?: boolean
}

function RenderCell<T>({
  cell,
  rowData,
}: {
  cell: ReturnType<TableType<T>["getRowModel"]["rows"][number]["getVisibleCells"]>[number]
  rowData: T
}) {
  const meta = cell.column.columnDef.meta as ColumnMetaType<T, unknown> | undefined
  const value = cell.getValue()

  const onChangeCheckbox = (checked: boolean) => {
    ;(rowData as any)[cell.column.id] = checked
  }

  const onChangeSelect = (val: string) => {
    ;(rowData as any)[cell.column.id] = val
  }

  const onChangeTextarea = (val: string) => {
    ;(rowData as any)[cell.column.id] = val
  }

  if (!meta?.inputType) {
    return flexRender(cell.column.columnDef.cell, cell.getContext())
  }

  switch (meta.inputType) {
    case "checkbox":
      return (
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChangeCheckbox(e.target.checked)}
        />
      )
    case "id":
      return <span className="font-mono text-muted-foreground">#{value}</span>

    case "select":
      return (
        <select
          value={value}
          onChange={(e) => onChangeSelect(e.target.value)}
          className="bg-background border rounded px-2 py-1"
        >
          {meta.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      )

    case "textarea":
      return (
        <textarea
          value={value}
          onChange={(e) => onChangeTextarea(e.target.value)}
          className="bg-background border rounded w-full px-2 py-1"
          rows={2}
        />
      )

    case "tag":
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
          {typeof value === "string" ? value : JSON.stringify(value)}
        </span>
      )

    default:
      return flexRender(cell.column.columnDef.cell, cell.getContext())
  }
}

export function TableContent<T>({ table, showNo = true }: TableContentProps<T>) {
  const headerGroups = table.getHeaderGroups()
  const rows = table.getRowModel().rows

  const colSpan = (headerGroups[0]?.headers.length || 1) + (showNo ? 1 : 0)

  return (
<div className="w-full overflow-x-auto rounded-md border border-zinc-400 bg-background shadow-sm">
  <div className="max-h-[600px] overflow-y-auto">
    <Table className="min-w-max border-collapse relative">
      <TableHeader>
        {headerGroups.map((headerGroup) => (
          <TableRow key={headerGroup.id} className="border-b border-zinc-500">
            {showNo && (
              <TableHead
                className="sticky top-0 left-0 z-30 bg-muted px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide shadow-md whitespace-nowrap"
              >
                No.
              </TableHead>
            )}
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="sticky top-0 z-20 bg-muted px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide text-left whitespace-nowrap shadow-md"
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {rows.length > 0 ? (
          rows.map((row, idx) => {
            const rowData = row.original;
            return (
              <TableRow
                key={row.id}
                className="border-b border-gray-600 hover:bg-muted/50 transition-colors"
              >
                {showNo && (
                  <TableCell className="sticky left-0 z-10 bg-background px-4 py-2 text-sm text-foreground font-medium shadow-md">
                    {idx + 1}
                  </TableCell>
                )}
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className={`px-4 py-2 text-sm text-foreground whitespace-nowrap ${
                      cell.column.id === "name" || cell.column.id === "location"
                        ? "truncate max-w-[200px] overflow-hidden"
                        : ""
                    }`}
                  >
                    <RenderCell cell={cell} rowData={rowData} />
                  </TableCell>
                ))}
              </TableRow>
            );
          })
        ) : (
          <TableRow>
            <TableCell
              colSpan={colSpan}
              className="text-center py-12 text-muted-foreground italic"
            >
              No data available.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  </div>
</div>




)
}
