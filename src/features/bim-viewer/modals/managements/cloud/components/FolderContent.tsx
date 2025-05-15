import React, { useState, useEffect } from "react";
import { FileText, MoreHorizontal, Move, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { deleteFileById, moveFileToFolder } from "@/apis/file-api";
import { getFoldersBySubProjectId } from "@/apis/folder-api";
import { DialogTemplate } from "@/components/model-table/DialogTemplate";
import AppButton from "@/components/bim-viewer/common/AppButton";
import { DateTimeDisplay } from "@/components/bim-viewer/common/DateTimeDisplay";
import { FaEye } from "react-icons/fa";

interface FileItem {
  id: number;
  name: string;
  type?: string;
  folder_id?: number;
  media?: {
    url: string;
    extension: string;
  };
  updated_at: string; // ISO date string
  creator: {
    user_name: string;
  };
}

interface FolderItem {
  id: number;
  name: string;
}

interface FolderContentProps {
  files: FileItem[];
  view: "list" | "grid";
  entityId: number;
  currentFolderId: number;
}

export const FolderContent: React.FC<FolderContentProps> = ({ files, view, entityId, currentFolderId }) => {
  const [fileList, setFileList] = useState<FileItem[]>(files);

  const [deleteFile, setDeleteFile] = useState<FileItem | null>(null);
  const [moveFile, setMoveFile] = useState<FileItem | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [availableFolders, setAvailableFolders] = useState<FolderItem[]>([]);

  useEffect(() => {
    setFileList(files);
  }, [files]);

  useEffect(() => {
    const fetchFolders = async () => {
      const response = await getFoldersBySubProjectId(entityId);
      setAvailableFolders(response.data);
    };
    fetchFolders();
  }, [entityId]);

  const triggerDialog = (
    setter: React.Dispatch<React.SetStateAction<FileItem | null>>,
    file: FileItem
  ) => {
    setter(null); // reset trước
    requestAnimationFrame(() => setter(file)); // set lại ở frame tiếp theo
  };

  const onConfirmDelete = async () => {
    if (!deleteFile) return;
    try {
      await deleteFileById(deleteFile.id);
      toast.success("File deleted successfully");
      setFileList((prev) => prev.filter((f) => f.id !== deleteFile.id));
      setDeleteFile(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete file");
    }
  };

  const onMoveToFolder = async () => {
    if (!moveFile || !selectedFolderId) return;
    try {
      await moveFileToFolder(moveFile.id, { folder_id: selectedFolderId });
      setFileList((prev) =>
        prev.map((f) => (f.id === moveFile.id ? { ...f, folder_id: selectedFolderId } : f))
      );
      toast.success(`File "${moveFile.name}" moved successfully`);
      setMoveFile(null);
      setSelectedFolderId(null);
    } catch (error) {
      console.error(error);
      toast.error("Failed to move file");
    }
  };

  const filteredFiles = fileList.filter((file) => file.folder_id === currentFolderId);

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

  if (view !== "list") {
    return <div className="text-center text-muted-foreground">Grid view not implemented yet.</div>;
  }

  console.log(filteredFiles);

  return (
    <div className="w-full mx-auto space-y-[0.5px]">
    <div className="grid grid-cols-7 gap-3 py-2 px-4 text-sm font-semibold 
                    bg-muted text-muted-foreground border-b border-border rounded-t-md">
      <span>Icon</span>
      <span>File name</span>
      <span>Type</span>
      <span>Creator</span>
      <span>Created At</span>
    </div>

      {filteredFiles.map((file) => (
        <div
          key={file.id}
          className="group grid grid-cols-7 gap-3 items-center px-4 py-2 rounded-sm
            even:bg-muted/50 odd:bg-muted hover:bg-gray-500
            border-b border-border transition"
        >
          <div>{getIconByType(file.type)}</div>
          <div className="truncate text-200">{file.name}</div>
          <div className=" text-200">
            {file.media?.extension || "-"}
          </div>
          <div className="truncate text-200">{file.creator.user_name}</div>
          <DateTimeDisplay isoDate={file.updated_at} />

          <div className="text-right invisible group-hover:visible ">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => triggerDialog(setMoveFile, file)}>
                  <Move className="mr-2 h-4 w-4" /> Move to Folder
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => triggerDialog(setDeleteFile, file)}
                  className="text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => triggerDialog(setDeleteFile, file)}
                  className=""
                >
                  <FaEye  className="mr-2 h-4 w-4" /> View
                </DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ))}


      {/* Delete Dialog */}
      <DialogTemplate
        open={!!deleteFile}
        onClose={() => setDeleteFile(null)}
        title="Delete File"
        description={`Are you sure you want to delete "${deleteFile?.name}"?`}
        footer={
          <>
            <AppButton
              onClick={() => setDeleteFile(null)}
              falseName="Cancel"
            />
            <AppButton
              variant="destructive"
              onClick={onConfirmDelete}
              falseName="Delete"
            />
          </>
        }
      >
        <p className="text-sm">This action cannot be undone.</p>
      </DialogTemplate>

      {/* Move Dialog */}
      <DialogTemplate
        open={!!moveFile}
        onClose={() => {
          setMoveFile(null);
          setSelectedFolderId(null);
        }}
        title="Move File"
        description={`Select a folder to move "${moveFile?.name}" into.`}
        footer={
          <>
            <AppButton
              onClick={() => {
                setMoveFile(null);
                setSelectedFolderId(null);
              }}
              falseName="Cancel"
            />
            <AppButton
              onClick={onMoveToFolder}
              isLoading={!selectedFolderId}
              trueName="Submit"
            />
          </>
        }
      >
        <div className="flex flex-col space-y-2 max-h-48 overflow-y-auto">
          {availableFolders.map((folder) => (
            <Button
              variant={selectedFolderId === folder.id ? "secondary" : "ghost"}
              key={folder.id}
              className="justify-start"
              onClick={() => setSelectedFolderId(folder.id)}
            >
              {folder.name}
            </Button>
          ))}
        </div>
      </DialogTemplate>
    </div>
  );
};
