import { DialogTemplate } from "@/components/model-table/DialogTemplate";
import AppButton from "@/components/bim-viewer/common/AppButton";
import { Button } from "@/components/ui/button";
import { FileItem, FolderItem } from "./types";

interface Props {
  deleteFile: FileItem | null;
  setDeleteFile: React.Dispatch<React.SetStateAction<FileItem | null>>;
  onConfirmDelete: () => void;
  moveFile: FileItem | null;
  setMoveFile: React.Dispatch<React.SetStateAction<FileItem | null>>;
  availableFolders: FolderItem[];
  selectedFolderId: number | null;
  setSelectedFolderId: React.Dispatch<React.SetStateAction<number | null>>;
  onMoveToFolder: () => void;
}

export const MoveDeleteDialogs: React.FC<Props> = ({
  deleteFile,
  setDeleteFile,
  onConfirmDelete,
  moveFile,
  setMoveFile,
  availableFolders,
  selectedFolderId,
  setSelectedFolderId,
  onMoveToFolder,
}) => {
  return (
    <>
      {/* Delete Dialog */}
      <DialogTemplate
        open={!!deleteFile}
        onClose={() => setDeleteFile(null)}
        title="Delete File"
        description={`Are you sure you want to delete "${deleteFile?.name}"?`}
        footer={
          <>
            <AppButton onClick={() => setDeleteFile(null)} falseName="Cancel" />
            <AppButton variant="destructive" onClick={onConfirmDelete} falseName="Delete" />
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
            <AppButton onClick={onMoveToFolder} isLoading={!selectedFolderId} trueName="Submit" />
          </>
        }
      >
        <div className="flex flex-col space-y-2 max-h-48 overflow-y-auto">
          {availableFolders.map((folder) => (
            <Button
              key={folder.id}
              variant={selectedFolderId === folder.id ? "secondary" : "ghost"}
              className="justify-start"
              onClick={() => setSelectedFolderId(folder.id)}
            >
              {folder.name}
            </Button>
          ))}
        </div>
      </DialogTemplate>
    </>
  );
};
