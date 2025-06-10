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
    <div className="rounded-md border border-zinc-400 overflow-auto bg-background shadow-sm max-h-[600px]">
      <Table className="w-full border-collapse relative overflow-auto">
        <TableHeader  className="sticky bg-muted top-0 z-10 shadow-sm">
          {headerGroups.map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-b border-zinc-500">
              {showNo && (
                <TableHead className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  No.
                </TableHead>
              )}
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide text-center"
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
              const rowData = row.original
              return (
                <TableRow
                  key={row.id}
                  className="border-b border-gray-600 hover:bg-muted/50 transition-colors"
                >
                  {showNo && (
                    <TableCell className="px-4 py-2 text-sm text-foreground font-medium">
                      {idx + 1}
                    </TableCell>
                  )}
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={
                        cell.column.id === "name"
                          ? "px-4 py-2 text-sm text-foreground truncate max-w-[200px]"
                          : "px-4 py-2 text-sm text-foreground"
                      }
                    >
                      <RenderCell cell={cell} rowData={rowData} />
                    </TableCell>
                  ))}
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={colSpan} className="text-center py-12 text-muted-foreground italic">
                No data available.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
