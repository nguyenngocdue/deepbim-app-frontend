import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { uploadFilesIntoFolder } from "@/apis/file-api";

interface UploadFilesButtonProps {
  selectedFolder: { data?: { id?: number | string } } | null;
  onUploaded?: (uploadedFile: any) => void;
}

export const UploadFilesButton = ({ selectedFolder, onUploaded }: UploadFilesButtonProps) => {
  const [uploading, setUploading] = useState(false);

  const handleUploadClick = () => {
    const folderId = Number(selectedFolder?.data?.id);

    if (!folderId) {
      toast.warning("Please select a folder before uploading files");
      return;
    }

    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.onchange = async (e: any) => {
      const files = e.target.files;
      try {
        setUploading(true);
        for (const file of files) {
          const uploadedFile = await uploadFilesIntoFolder(file, folderId);
          onUploaded?.(uploadedFile); // refresh file list
        }
      } catch (err) {
        console.error(err);
        toast.error("Upload failed");
      } finally {
        setUploading(false);
      }
    };
    input.click();
  };

  return (
    <Button onClick={handleUploadClick} disabled={uploading}>
      {uploading ? "Uploading..." : "Upload Files"}
    </Button>
  );
};
