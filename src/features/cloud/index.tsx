import { useState } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import CloudToolbar from "./components/CloudToolbar";
import FolderTree from "./components/FolderTree";
import { FolderContent } from "./components/FolderContent";
import { MdFolderSpecial } from "react-icons/md";
import { CLASS_NAME_DEFAULT } from "@/utils/class";
import PDFViewer from "./components/pdf-viewer/PDFViewer";

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
  const [selectedFolder, setSelectedFolder] = useState<any>();
  const [folderFiles, setFolderFiles] = useState<FileItem[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [view, setView] = useState<"list" | "grid">("list");

  // Lấy lại id folder đã chọn từ localStorage

  // Khi chọn folder, lưu lại id vào localStorage
  const handleSelect = (node: any, files: FileItem[]) => {
    setSelectedFolder(node);
    setFolderFiles(files);
  };

  const triggerRefreshTree = () => {
    setRefreshFlag((prev) => prev + 1);
  };

  const handleUploadedFile = () => {
    triggerRefreshTree();
  };


  return (
    <div className="h-full bg-background text-foreground flex flex-col font-sans">
      {/* Toolbar */}
      <div className="px-4 py-3 bg-muted border-b border-border shadow-sm border-gray-400 dark:border-gray-700">
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
      <div className={`flex-1 overflow-hidden ${CLASS_NAME_DEFAULT.CLASS_SCROLLBAR}`}>
        <PanelGroup direction="horizontal">
          {/* Folder Tree */}
          <Panel
            defaultSize={23}
            minSize={15}
            maxSize={25}
            className="bg-muted border-r border-border shadow-inner border-gray-400 dark:border-gray-700"
          >
            <FolderTree
              onSelect={handleSelect}
              entityId={entityId}
              refreshTrigger={refreshFlag}
            />
          </Panel>

          <PanelResizeHandle className="w-0 bg-border hover:bg-accent cursor-col-resize transition-colors duration-300" />

          {/* Folder Content */}
          <Panel>
            <div className="h-full overflow-auto p-4 bg-background border border-t-0 border-l-0 border-gray-400 dark:border-gray-700">
              {selectedFolder ? (
                <FolderContent
                  files={folderFiles}
                  view={view}
                  entityId={entityId}
                  currentFolderId={Number(selectedFolder.id)}
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                  <span className="text-6xl">
                    <MdFolderSpecial size={100} />
                  </span>
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
