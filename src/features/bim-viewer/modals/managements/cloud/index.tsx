// ✅ CloudManagerment.tsx - Giao diện toàn bộ đã tích hợp icon preview + layout hoàn chỉnh

import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import FolderTree from "./components/FolderTree";
import CloudToolbar from "./components/CloudToolbar";

const getIconUrlByType = (type: string) => {
  switch (type) {
    case "pdf": return "https://img.icons8.com/color/96/pdf.png";
    case "note": return "https://img.icons8.com/color/96/document--v1.png";
    case "image": return "https://img.icons8.com/color/96/image.png";
    case "video": return "https://img.icons8.com/color/96/video.png";
    case "folder": return "https://img.icons8.com/color/96/folder-invoices--v1.png";
    default: return "https://img.icons8.com/color/96/file.png";
  }
};

const CloudManagerment = () => {
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const renderContent = () => {
    if (!selectedNode) return null;
    const { type, name, isFolder } = selectedNode.data;

    const icon = getIconUrlByType(isFolder ? "folder" : type);

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <img src={icon} alt={type} className="w-16 h-16" />
          <div>
            <p className="text-xl font-semibold">{name}</p>
            <p className="text-sm text-gray-300">Loại: {isFolder ? "Thư mục" : type || "Khác"}</p>
          </div>
        </div>
        <div className="text-sm text-gray-400">
          {isFolder ? "Đây là thư mục. Bạn có thể thêm tệp vào bên trong." : "Chi tiết nội dung đang được hiển thị."}
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
            <FolderTree onSelect={setSelectedNode} />
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize" />

          {/* Right Panel - Content */}
          <Panel>
            <div className="p-4 h-full overflow-auto">
              {selectedNode ? renderContent() : (
                <p className="text-gray-400">Chọn một mục từ cây thư mục bên trái để xem nội dung.</p>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default CloudManagerment;
