import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import { TableContent } from "@/components/model-table/TableContent";
import { FileListViewProps } from "./Type";
import { fileColumns } from "./FileColumns";

export function FileListView({
  files,
  triggerDialog,
  setMoveFile,
  setDeleteFile,
  setFileViewer,
}: FileListViewProps) {
  const table = useReactTable({
    data: files,
    columns: fileColumns,
    getCoreRowModel: getCoreRowModel(),
    meta: { triggerDialog, setMoveFile, setDeleteFile, setFileViewer },
  });

  return <TableContent table={table} showNo={true} />;
}
