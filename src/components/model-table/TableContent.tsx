import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { flexRender } from "@tanstack/react-table";
  import LinkMark from "@/components/auth/LinkMark";
  
  export function TableContent({ table, columns }: any) {
    return (
      <div className="rounded-md border border-zinc-400 overflow-auto">
        <Table className="border-collapse w-full">
          <TableHeader className="shadow-md">
            {table.getHeaderGroups().map((headerGroup: any) => (
              <TableRow key={headerGroup.id} className="border-b border-zinc-600">
                {headerGroup.headers.map((header: any) => (
                  <TableHead key={header.id} className="text-left">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
  
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row: any) => (
                <TableRow key={row.id} className="border-b border-zinc-500">
                  {row.getVisibleCells().map((cell: any) => (
                    <TableCell key={cell.id} className="text-zinc-300" title={`ID: ${row.original.id}`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-150 italic">
                  No data available. Please upload or <LinkMark to="/sign-in">sign-in</LinkMark> again if you are a guest.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    );
  }
  