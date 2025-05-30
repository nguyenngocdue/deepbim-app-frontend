import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { uploadFilesIntoFolder } from "@/apis/file-api";

interface UploadFilesButtonProps {
  selectedFolder: { data?: { id?: number | string } } | null;
  onUploaded?: (uploadedFile: any) => void;
  setLoadingUploadFile?: (loading: boolean) => void;
}

export const UploadFilesButton = ({ selectedFolder, onUploaded, setLoadingUploadFile }: UploadFilesButtonProps) => {
  const [loading, setLoading] = useState(false);

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
        setLoading(true)
        setLoadingUploadFile?.(true);
        for (const file of files) {
          const uploadedFile = await uploadFilesIntoFolder(file, folderId);
          onUploaded?.(uploadedFile); // refresh file list
          toast.success('File uploaded successfully.')
        }
      } catch (err) {
        console.error(err);
        const errorMessage = (err instanceof Error) ? err.message : String(err);
        toast.error(`Upload failed ${errorMessage}`);
      } finally {
        setLoading(false)
        setLoadingUploadFile?.(false);
      }
    };
    input.click();
  };

  return (
      <Button 
        onClick={handleUploadClick} 
        disabled={loading}
        className="dark:bg-green-500 dark:text-50"
        >
        {loading ? "Uploading..." : "Upload Files"}
      </Button>
  );
};
