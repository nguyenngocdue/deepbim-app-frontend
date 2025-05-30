import { DialogTemplate } from "@/components/model-table/DialogTemplate";
import AppButton from "@/components/bim-viewer/common/AppButton";
import { Button } from "@/components/ui/button";
import PDFViewer from "./pdf-viewer/PDFViewer";
import { PDFDialogViewer } from "./pdf-viewer/PDFDialogViewer";
import { FileItem, FolderItem } from "./Type";
import { useEffect, useState } from "react";
import { ImageDialogViewer } from "./image-viewer/ImageDialogViewer";
import { UnsupportedFileDialogViewer } from "./UnsupportedFileDialogViewer";
import MainViewer from "@/pages/bim-viewer/MainViewer";
import {IFCViewerDialog } from "./IFCViewerDialog";


const IMAGE_EXTENSIONS = [
  "jpg", "jpeg", "png", "gif", "bmp", "webp", "svg",
  "ico", "tif", "tiff", "heic", "heif", "apng", "avif", "jfif",
  "raw", "cr2", "nef", "psd"
];

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
  setFileViewer: React.Dispatch<React.SetStateAction<boolean | null>>;
  fileViewer: boolean | null;
}

export const MoveDeleteViewDialogs: React.FC<Props> = ({
  selectedFile,
  deleteFile,
  setDeleteFile,
  onConfirmDelete,
  moveFile,
  setFileViewer,
  fileViewer,
  setMoveFile,
  availableFolders,
  selectedFolderId,
  setSelectedFolderId,
  onMoveToFolder,
}) => {


  const [fileUrl, setFileUrl] = useState();
  const [fileName, setFileName] = useState();
  const [fileType, setFileType] = useState();



  useEffect(() => {
    if (selectedFile) {
      const url = selectedFile.media.url;
      setFileUrl(url);
      setFileName(selectedFile.name);
      setFileType(selectedFile.type
      )
    }
  }, [selectedFile])


  const isPdf = fileType === "pdf";
  const isImage = fileType && IMAGE_EXTENSIONS.includes(fileType);
  const isIfc = fileType ==="ifc";



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


      {/* PDF Viewer */}
      {
        isPdf &&
        <PDFDialogViewer
          open={fileViewer}
          onClose={() => setFileViewer(null)}
          url={fileUrl}
          fileName={fileName}
        />
      }

      {/* Image viewer */}
      {
        isImage &&
        <ImageDialogViewer
          open={fileViewer}
          onClose={() => setFileViewer(null)}
          url={fileUrl}
          fileName={fileName}
        />
      }

       {/* Show IFC */}
      {
        isIfc && (
          <IFCViewerDialog
            open={fileViewer}
            onClose={() => setFileViewer(false)}
            selectedFile={selectedFile}
          />
        )
      }


      {/* Fallback: file không hỗ trợ preview */}
      {fileViewer && !isPdf && !isImage && !isIfc &&(
        <UnsupportedFileDialogViewer
          open={fileViewer}
          onClose={() => setFileViewer(null)}
          fileUrl={fileUrl}
          fileName={fileName}
        />
      )}

     


    </>
  );
};
