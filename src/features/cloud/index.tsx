import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CloudToolbar from "./components/CloudToolbar";
import FolderTree from "./components/FolderTree";
import { FolderContent } from "./components/FolderContent";
import { MdFolderSpecial } from "react-icons/md";

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

  const triggerRefreshTree = () => setRefreshFlag((prev) => prev + 1);

  const handleSelect = (node: any, files: FileItem[]) => {
    setSelectedFolder(node);
    setFolderFiles(files);
  };

  const handleUploadedFile = () => {
    triggerRefreshTree();
  };

  return (
    <div className="h-full bg-neutral-950 text-neutral-200 flex flex-col font-sans">
      {/* Toolbar */}
      <div className="px-4 py-3 bg-neutral-900 border-b border-neutral-800 shadow-sm">
        <CloudToolbar
          selectedFolder={selectedFolder}
          entityId={entityId}
          onCreated={triggerRefreshTree}
          onUploaded={handleUploadedFile}
          setView={setView}
          view={view}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Folder Tree */}
          <Panel
            defaultSize={20}
            minSize={15}
            maxSize={25}
            className="bg-neutral-900 border-r border-neutral-800 shadow-inner"
          >
            <FolderTree
              onSelect={handleSelect}
              entityId={entityId}
              refreshTrigger={refreshFlag}
            />
          </Panel>

          <PanelResizeHandle className="w-1 bg-neutral-800 hover:bg-blue-500 cursor-col-resize transition-colors duration-300" />

          {/* Folder Content */}
          <Panel>
            <div className="h-full overflow-auto p-4 bg-neutral-950">
              {selectedFolder ? (
                <FolderContent
                  files={folderFiles}
                  view={view}
                  entityId={entityId}
                  currentFolderId={Number(selectedFolder.id)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-neutral-500 gap-2">
                  <span className="text-6xl"><MdFolderSpecial  size={100}/></span>
                  <p>Select a folder to view its files</p>
                </div>
              )}
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
};

export default CloudManagement;
