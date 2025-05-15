import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CloudToolbar from "./components/CloudToolbar";
import FolderTree from "./components/FolderTree";
import { FolderContent } from "./components/FolderContent";

interface FileItem {
  id: number;
  name: string;
  type?: string;
  media?: {
    url: string;
    extension: string;
  };
}

const CloudManagement = ({ entityId }: { entityId: number }) => {
  const [selectedFolder, setSelectedFolder] = useState<any>(null);
  const [folderFiles, setFolderFiles] = useState<FileItem[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [view, setView] = useState<"list" | "grid">("list");


  // ✅ Refresh FolderTree (trigger lại API & re-call onSelect)
  const triggerRefreshTree = () => {
    setRefreshFlag((prev) => prev + 1);
  };

  // ✅ Khi FolderTree select 1 folder → update selectedFolder & files
  const handleSelect = (node: any, files: FileItem[]) => {
    setSelectedFolder(node);
    setFolderFiles(files);
  };

  // ✅ Sau khi upload file xong → chỉ cần refresh tree để load files mới nhất
  const handleUploadedFile = () => {
    triggerRefreshTree();
  };

  return (
    <div className="h-full bg-behind text-white flex flex-col">
      {/* Toolbar */}
      <div className="px-4 py-2">
        <CloudToolbar
          selectedFolder={selectedFolder}
          entityId={entityId}
          onCreated={triggerRefreshTree}
          onUploaded={handleUploadedFile}
          setView={setView}
          view={view}
        />
      </div>

      {/* Main Panels */}
      <div className="flex-1 overflow-hidden bg-behind border-gray-600">
        <PanelGroup direction="horizontal">
          {/* Left FolderTree */}
          <Panel defaultSize={20} minSize={15} maxSize={25} className="bg-gray-900">
            <FolderTree
              onSelect={handleSelect}
              entityId={entityId}
              refreshTrigger={refreshFlag}
            />
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize" />

          {/* Right FolderContent */}
          <Panel>
            <div className="h-full overflow-auto border border-zinc-500">
              {selectedFolder ? (
                <FolderContent
                  files={folderFiles}
                  view={view}
                  entityId={entityId}
                  currentFolderId={Number(selectedFolder.id)}
                />
              ) : (
                <p className="text-gray-400">
                  Select a folder from the tree on the left to view the files inside.
                </p>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default CloudManagement;
