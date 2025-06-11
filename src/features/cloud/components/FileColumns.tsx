import { createColumnHelper } from "@tanstack/react-table";
import { AvatarUser } from "@/components/AvatarUser";
import { FileActionDropdown } from "./FileActionDropdown";
import { DateTimeDisplay } from "@/components/bim-viewer/common/DateTimeDisplay";
import { handleDownload } from "../hooks/handleDownload";
import { FileItem } from "./Type"; // type của bạn
import { getIconByType } from "@/utils/get-icon-by-type";
import { formatFileSize } from "@/utils/format-file-size";

const columnHelper = createColumnHelper<FileItem>();

export const fileColumns = [
   columnHelper.display({
    id: "id",
    header: "Id",
    cell: ({row}) => <span className="text-slate-600 dark:text-slate-400">#{row.original.id}</span>,
    meta: { width: 56 },
  }),
  columnHelper.display({
    id: "icon",
    header: "Icon",
    cell: ({ row }) =>
      getIconByType(row.original.type, row.original.media?.extension, row.original.media?.url),
    meta: { width: 56 },
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: info => <span title={info.getValue()} className="truncate">{info.getValue()}</span>,
    meta: { width: 200 },
  }),
  columnHelper.accessor(row => row.media?.extension?.toUpperCase() || "-", {
    id: "type",
    header: "Type",
    cell: info => info.getValue(),
    meta: { width: 80 },
  }),
  columnHelper.display({
    id: "creator",
    header: "Creator",
    cell: ({ row }) => (
      <AvatarUser
        name={row.original.creator?.user_name}
        img={row.original.creator?.avatar_url}
        id={row.original.creator?.id}
      />
    ),
    meta: { width: 120 },
  }),
  columnHelper.display({
    id: "version",
    header: "Version",
    cell: () => "v1",
    meta: { width: 64 },
  }),
  columnHelper.accessor("updated_at", {
    header: "Updated At",
    cell: info => <DateTimeDisplay isoDate={info.getValue()} formatString="yyyy-MM-dd" />,
    meta: { width: 128 },
  }),

  columnHelper.display({
    id: "size",
    header: "Size",
    cell: ({ row }) => formatFileSize(row.original.media?.size),
    meta: { width: 120 },
  }),




  columnHelper.display({
  id: "actions",
  header: "",
  cell: ({ row, table }) => (
    <FileActionDropdown
      file={row.original}
      onMove={file => table.options.meta.triggerDialog(table.options.meta.setMoveFile, file)}
      onDelete={file => table.options.meta.triggerDialog(table.options.meta.setDeleteFile, file)}
      onView={file => table.options.meta.triggerDialog(table.options.meta.setFileViewer, file)}
      onDownload={file => handleDownload(file)}
    />
  ),
  meta: { width: 56 },
}),

];
