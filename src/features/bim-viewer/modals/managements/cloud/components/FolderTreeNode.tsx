import { NodeApi } from "react-arborist";
import { TreeNode } from "./FolderTree";
import { FiFolder, FiChevronDown, FiChevronRight, FiMoreVertical } from "react-icons/fi";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function FolderTreeNode({
  node, style, isSelected, onRename, onDelete
}: {
  node: NodeApi<TreeNode>;
  style: React.CSSProperties;
  isSelected: boolean;
  onRename: () => void;
  onDelete: () => void;
}) {
  const isOpen = node.isOpen;
  const hasChildren = node.data.children?.length > 0;

  return (
    <div
      style={style}
      className={`group flex items-center justify-between px-4 py-2 rounded-lg transition hover:bg-gray-700 ${
        isSelected ? "bg-blue-600 text-white" : ""
      }`}
      onClick={() => node.toggle()}
    >
      <span className="flex items-center gap-2 text-base font-medium">
        <FiFolder className={hasChildren ? "text-yellow-400" : "text-gray-400"} />
        {node.data.name}
      </span>
      <div className="flex items-center gap-2">
        {hasChildren && (isOpen ? <FiChevronDown /> : <FiChevronRight />)}
        <div className="opacity-0 group-hover:opacity-100 transition">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button>
                <FiMoreVertical size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onRename(); }}>Rename</DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(); }} className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
