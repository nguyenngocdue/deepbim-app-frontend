import React from "react";
import { FolderItem } from "./Type";


interface FolderSelectorProps {
  folders: FolderItem[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export const FolderSelector: React.FC<FolderSelectorProps> = ({
  folders,
  selectedId,
  onSelect,
}) => {

  const foldersWithNone = [
  { id: null, name: "(No folder)" },
  ...folders
];


  return (
    <div className="flex flex-col space-y-2 max-h-64 overflow-y-auto">
      {foldersWithNone.map((folder) => (
        <button
          key={folder.id}
          className={`w-full text-left px-3 py-2 rounded-md border
            ${selectedId === folder.id
              ? 'bg-blue-500/20 border-blue-500 text-blue-300'
              : 'hover:bg-white/10 border-neutral-700 text-neutral-200'
            } transition-colors`}
          onClick={() => onSelect(folder.id)}
        >
          {folder.name}
        </button>
      ))}
    </div>
  );
};
