import { useEffect, useRef, useState } from "react";
import { Tree, TreeApi, NodeApi } from "react-arborist";
import { FiFolder, FiChevronRight, FiChevronDown, FiSearch } from "react-icons/fi";
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

interface FolderTreeProps {
  onSelect: (node: NodeApi<TreeNode> | null, files: FileItem[]) => void;
  entityId: number;
  refreshTrigger: number;
}

const LOCAL_STORAGE_KEY = "lastSelectedFolderId";

export default function FolderTree({ onSelect, entityId, refreshTrigger }: FolderTreeProps) {
  const treeRef = useRef<TreeApi<TreeNode>>(null);
  const [filter, setFilter] = useState("");
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [originalData, setOriginalData] = useState<TreeNode[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await getFolderTree(entityId);
        const mapped = mapFolderTreeOnly(res.data);
        setOriginalData(mapped);
        setTreeData(mapped);

        const lastId = localStorage.getItem(LOCAL_STORAGE_KEY);
        const defaultId = lastId && findNodeById(mapped, lastId) ? lastId : mapped[0]?.id;
        if (!defaultId) return;

        setSelectedNodeId(defaultId);

        const latestNode = findNodeById(mapped, defaultId);
        if (latestNode) {
          const fakeNode = {
            id: latestNode.id,
            data: latestNode,
            isLeaf: false,
            isSelected: true,
            isOpen: true,
            level: 0,
            parent: null,
            hasChildren: !!latestNode.children?.length,
            children: () => latestNode.children || [],
          } as unknown as NodeApi<TreeNode>;

          onSelect?.(fakeNode, latestNode.files || []);
        }
      } catch (err) {
        console.error("Failed to load folder tree:", err);
      }
    };

    fetchTree();
  }, [entityId, refreshTrigger]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value.toLowerCase();
    setFilter(keyword);

    if (!keyword) {
      setTreeData(originalData);
      return;
    }

    const filtered = filterTree(originalData, keyword);
    setTreeData(filtered);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-700">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="text-gray-400" />
          </span>
          <input
            type="text"
            value={filter}
            onChange={handleFilterChange}
            placeholder="Search folders or files..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <Tree
          ref={treeRef}
          data={treeData}
          openByDefault
          childrenAccessor="children"
          indent={20}
          rowHeight={48}
          overscanCount={5}
          paddingTop={10}
          paddingBottom={10}
          padding={10}
          height={800}
          onSelect={async (nodes) => {
            const node = nodes[0];
            if (node) {
              setSelectedNodeId(node.id);
              localStorage.setItem(LOCAL_STORAGE_KEY, node.id);

              // ✅ Gọi lại fetchTree() để luôn lấy data mới nhất khi click folder
              try {
                const res = await getFolderTree(entityId);
                const mapped = mapFolderTreeOnly(res.data);
                setOriginalData(mapped);
                setTreeData(mapped);

                const latestNode = findNodeById(mapped, node.id);
                if (latestNode) {
                  onSelect?.(node, latestNode.files || []);
                } else {
                  onSelect?.(node, []);
                }
              } catch (err) {
                console.error("Failed to refresh tree on select:", err);
              }
            } else {
              setSelectedNodeId(null);
              onSelect?.(null, []);
            }
          }}

        >
          {(props) => (
            <NodeRenderer {...props} isSelected={props.node.id === selectedNodeId} />
          )}
        </Tree>
      </div>
    </div>
  );
}

function NodeRenderer({
  node,
  style,
  dragHandle,
  isSelected,
}: {
  node: NodeApi<TreeNode>;
  style: React.CSSProperties;
  dragHandle?: (el: HTMLDivElement | null) => void;
  isSelected?: boolean;
}) {
  const isOpen = node.isOpen;
  const hasChildren = node.data.children && node.data.children.length > 0;

  return (
    <div
      ref={dragHandle}
      style={style}
      className={`flex items-center justify-between px-4 py-2 rounded-lg transition-all duration-200 ease-in-out shadow-sm hover:shadow-md ${isSelected ? "bg-blue-600 text-white" : "hover:bg-gray-700"
        }`}
      onClick={() => node.toggle()}
    >
      <span className="flex items-center gap-2 text-base font-medium px-2">
        <FiFolder className={hasChildren ? "text-yellow-400" : "text-gray-400"} />
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

function filterTree(nodes: TreeNode[], keyword: string): TreeNode[] {
  return nodes
    .map((node) => {
      const childMatches = filterTree(node.children || [], keyword);
      const fileMatches = (node.files || []).some((file) =>
        file.name.toLowerCase().includes(keyword)
      );
      const folderMatch = node.name.toLowerCase().includes(keyword);

      if (folderMatch || fileMatches || childMatches.length > 0) {
        return { ...node, children: childMatches };
      }
      return null;
    })
    .filter(Boolean) as TreeNode[];
}

function findNodeById(nodes: TreeNode[], id: string): TreeNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    const child = findNodeById(node.children || [], id);
    if (child) return child;
  }
  return undefined;
}
