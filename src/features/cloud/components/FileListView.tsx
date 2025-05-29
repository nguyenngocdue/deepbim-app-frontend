import { FileText, MoreHorizontal, Move, Trash2 } from "lucide-react";
import { DateTimeDisplay } from "@/components/bim-viewer/common/DateTimeDisplay";
import { LoadingState } from "@/components/common/LoadingState";
import { FileListViewProps } from "./Type";
import { FileActionDropdown } from "./FileActionDropdown";
import { handleDownload } from "../hooks/handleDownload";


export const FileListView = ({
  files,
  triggerDialog,
  setMoveFile,
  setDeleteFile,
  setFileViewer,
}: FileListViewProps) => {
  const getIconByType = (type?: string) => {
    const typeColors: Record<string, string> = {
      pdf: "text-red-600",
      note: "text-green-600",
      image: "text-blue-600",
      video: "text-purple-600",
      folder: "text-yellow-600",
    };
    const color = typeColors[type || ""] || "text-gray-600";
    return <FileText className={`w-6 h-6 ${color}`} />;
  };



  return (
    <div className="w-full mx-auto space-y-[0.5px]">
      <div className="grid grid-cols-7 gap-3 py-2 px-4 text-xs uppercase tracking-wide font-semibold text-neutral-300 bg-accent border-b border-neutral-700 text-50">
        <span>Icon</span>
        <span>Name</span>
        <span>Type</span>
        <span>Version</span>
        <span>Upload By</span>
      </div>
      {
        files.length > 0 ?

          files.map((file) => (
            <div
              key={file.id}
              className="group grid grid-cols-7 gap-3 items-center px-4 py-2 rounded-sm even:bg-muted/50 odd:bg-muted hover:bg-gray-500 border-b border-gray-500 transition"
            >
              <div>{getIconByType(file.type)}</div>
              <div className=" text-200">{file.name}</div>
              <div className="text-200">{file.media?.extension || "-"}</div>
              <div className="truncate text-200">{file.creator.user_name}</div>
              <DateTimeDisplay isoDate={file.updated_at} formatString="yyyy-MM-dd" />
              <div className="text-right invisible group-hover:visible">
               <FileActionDropdown
                  file={file}
                  onMove={file => triggerDialog(setMoveFile, file)}
                  onDelete={file => triggerDialog(setDeleteFile, file)}
                  onView={file => triggerDialog(setFileViewer, file)}
                  onDownload={file => handleDownload(file)}
                />
              </div>
            </div>
          )): <LoadingState />
      }
    </div>
  );
};
