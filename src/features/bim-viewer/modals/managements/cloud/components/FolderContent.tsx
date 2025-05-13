import React from "react";

interface FileItem {
  id: number;
  name: string;
  type?: string;
  media?: {
    url: string;
    extension: string;
  };
}

interface FolderContentProps {
  files: FileItem[];
  view: "list" | "grid";
}

const getIconUrlByType = (type: string) => {
  switch (type) {
    case "pdf": return "https://img.icons8.com/color/96/pdf.png";
    case "note": return "https://img.icons8.com/color/96/document--v1.png";
    case "image": return "https://img.icons8.com/color/96/image.png";
    case "video": return "https://img.icons8.com/color/96/video.png";
    case "ifc": return "https://img.icons8.com/color/96/building.png";
    case "folder": return "https://img.icons8.com/color/96/folder-invoices--v1.png";
    default: return "https://img.icons8.com/color/96/file.png";
  }
};

export const FolderContent: React.FC<FolderContentProps> = ({ files, view }) => {
  if (view === "list") {
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-5 gap-2 px-2 text-sm text-gray-400 border-b border-gray-700">
          <span>Icon</span>
          <span className="col-span-2">Name</span>
          <span>Extension</span>
          <span>Action</span>
        </div>

        {files.map((file) => (
          <div
            key={file.id}
            className="grid grid-cols-5 gap-2 items-center px-2 py-2 bg-gray-800 hover:bg-gray-700 rounded transition text-sm"
          >
            <img src={getIconUrlByType(file.type || '')} alt={file.name} className="w-6 h-6" />
            <span className="col-span-2 truncate">{file.name}</span>
            <span className="text-gray-400">{file.media?.extension ? `.${file.media.extension}` : '-'}</span>
            <div>
              {file.media?.url ? (
                <a
                  href={file.media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline text-xs"
                >
                  View
                </a>
              ) : (
                <span className="text-gray-500 text-xs">No link</span>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {files.map((file) => (
        <div
          key={file.id}
          className="flex flex-col items-center bg-gray-800 rounded p-3 hover:bg-gray-700 transition"
        >
          <img src={getIconUrlByType(file.type || '')} alt={file.name} className="w-12 h-12 mb-2" />
          <p className="text-sm text-center truncate w-full">{file.name}</p>
          {file.media?.url ? (
            <a
              href={file.media.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-400 mt-1 hover:underline"
            >
              View
            </a>
          ) : (
            <span className="text-xs text-gray-500 mt-1">No link</span>
          )}
        </div>
      ))}
    </div>
  );
};
