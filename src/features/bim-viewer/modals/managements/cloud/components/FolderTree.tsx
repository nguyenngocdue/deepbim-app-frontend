// ✅ FolderTree.tsx - Hiển thị chỉ thư mục, trả files khi chọn folder

import { fetchWithAuth2 } from "@/api";
import { useEffect, useRef, useState } from "react";
import { Tree, TreeApi, NodeApi } from "react-arborist";

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
  subProjectId: number; // truyền vào ID sub-project
}

export default function FolderTree({ onSelect, subProjectId=7 }: FolderTreeProps) {
  const treeRef = useRef<TreeApi<TreeNode>>(null);
  const [filter, setFilter] = useState("");
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  // Load toàn bộ cây một lần duy nhất theo sub-project
  useEffect(() => {
    const fetchTree = async () => {
      try {
        const data = await fetchWithAuth2(`/folders/sub-project/${subProjectId}/tree`);
        const mapped = mapFolderTreeOnly(data.data);
        setTreeData(mapped);
      } catch (error) {
        console.error("Failed to fetch tree:", error);
      }
    };
    fetchTree();
  }, [subProjectId]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilter(value);
    if (treeRef.current) {
      treeRef.current.filter(value.toLowerCase(), "name");
    }
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="p-2 bg-gray-900">
        <input
          type="text"
          value={filter}
          onChange={handleFilterChange}
          placeholder="Tìm kiếm thư mục hoặc tập tin..."
          className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex-1 overflow-auto bg-gray-900">
        <Tree<TreeNode>
  ref={treeRef}
  data={treeData}
  openByDefault={false}
  childrenAccessor="children"
  rowHeight={32}
  indent={24}
  disableMultiSelection
  termFilter={(node, term) => node.data.name.toLowerCase().includes(term)}
  onSelect={(nodes) => {
    const node = nodes[0]; // Single selection
    if (node) onSelect?.(node, node.data.files || []);
  }}
  renderNode={({ node, style }) => (
    <div
      style={style}
      className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 px-2 py-1 rounded"
    >
      <img
        src={getIconUrl("folder", node.isOpen)}
        alt="icon"
        className="w-5 h-5 object-contain"
      />
      <span >{node.data.name}</span>
    </div>
  )}
/>

      </div>
    </div>
  );
}

function mapFolderTreeOnly(nodes: any[]): TreeNode[] {
  if (!Array.isArray(nodes)) return [];
  return nodes.map((node) => {
    return {
      id: String(node.id),
      name: node.name,
      isFolder: true,
      isLeaf: false,
      files: Array.isArray(node.files)
        ? node.files.map((file: any) => ({
            id: file.id,
            name: file.name,
            type: file.media?.extension,
            media: file.media ? {
              url: file.media.url,
              extension: file.media.extension,
            } : undefined,
          }))
        : [],
      children: mapFolderTreeOnly(node.children || []),
    };
  });
}

function getIconUrl(type: string, isOpen = false) {
  switch (type) {
    case "folder":
      return isOpen
        ? "https://img.icons8.com/color/48/opened-folder.png"
        : "https://img.icons8.com/color/48/folder-invoices--v1.png";
    default:
      return "https://img.icons8.com/color/48/file.png";
  }
}
