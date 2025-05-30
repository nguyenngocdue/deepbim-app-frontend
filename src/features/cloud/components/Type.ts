
export interface FolderItem {
  id: number;
  name: string;
}

export type CloudToolbarProps = {
  selectedFolder: any;
  entityId: number;
  onCreated?: () => void;
  onUploaded?: () => void;
  setView: (view: "list" | "grid" |"list") => void;
  view: string;
  setLoadingUploadFile?:(loadingUploadFile: boolean) => void
};

export interface FolderData {
  name: string;
  sub_project_id: number;
  parent_id: number;
}


export interface FolderTreeProps {
  onSelect?: (node: TreeNode, files: FileItem[]) => void;
  entityId: number; //sub_project_id
  onCreated: () => void;
  refreshTrigger: () => void;
}

export interface FolderDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FolderData) => void;
  selectedFolder: { data: { id: number } };
  entityId: number;
}


export interface FileItem {
  id: number;
  name: string;
  type?: string;
  folder_id?: number;
  media?: {
    url: string;
    extension: string;
  };
  updated_at: string;
  creator: {
    user_name: string;
  };
}


export interface FileListViewProps{
  files: FileItem[];
  triggerDialog: (setter: React.Dispatch<React.SetStateAction<FileItem | null>>, file: FileItem) => void;
  setMoveFile: React.Dispatch<React.SetStateAction<FileItem | null>>;
  setDeleteFile: React.Dispatch<React.SetStateAction<FileItem | null>>;
  setFileViewer: React.Dispatch<React.SetStateAction<FileItem | null>>;
};

export interface FolderItem {
  id: number;
  name: string;
}

export interface FolderContentProps {
  files: FileItem[];
  view: "list" | "grid";
  entityId: number;
  currentFolderId: number;
}
