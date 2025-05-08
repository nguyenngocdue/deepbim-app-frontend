// ✅ FolderTree.tsx - Đã sửa để dùng lazy loading với onToggle (vì loadData không phải prop hợp lệ)

import { useRef, useState } from "react";
import { Tree, TreeApi, NodeApi } from "react-arborist";

interface TreeNode {
  id: string;
  name: string;
  type?: string;
  isFolder?: boolean;
  isLeaf?: boolean;
  children?: TreeNode[] | undefined;
}

const initialData: TreeNode[] = [
  {
    id: "documents",
    name: "Documents",
    isFolder: true,
    children: [
      {
        id: "company",
        name: "Company",
        isFolder: true,
        children: undefined,
      },
    ],
  },
  { id: "bookmarked", name: "Bookmarked", isLeaf: true },
  { id: "history", name: "History", isLeaf: true },
  { id: "trash", name: "Trash", isLeaf: true },
];

interface FolderTreeProps {
  onSelect?: (node: NodeApi<TreeNode>) => void;
}

export default function FolderTree({ onSelect }: FolderTreeProps) {
  const treeRef = useRef<TreeApi<TreeNode>>(null);
  const [filter, setFilter] = useState("");

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFilter(value);
    if (treeRef.current) {
      treeRef.current.filter(value.toLowerCase(), "name");
    }
  };

  const loadData = async (node: NodeApi<TreeNode>): Promise<TreeNode[]> => {
    console.log("▶️ Loading children for:", node.id);
    await delay(1000);
    if (node.id === "company") {
      return [
        { id: "invoice", name: "Invoice", type: "pdf", isLeaf: true },
        { id: "meeting", name: "Meeting notes", type: "note", isLeaf: true },
        { id: "tasks", name: "Tasks list", type: "note", isLeaf: true },
        { id: "equipment", name: "Equipment", type: "pdf", isLeaf: true },
        { id: "video", name: "Video conference", type: "video", isLeaf: true },
        { id: "personal", name: "Personal", isFolder: true, children: undefined },
        { id: "photo", name: "Group photo", type: "image", isLeaf: true },
      ];
    } else if (node.id === "personal") {
      return [
        { id: "resume", name: "Resume", type: "pdf", isLeaf: true },
        { id: "portfolio", name: "Portfolio", type: "pdf", isLeaf: true },
      ];
    }
    return [];
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
        <Tree
          ref={treeRef}
          data={initialData}
          openByDefault={false}
          childrenAccessor="children"
          rowHeight={32}
          indent={24}
          disableMultiSelection
          termFilter={(node, term) => node.data.name.toLowerCase().includes(term)}
          onToggle={async (id) => {
            const node = treeRef.current?.get(id);
            if (node?.isInternal && !node.hasLoaded && node.data.children === undefined) {
              const children = await loadData(node);
              node.append(children);
            }
          }}
          renderNode={({ node, style }) => {
            console.log("Rendering node:", node.data.name);
            return (
              <div
                style={style}
                className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 px-2 py-1 rounded"
                onClick={() => onSelect?.(node)}
              >
                <img
                  src={getIconUrl(node)}
                  alt="icon"
                  className="w-5 h-5 object-contain"
                />
                <span>{node.data.name}</span>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}

function getIconUrl(node: NodeApi<TreeNode>) {
  const type = node.isInternal ? "folder" : node.data.type;
  switch (type) {
    case "pdf": return "https://img.icons8.com/color/48/pdf.png";
    case "note": return "https://img.icons8.com/color/48/document--v1.png";
    case "image": return "https://img.icons8.com/color/48/image.png";
    case "video": return "https://img.icons8.com/color/48/video.png";
    case "folder": return node.isOpen
      ? "https://img.icons8.com/color/48/opened-folder.png"
      : "https://img.icons8.com/color/48/folder-invoices--v1.png";
    default: return "https://img.icons8.com/color/48/file.png";
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
