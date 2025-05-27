import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NodeApi } from "react-arborist";
import { TreeNode } from "./FolderTree";
import { MoreHorizontal } from "lucide-react";

export function FolderTreeContextMenu({
  node, onRename, onDelete, onClose,
}: {
  node: NodeApi<TreeNode>;
  onRename: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  return (
    <div className="absolute top-2 right-2">
      <DropdownMenu onOpenChange={(open) => { if (!open) onClose(); }}>
        <DropdownMenuTrigger asChild>
          <button className="hover:text-primary">
            <MoreHorizontal size={18} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onRename}>Rename</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive" onClick={onDelete}>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
