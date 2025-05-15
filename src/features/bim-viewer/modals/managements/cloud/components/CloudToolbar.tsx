import { useState } from "react";
import { FaSearch, FaFolderPlus, FaFileUpload } from "react-icons/fa";
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
    throw error; // ném lỗi ra để component con bắt
  }
};




  return (
    <div className="flex items-center gap-2 p-2 bg-behind shadow-sm text-sm text-gray-700">
      <div className="flex-1" />
      <UploadFilesButton
        selectedFolder={selectedFolder}
        onUploaded={onUploaded}
      />

      <Button
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded"
        onClick={() => setDialogOpen(true)}
      >
        <FaFolderPlus />
        Create a new folder
      </Button>

      <div className="flex gap-1  shadow-zinc-500 p-1 ml-2">
        <button
          onClick={() => setView("list")}
          className={`p-1 rounded ${view === "list" ? "bg-green-100 text-green-700" : "text-gray-500"}`}
        >
          <HiViewList size={18} />
        </button>
        <button
          onClick={() => setView("grid")}
          className={`p-1 rounded ${view === "grid" ? "bg-green-100 text-green-700" : "text-gray-500"}`}
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
