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
  // 1. Nếu chưa chọn thư mục thì không hiển thị gì
  if (!selectedFolder) return null;

  return (
    <div className="space-y-4">
      {/* 2. Lưới hiển thị danh sách file */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 pt-4">
        {/* 3. Lặp qua từng file để render */}
        {folderFiles.map((file) => (
          <div
            key={file.id} // 4. Key duy nhất cho từng phần tử
            className="bg-gray-800 p-3 rounded shadow hover:bg-gray-700 transition flex flex-col items-center text-center"
            title={file.name} // 5. Tooltip khi hover tên đầy đủ
          >
            {/* 6. Hiển thị icon theo loại file */}
            <img
              src={getIconUrlByType(file.type || "")}
              alt={file.name}
              className="w-12 h-12 mb-2"
            />

            {/* 7. Tên file (bị cắt nếu quá dài) */}
            <p className="text-sm font-medium truncate w-full">{file.name}</p>

            {/* 8. Nút mở file nếu có URL */}
            {file.media?.url && (
              <a
                href={file.media.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:underline mt-1"
              >
                Xem file
              </a>
            )}

            {/* 9. Hiển thị phần mở rộng (ví dụ: .ifc, .pdf) nếu có */}
            {file.media?.extension && (
              <p className="text-xs text-gray-400 mt-0.5">.{file.media.extension}</p>
            )}
          </div>
        ))}
      </div>
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
