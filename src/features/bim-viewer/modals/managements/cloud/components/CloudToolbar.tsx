import { useState } from "react";
import { FaSearch, FaFolderPlus, FaFileUpload } from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";
import { HiViewList, HiViewGrid } from "react-icons/hi";
import { FolderDialog } from "./FolderDialog";
import { CloudToolbarProps } from "./Type";
import { createFolder } from "@/apis/folder-api";
import { uploadFilesIntoFolder } from "@/apis/file-api";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const CloudToolbar = ({ selectedFolder, entityId, onCreated, onUploaded }: CloudToolbarProps) => {
  const [view, setView] = useState<"list" | "grid">("list");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);


  const onSubmit = async (data: any) => {
    await createFolder(data);
    setDialogOpen(false);
    onCreated?.();
  };

  const handleUploadClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = async (e: any) => {
      const files = e.target.files;
      const folderId = Number(selectedFolder?.data?.id);
      if (!folderId) return;

      try {
        setUploading(true);
        for (const file of files) {
          const uploadedFile = await uploadFilesIntoFolder(file, folderId);
          onUploaded?.(uploadedFile); // refresh file list
        }
      } catch (err) {
        console.error(err);
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };


  return (
    <div className="flex items-center gap-2 p-2 bg-white rounded shadow-sm text-sm text-gray-700">
      <select className="border rounded px-3 py-1 hover:border-gray-400">
        <option>Mới nhất</option>
        <option>Cũ nhất</option>
        <option>Tên A-Z</option>
      </select>

      <input
        type="text"
        placeholder="Tìm kiếm ..."
        className="border rounded px-3 py-1 w-60 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />

      <button className="flex items-center gap-1 px-3 py-1 border rounded hover:border-gray-400">
        <MdCalendarToday className="text-gray-500" />
        Ngày
      </button>

      <select className="border rounded px-3 py-1 hover:border-gray-400">
        <option>Tất cả</option>
        <option>PDF</option>
        <option>Ảnh</option>
        <option>Video</option>
      </select>

      <button className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded hover:bg-green-200">
        <FaSearch />
        Tìm Kiếm
      </button>

      <div className="flex-1" />

      <Button
        onClick={handleUploadClick}
        disabled={uploading}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded"
      >
        {uploading ? (
          <>
            <Loader2 className="animate-spin w-4 h-4" />
            Uploading...
          </>
        ) : (
          <>
            <FaFileUpload />
            Upload Files
          </>
        )}
      </Button>


      <button
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded"
        onClick={() => setDialogOpen(true)}
      >
        <FaFolderPlus />
        Create a new folder
      </button>

      <div className="flex gap-1 border rounded p-1 ml-2">
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
        selectedFolder={selectedFolder}
        entityId={entityId}
        onSubmit={(data) => {
          onSubmit(data);
        }}
      />
    </div>
  );
};

export default CloudToolbar;
