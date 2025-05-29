import React, { useState, useEffect } from "react";
import { deleteFileById, moveFileToFolder } from "@/apis/file-api";
import { getFoldersBySubProjectId } from "@/apis/folder-api";
import { toast } from "sonner";
import { FileItem, FolderItem, FolderContentProps } from "./Type";
import { FileGridView } from "./FileGridView";
import { FileListView } from "./FileListView";
import { MoveDeleteDialogs } from "./MoveDeleteDialogs";

export const FolderContent: React.FC<FolderContentProps> = ({ files, view, entityId, currentFolderId }) => {
  const [fileList, setFileList] = useState<FileItem[]>(files);
  const [deleteFile, setDeleteFile] = useState<FileItem | null>(null);
  const [fileViewer, setFileViewer] = useState<FileItem | null>(null);
  const [moveFile, setMoveFile] = useState<FileItem | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<number | null>(null);
  const [availableFolders, setAvailableFolders] = useState<FolderItem[]>([]);

  useEffect(() => setFileList(files), [files]);

  useEffect(() => {
    const fetchFolders = async () => {
      const response = await getFoldersBySubProjectId(entityId);
      setAvailableFolders(response.data);
    };
    fetchFolders();
  }, [entityId]);

  const triggerDialog = (setter: React.Dispatch<React.SetStateAction<FileItem | null>>, file: FileItem) => {
    setter(null);
    requestAnimationFrame(() => setter(file));
  };

  const onConfirmDelete = async () => {
    if (!deleteFile) return;
    try {
      await deleteFileById(deleteFile.id);
      toast.success("File deleted successfully");
      setFileList((prev) => prev.filter((f) => f.id !== deleteFile.id));
      setDeleteFile(null);
    } catch {
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
    } catch {
      toast.error("Failed to move file");
    }
  };

  const filteredFiles = fileList.filter((file) => file.folder_id === currentFolderId);

  return (
    <>
      {view === "grid" ? (
        <FileGridView files={filteredFiles} triggerDialog={triggerDialog} setMoveFile={setMoveFile} setDeleteFile={setDeleteFile} setFileViewer={setFileViewer}/>
      ) : (
        <FileListView files={filteredFiles} triggerDialog={triggerDialog} setMoveFile={setMoveFile} setDeleteFile={setDeleteFile} setFileViewer={setFileViewer}/>
      )}

      <MoveDeleteDialogs
        deleteFile={deleteFile}
        setDeleteFile={setDeleteFile}
        onConfirmDelete={onConfirmDelete}
        moveFile={moveFile}
        setMoveFile={setMoveFile}
        fileViewer={fileViewer}
        setFileViewer={setFileViewer}
        availableFolders={availableFolders}
        selectedFolderId={selectedFolderId}
        setSelectedFolderId={setSelectedFolderId}
        onMoveToFolder={onMoveToFolder}
      />
    </>
  );
};
