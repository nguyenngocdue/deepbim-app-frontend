import { useEffect, useRef, useState } from "react";
import { Tree, TreeApi, NodeApi } from "react-arborist";
import { getFolderTree, renameFolder, deleteFolder, moveFolderToFolder } from "@/apis/folder-api";
import { FolderTreeHeader } from "./FolderTreeHeader";
import { FolderTreeNode } from "./FolderTreeNode";
import { DialogTemplate } from "@/components/model-table/DialogTemplate";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { filterTree, findNodeById, mapFolderTreeOnly } from "./FolderTreeUtils";
import AppButton from "@/components/bim-viewer/common/AppButton";
import { FolderSelector } from "./FolderSelector";
import { useFoldersBySubProjectId } from "../hooks/useFoldersBySubProjectId";
import { FormActionButtons } from "@/components/bim-viewer/common/FormActionButtons";
import { TiArrowMoveOutline } from "react-icons/ti";
import { CLASS_NAME_DEFAULT } from "@/utils/class";
import { LoadingState } from "@/components/common/LoadingState";

const LOCAL_STORAGE_KEY = "lastSelectedFolderId";

interface FolderTreeProps {
  onSelect?: (node: NodeApi<any> | null, files: any[]) => void;
  entityId: number;
  refreshTrigger?: any;
}

export default function FolderTree({ onSelect, entityId, refreshTrigger }: FolderTreeProps) {
  const treeRef = useRef<TreeApi<any>>(null);

  const [treeData, setTreeData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const [filter, setFilter] = useState("");
  const [renameNode, setRenameNode] = useState<NodeApi<any> | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteNode, setDeleteNode] = useState<NodeApi<any> | null>(null);

  const [moveNode, setMoveNode] = useState<NodeApi<any> | null>(null);
  const [openMoveFolder, setOpenMoveFolder] = useState(false);
  const [selectedDestinationId, setSelectedDestinationId] = useState<number | null>(null);


  const { folders, loading, error } = useFoldersBySubProjectId(entityId);


  const [storedId, setStoredId] = useState(() => localStorage.getItem(LOCAL_STORAGE_KEY));

  const fetchTree = async () => {
    const res = await getFolderTree(entityId);
    const mapped = mapFolderTreeOnly(res.data);
    setOriginalData(mapped);
    setTreeData(mapped);

    if (storedId) {
      const found = findNodeById(mapped, storedId);
      if (found) {
        setSelectedNodeId(storedId);
        setTimeout(() => {
          const api = treeRef.current;
          if (api) {
            const node = api.get(storedId);
            if (node) {
              api.select(node);
              onSelect?.(node, found.files || []);
            }
          }
        }, 0);
      } else {
        setSelectedNodeId(null);
        onSelect?.(null, []);
      }
    }
  };

  useEffect(() => {
    fetchTree();
  }, [entityId, refreshTrigger]);
  

  const handleSelect = (nodes) => {
    const node = nodes[0];
    if (node) {
      setSelectedNodeId(node.id);
      setStoredId(node.id);
      localStorage.setItem(LOCAL_STORAGE_KEY, node.id);

      const latestNode = findNodeById(treeData, node.id);
      onSelect?.(node, latestNode?.files || []);
    } else {
      setSelectedNodeId(null);
      setStoredId(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      onSelect?.(null, []);
    }
  };


  const handleRenameSubmit = async () => {
    if (!renameNode || !renameValue.trim()) return;
    await renameFolder(Number(renameNode.id), renameValue.trim());
    toast.success("Renamed successfully");
    setRenameNode(null);
    await fetchTree();
  };

  const handleDeleteSubmit = async () => {
    if (!deleteNode) return;
    await deleteFolder(Number(deleteNode.id));
    toast.success(`Deleted folder "${deleteNode.data.name}"`);
    setDeleteNode(null);
    await fetchTree();
  };


  const handleMoveSubmit = async () => {
  try {
    await moveFolderToFolder(Number(moveNode.id), { 'parent_id': selectedDestinationId});
    toast.success(`Moved "${moveNode.data.name}" successfully`);
    setOpenMoveFolder(false);
    setMoveNode(null);
    setSelectedDestinationId(null);
    await fetchTree();
  } catch (error) {
    toast.error("Failed to move folder");
  }
};

  return (
    <div className="flex flex-col h-full">
      <FolderTreeHeader filter={filter} onFilterChange={setFilter} />

      <div className="flex-1 overflow-auto p-4">

        {
          originalData.length > 0 ? 
            <Tree
              ref={treeRef}
              data={filter ? filterTree(originalData, filter) : treeData}
              childrenAccessor="children"
              indent={20}
              rowHeight={35}
              height={800}
              onSelect={handleSelect}
            >
              {(props) => (
                <FolderTreeNode
                  {...props}
                  isSelected={props.node.id === selectedNodeId}
                  onRename={() => {
                    setRenameValue(props.node.data.name);
                    setRenameNode(props.node);
                  }}
                  onDelete={() => setDeleteNode(props.node)}

                  onMoveToFolder={() => {
                      setMoveNode(props.node);
                      setOpenMoveFolder(true);
                    }}

                />
              )}
            </Tree>
            :
            <LoadingState/>
        }
      </div>

      {/* Movel folder to folder */}
      <DialogTemplate
        open={openMoveFolder}
        onClose={() => setOpenMoveFolder(false)}
        title="Move Folder"
        iconType="move"
        description={`Select destination folder for "${moveNode?.data.name}"`}
        footer={
          <>
          <FormActionButtons
                  onCancel={() => setOpenMoveFolder(false)}
                  onCancelText="Cancel"
                  onApplyText="Apply"
                  onApply={handleMoveSubmit}  
                  disabled={!selectedDestinationId}
                  loading={loading}
                  onApplyIcon={<TiArrowMoveOutline  />}
                  classNameDelete={CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_DELETE}
                  classNameApply={CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_CREATE}
                />
          </>
        }
      >
        <FolderSelector
          folders={folders}
          selectedId={selectedDestinationId}
          onSelect={setSelectedDestinationId}
          excludeId={moveNode?.id}
        />
      </DialogTemplate>



      <DialogTemplate
        open={!!renameNode}
        onClose={() => setRenameNode(null)}
        title="Rename Folder"
        description={`Rename folder "${renameNode?.data.name}"`}
        footer={
          <>
            <AppButton onClick={() => setRenameNode(null)} falseName="Cancel" />
            <AppButton
              className="bg-blue-800"
              onClick={handleRenameSubmit}
              disabled={!renameValue.trim()}
              falseName="Save"
            />
          </>
        }
      >
        <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
      </DialogTemplate>

      <DialogTemplate
        open={!!deleteNode}
        onClose={() => setDeleteNode(null)}
        title="Delete Folder"
        description={`Are you sure you want to delete folder "${deleteNode?.data.name}"?`}
        footer={
          <>
            <AppButton onClick={() => setDeleteNode(null)} falseName="Cancel" />
            <AppButton className="bg-red-700" onClick={handleDeleteSubmit} falseName="Delete" />
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          All subfolders and files inside will be affected.
        </p>
      </DialogTemplate>
    </div>
  );
}
