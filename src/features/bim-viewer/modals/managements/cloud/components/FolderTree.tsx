// components/FolderTree.tsx

import { fetchWithAuth2 } from "@/api";
import { useEffect, useRef, useState } from "react";
import { Tree, TreeApi, NodeApi } from "react-arborist";
import { FiFolder, FiChevronRight, FiChevronDown } from "react-icons/fi";
import { FolderTreeProps } from "./Type";
import { getFolderTree } from "@/apis/folder-api";

interface MediaInfo {
  url: string;
  extension: string;
}

interface FileItem {
  id: number;
  name: string;
  type?: string;
  media?: MediaInfo;
}

interface TreeNode {
  id: string;
  name: string;
  isFolder: true;
  isLeaf: false;
  children?: TreeNode[];
  files?: FileItem[];
}

const LOCAL_STORAGE_KEY = "lastSelectedFolderId";

export default function FolderTree({ onSelect, entityId, refreshTrigger }: FolderTreeProps) {
  const treeRef = useRef<TreeApi<TreeNode>>(null);
  const [filter, setFilter] = useState("");
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await getFolderTree(entityId);
        const mapped = mapFolderTreeOnly(res.data);
        setTreeData(mapped);

        const lastId = localStorage.getItem(LOCAL_STORAGE_KEY);
        const firstOrStored = lastId && findNodeById(mapped, lastId) ? lastId : mapped[0]?.id;

        if (firstOrStored) {
          setSelectedNodeId(firstOrStored);
          setTimeout(() => {
            const tree = treeRef.current;
            if (tree) {
              const node = tree.getNode(firstOrStored);
              if (node) {
                tree.select(node);
                onSelect?.(node, node.data.files || []);
              }
            }
          }, 50);
        }
      } catch (err) {
        console.error("Failed to load tree:", err);
      }
    };
    fetchTree();
  }, [entityId, refreshTrigger]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFilter(val);
    treeRef.current?.filter(val.toLowerCase(), "name");
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white rounded-xl shadow-2xl overflow-hidden">
      <div className="p-3 bg-gray-800 border-b border-gray-700">
        <input
          type="text"
          value={filter}
          onChange={handleFilterChange}
          placeholder="🔍 Search folders..."
          className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Tree
          ref={treeRef}
          data={treeData}
          openByDefault={true}
          childrenAccessor="children"
          indent={20}
          rowHeight={48}
          overscanCount={5}
          paddingTop={10}
          paddingBottom={10}
          padding={10}
          onSelect={(nodes) => {
            const node = nodes[0];
            if (node) {
              setSelectedNodeId(node.id);
              localStorage.setItem(LOCAL_STORAGE_KEY, node.id);
              onSelect?.(node, node.data.files || []);
            }
          }}
        >
          {(props) => (
            <NodeRenderer
              {...props}
              isSelected={props.node.id === selectedNodeId}
            />
          )}
        </Tree>
      </div>
    </div>
  );
}

function NodeRenderer({ node, style, dragHandle, isSelected }: {
  node: NodeApi<TreeNode>;
  style: React.CSSProperties;
  dragHandle?: (el: HTMLDivElement | null) => void;
  isSelected?: boolean;
}) {
  const isOpen = node.isOpen;
  const hasChildren = node.data.children && node.data.children.length > 0;
  const isFolder = true;

  return (
    <div
      ref={dragHandle}
      style={style}
      className={`flex items-center  justify-between px-4 py-2 rounded-lg transition-all duration-200 ease-in-out shadow-sm hover:shadow-md ${isSelected ? "bg-blue-600 text-white" : "hover:bg-gray-700"}`}
      onClick={() => node.toggle()}
    >
      <span className="flex items-center gap-2 text-base font-medium px-2">
        {isFolder && hasChildren ? <FiFolder className="text-yellow-400" /> : <FiFolder className="text-gray-400" />}
        <span>{node.data.name}</span>
      </span>
       <span className="text-xl">
        {hasChildren ? (isOpen ? <FiChevronDown /> : <FiChevronRight />) : <span className="w-4" />}
      </span>
    </div>
  );
}

function mapFolderTreeOnly(nodes: any[]): TreeNode[] {
  if (!Array.isArray(nodes)) return [];
  return nodes.map((node) => ({
    id: String(node.id),
    name: node.name,
    isFolder: true,
    isLeaf: false,
    files: Array.isArray(node.files)
      ? node.files.map((f: any) => ({
          id: f.id,
          name: f.name,
          type: f.media?.extension,
          media: f.media ? { url: f.media.url, extension: f.media.extension } : undefined,
        }))
      : [],
    children: mapFolderTreeOnly(node.children || []),
  }));
}

function findNodeById(nodes: TreeNode[], id: string): TreeNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    const child = findNodeById(node.children || [], id);
    if (child) return child;
  }
  return undefined;
}