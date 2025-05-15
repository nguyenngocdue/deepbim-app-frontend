import { useEffect, useRef, useState } from "react";
import { Tree, TreeApi, NodeApi } from "react-arborist";
import { getFolderTree, renameFolder } from "@/apis/folder-api";
import { FolderTreeHeader } from "./FolderTreeHeader";
import { FolderTreeNode } from "./FolderTreeNode";
import { DialogTemplate } from "@/components/model-table/DialogTemplate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { filterTree, findNodeById, mapFolderTreeOnly } from "./FolderTreeUtils";
import AppButton from "@/components/bim-viewer/common/AppButton";

export default function FolderTree({ onSelect, entityId, refreshTrigger }) {
  const treeRef = useRef<TreeApi<any>>(null);
  const [treeData, setTreeData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [filter, setFilter] = useState("");

  const [renameNode, setRenameNode] = useState<NodeApi<any> | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const fetchTree = async () => {
    const res = await getFolderTree(entityId);
    const mapped = mapFolderTreeOnly(res.data);
    setOriginalData(mapped);
    setTreeData(mapped);
  };

  useEffect(() => { fetchTree(); }, [entityId, refreshTrigger]);

  const handleSelect = async (nodes) => {
    const node = nodes[0];
    if (node) {
      setSelectedNodeId(node.id);
      const latestNode = findNodeById(treeData, node.id);
      onSelect?.(node, latestNode?.files || []);
    } else {
      setSelectedNodeId(null);
      onSelect?.(null, []);
    }
  };

  const handleRenameSubmit = async () => {
    if (!renameNode) return;
    await renameFolder(Number(renameNode.id), renameValue);
    toast.success("Renamed successfully");
    setRenameNode(null);
    fetchTree();
  };

  return (
    <div className="flex flex-col h-full">
      <FolderTreeHeader filter={filter} onFilterChange={setFilter} />

      <div className="flex-1 overflow-auto p-4">
        <Tree
          ref={treeRef}
          data={filter ? filterTree(originalData, filter) : treeData}
          childrenAccessor="children"
          indent={20}
          rowHeight={48}
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
              onDelete={() => toast.info("Delete demo")}
            />
          )}
        </Tree>
      </div>

      <DialogTemplate
        open={!!renameNode}
        onClose={() => setRenameNode(null)}
        title="Rename Folder"
        description={`Rename folder "${renameNode?.data.name}"`}
        footer={
          <>
            <AppButton className="" onClick={() => setRenameNode(null)} falseName="Cancel"/>
            <AppButton className="bg-blue-800" onClick={handleRenameSubmit} disabled={!renameValue.trim()} falseName="Save"/>
          </>
        }
      >
        <Input value={renameValue} onChange={(e) => setRenameValue(e.target.value)} />
      </DialogTemplate>
    </div>
  );
}
