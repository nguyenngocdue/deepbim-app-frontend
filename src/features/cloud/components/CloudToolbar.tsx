import { useState } from "react";
import { FaFolderPlus } from "react-icons/fa";
import { HiViewList, HiViewGrid } from "react-icons/hi";
import { FolderDialog } from "./FolderDialog";
import { CloudToolbarProps } from "./Type";
import { createFolder } from "@/apis/folder-api";
import { Button } from "@/components/ui/button";
import { UploadFilesButton } from "./UploadFilesButton";

const CloudToolbar = ({ selectedFolder, entityId, onCreated, onUploaded, setView, view }: CloudToolbarProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      await createFolder(data);
      onCreated?.();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="flex items-center gap-2 p-2 shadow-sm bg-muted text-sm text-muted-foreground">
      <div className="flex-1" />

      <UploadFilesButton
        selectedFolder={selectedFolder}
        onUploaded={onUploaded}
      />

      <Button
        className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-1.5 rounded"
        onClick={() => setDialogOpen(true)}
      >
        <FaFolderPlus />
        Create Folder
      </Button>

      <div className="flex gap-1 p-1 ml-2 rounded bg-background border border-border">
        <button
          onClick={() => setView("list")}
          className={`p-1 rounded ${view === "list" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"}`}
        >
          <HiViewList size={18} />
        </button>
        <button
          onClick={() => setView("grid")}
          className={`p-1 rounded ${view === "grid" ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted"}`}
        >
          <HiViewGrid size={18} />
        </button>
      </div>

      <FolderDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        entityId={entityId}
        selectedFolder={selectedFolder}
        onSubmit={onSubmit}
      />
    </div>
  );
};

export default CloudToolbar;