import { Tree, TreeApi, NodeApi } from "react-arborist";

export interface CloudToolbarProps {
  selectedFolder: NodeApi | null; 
  entityId: number;
  onCreated: () => void;
  oonUploaded?: (uploadedFile: FileItem) => void; 
}

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