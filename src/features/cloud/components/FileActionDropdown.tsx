import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Move, Trash2 } from "lucide-react";
import { FaEye, FaDownload } from "react-icons/fa6";

export interface FileActionDropdownProps {
  file: any; // Nên khai báo kiểu cụ thể nếu bạn có FileItem type
  onMove?: (file: any) => void;
  onDelete?: (file: any) => void;
  onView?: (file: any) => void;
  onDownload?: (file: any) => void;
}

export function FileActionDropdown({
  file,
  onMove,
  onDelete,
  onView,
  onDownload,
}: FileActionDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {onMove && (
          <DropdownMenuItem onClick={() => onMove(file)}>
            <Move className="mr-2 h-4 w-4" /> Move to Folder
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem onClick={() => onDelete(file)} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        )}
        {onView && (
          <DropdownMenuItem onClick={() => onView(file)}>
            <FaEye className="mr-2 h-4 w-4 text-green-600" /> View
          </DropdownMenuItem>
        )}
        {onDownload && (
          <DropdownMenuItem onClick={() => onDownload(file)}>
            <FaDownload className="mr-2 h-4 w-4 text-blue-600" /> Download File
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
