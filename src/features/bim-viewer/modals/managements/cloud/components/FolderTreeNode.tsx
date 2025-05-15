import { NodeApi } from "react-arborist";
import { TreeNode } from "./FolderTree";
import {
  FiFolder,
  FiChevronDown,
  FiChevronRight,
  FiMoreVertical,
} from "react-icons/fi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function FolderTreeNode({
  node,
  style,
  isSelected,
  onRename,
  onDelete,
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
      className={`group flex items-center justify-between px-2 py-1 rounded-md transition-colors cursor-pointer
        ${isSelected ? "bg-blue-500/20 text-blue-400" : "hover:bg-white/5"}
      `}
      onClick={() => node.toggle()}
    >
      <span className="flex items-center gap-2 px-2 text-sm font-medium">
        <div className="w-6 h-6 bg-neutral-800 rounded-md flex items-center justify-center">
          <FiFolder
            className={hasChildren ? "text-yellow-400" : "text-neutral-400"}
            size={16}
          />
        </div>
        <span className="truncate">{node.data.name}</span>
      </span>

      <div className="flex items-center gap-2">
        {hasChildren &&
          (isOpen ? (
            <FiChevronDown className="text-neutral-500" size={16} />
          ) : (
            <FiChevronRight className="text-neutral-500" size={16} />
          ))}

        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="hover:bg-white/10 p-1 rounded-md">
                <FiMoreVertical size={14} className="text-neutral-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-neutral-800 border border-neutral-700 shadow-lg">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onRename();
                }}
              >
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="text-red-500"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
