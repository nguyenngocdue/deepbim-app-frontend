import { DateTimeDisplay } from "@/components/bim-viewer/common/DateTimeDisplay";
import { LoadingState } from "@/components/common/LoadingState";
import { handleDownload } from "../hooks/handleDownload";
import { FileActionDropdown } from "./FileActionDropdown";
import { getIconByType } from "@/utils/get-icon-by-type";

// Define the FileItem type for clarity
interface FileItem {
  id: string;
  name: string;
  type?: string;
  media?: { extension?: string; url?: string };
  creator: { user_name: string };
  updated_at: string;
}

// Props for FileGridView
interface FileGridViewProps {
  files: FileItem[];
  triggerDialog: (
    setter: React.Dispatch<React.SetStateAction<FileItem | null>>,
    file: FileItem
  ) => void;
  setMoveFile: React.Dispatch<React.SetStateAction<FileItem | null>>;
  setDeleteFile: React.Dispatch<React.SetStateAction<FileItem | null>>;
  setFileViewer: React.Dispatch<React.SetStateAction<FileItem | null>>;
}

export const FileGridView = ({
  files,
  triggerDialog,
  setMoveFile,
  setDeleteFile,
  setFileViewer,
}: FileGridViewProps) => {
  // Render the dropdown menu for file actions
  const renderDropdownMenu = (file: FileItem) => (
    <FileActionDropdown
      file={file}
      onMove={() => triggerDialog(setMoveFile, file)}
      onDelete={() => triggerDialog(setDeleteFile, file)}
      onView={() => triggerDialog(setFileViewer, file)}
      onDownload={() => handleDownload(file)}
    />
  );

  return (
    <div className="grid gap-4 p-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {files.length > 0 ? (
        files.map((file) => (
          <div
            key={file.id}
            className="group relative flex flex-col gap-2 rounded-lg border border-neutral-700 bg-neutral-900 p-3 transition-all hover:border-blue-500 hover:shadow-md"
          >
            <div className="flex h-32 items-center justify-center rounded-md bg-neutral-800">
              {getIconByType(
                file.type,
                file.media?.extension,
                file.media?.url // truyền url vào
              )}
            </div>
            <div className="flex-1">
              <p
                className="truncate text-sm font-medium text-neutral-100 group-hover:text-blue-400"
                title={file.name}
              >
                {file.name}
              </p>
              <p className="text-xs text-neutral-500">
                {file.media?.extension?.toUpperCase() || "-"}
              </p>
            </div>
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span className="truncate">{file.creator.user_name}</span>
              <DateTimeDisplay isoDate={file.updated_at} />
            </div>
            <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100">
              {renderDropdownMenu(file)}
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full flex justify-center">
          <LoadingState />
        </div>
      )}
    </div>
  );
};
