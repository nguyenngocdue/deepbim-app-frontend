import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CloudToolbar from "./components/CloudToolbar";
import FolderTree from "./components/FolderTree";

interface FileItem {
  id: number;
  name: string;
  type?: string;
  media?: {
    url: string;
    extension: string;
  };
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

const CloudManagerment = () => {
  const [selectedFolder, setSelectedFolder] = useState<any>(null);
  const [folderFiles, setFolderFiles] = useState<FileItem[]>([]);

  const handleSelect = (node: any, files: FileItem[]) => {
    setSelectedFolder(node);
    setFolderFiles(files);
  };

const renderContent = () => {
  if (!selectedFolder) return null;

  return (
    <div className="space-y-2">
      {/* Header của bảng */}
      <div className="grid grid-cols-5 gap-2 px-2 text-sm text-gray-400 border-b border-gray-700">
        <span>Icon</span>
        <span className="col-span-2">Name</span>
        <span>Extension</span>
        <span>Action</span>
      </div>

      {/* Danh sách từng file */}
      {folderFiles.map((file) => (
        <div
          key={file.id}
          className="grid grid-cols-5 gap-2 items-center px-2 py-2 bg-gray-800 hover:bg-gray-700 rounded transition text-sm"
        >
          {/* Icon */}
          <img
            src={getIconUrlByType(file.type || '')}
            alt={file.name}
            className="w-6 h-6"
          />

          {/* Tên file */}
          <span className="col-span-2 truncate">{file.name}</span>

          {/* Phần mở rộng */}
          <span className="text-gray-400">{file.media?.extension ? `.${file.media.extension}` : '-'}</span>

          {/* Nút mở */}
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
};






  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-white px-4 py-2">
        <CloudToolbar />
      </div>

      {/* Resizable Panels */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Left Panel - Tree */}
          <Panel defaultSize={30} minSize={20} maxSize={50} className="bg-gray-900">
            <FolderTree onSelect={handleSelect} />
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize" />

          {/* Right Panel - Content */}
          <Panel>
            <div className="p-4 h-full overflow-auto">
              {selectedFolder ? renderContent() : (
                <p className="text-gray-400">
                  Chọn một thư mục từ cây bên trái để xem các tệp bên trong.
                </p>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default CloudManagerment;
