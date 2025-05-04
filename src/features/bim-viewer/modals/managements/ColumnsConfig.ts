import { Model } from "@/components/common/ModelTable";

type ColumnRenderType = "text" | "index" | "avatar" | "actions" | "custom";

export type ColumnConfig = {
  id: string;
  header: string;
  accessorKey?: keyof Model;
  sortable?: boolean;
  renderType: ColumnRenderType;
};



export const modelColumnsConfig: ColumnConfig[] = [
    { id: "no", header: "#", renderType: "index" },
    { id: "name", header: "Name", accessorKey: "name", sortable: true, renderType: "text" },
    { id: "status", header: "Status", accessorKey: "status", renderType: "text" },
    { id: "uploader", header: "Uploaded By", accessorKey: "uploader", renderType: "avatar" },
    { id: "modified", header: "Modified", accessorKey: "modified", renderType: "text" },
    { id: "size", header: "Size (MB)", accessorKey: "size", renderType: "text" },
    { id: "actions", header: "Actions", renderType: "actions" },
  ];
  