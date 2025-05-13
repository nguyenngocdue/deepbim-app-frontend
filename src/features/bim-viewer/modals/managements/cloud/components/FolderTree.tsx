// components/FolderTree.tsx

import { fetchWithAuth2 } from "@/api";
import { useEffect, useRef, useState } from "react";
import { Tree, TreeApi, NodeApi } from "react-arborist";
import { FiFolder, FiFile, FiChevronRight, FiChevronDown } from "react-icons/fi";

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

interface FolderTreeProps {
  onSelect?: (node: NodeApi<TreeNode>, files: FileItem[]) => void;
  subProjectId: number;
}

export default function FolderTree({ onSelect, subProjectId = 15 }: FolderTreeProps) {
  const treeRef = useRef<TreeApi<TreeNode>>(null);
  const [filter, setFilter] = useState("");
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await fetchWithAuth2(`/folders/sub-project/${subProjectId}/tree?project_id=1`);
        const mapped = mapFolderTreeOnly(res.data);
        setTreeData(mapped);
      } catch (err) {
        console.error("Failed to load tree:", err);
      }
    };
    fetchTree();
  }, [subProjectId]);

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
            if (node) onSelect?.(node, node.data.files || []);
          }}
        >
          {NodeRenderer}
        </Tree>
      </div>
    </div>
  );
}

function NodeRenderer({ node, style, dragHandle }: { node: NodeApi<TreeNode>; style: React.CSSProperties; dragHandle?: (el: HTMLDivElement | null) => void }) {
  const isOpen = node.isOpen;
  const hasChildren = node.hasChildren;
  const isFolder = node.data.children && node.data.children.length > 0;

  return (
    <div
      ref={dragHandle}
      style={style}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out shadow-sm hover:shadow-md ${node.isSelected ? "bg-blue-600 text-white" : "hover:bg-gray-700"}`}
      onClick={() => node.toggle()}
    >
      <span className="text-xl">
        {hasChildren ? (isOpen ? <FiChevronDown /> : <FiChevronRight />) : <span className="w-4" />}
      </span>
      <span className="flex items-center gap-2 text-base font-medium">
        {isFolder ? <FiFolder className="text-yellow-400" /> : <FiFolder className="text-gray-400" />}
        <span>{node.data.name}</span>
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