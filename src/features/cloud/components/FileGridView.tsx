import { FileText, MoreHorizontal, Move, Trash2 } from "lucide-react";
import { FaEye } from "react-icons/fa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { DateTimeDisplay } from "@/components/bim-viewer/common/DateTimeDisplay";
import { FileItem } from "./types";
import { LoadingState } from "@/components/common/LoadingState";

export const FileGridView = ({
  files,
  triggerDialog,
}: {
  files: FileItem[];
  triggerDialog: (setter: React.Dispatch<React.SetStateAction<FileItem | null>>, file: FileItem) => void;
}) => {
  const getIconByType = (type?: string) => {
    const typeColors: Record<string, string> = {
      pdf: "text-red-600",
      note: "text-green-600",
      image: "text-blue-600",
      video: "text-purple-600",
      folder: "text-yellow-600",
    };
    const color = typeColors[type || ""] || "text-gray-600";
    return <FileText className={`w-6 h-6 ${color}`} />;
  };

  const renderDropdownMenu = (file: FileItem) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => triggerDialog(setMoveFile, file)}>
          <Move className="mr-2 h-4 w-4" /> Move to Folder
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => triggerDialog(setDeleteFile, file)} className="text-destructive">
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log(`View file ${file.name}`)}>
          <FaEye className="mr-2 h-4 w-4" /> View
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <div className="p-4 grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {      
        files.length > 0 ?
      files.map((file) => (
        <div
          key={file.id}
          className="relative group bg-neutral-900 border border-neutral-700 rounded-lg p-3 hover:border-blue-500 hover:shadow-md transition-all flex flex-col gap-2"
        >
          <div className="w-full aspect-square bg-neutral-800 rounded-md flex items-center justify-center">
            {getIconByType(file.type)}
          </div>
          <div className="flex-1">
            <p className="truncate text-neutral-100 text-sm font-medium group-hover:text-blue-400">{file.name}</p>
            <p className="text-xs text-neutral-500">{file.media?.extension?.toUpperCase() || "-"}</p>
          </div>
          <div className="flex justify-between items-center text-neutral-500 text-xs">
            <span className="truncate">{file.creator.user_name}</span>
            <DateTimeDisplay isoDate={file.updated_at} />
          </div>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {renderDropdownMenu(file)}
          </div>
        </div>
      )): <LoadingState/>
    }
    </div>
  );
};
