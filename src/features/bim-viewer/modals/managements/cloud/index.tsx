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


const CloudManagerment = ({ entityId }: { entityId: number }) => {


  const [selectedFolder, setSelectedFolder] = useState<any>(null);
  const [folderFiles, setFolderFiles] = useState<FileItem[]>([]);
  const [refreshFlag, setRefreshFlag] = useState(0);
  const [view, setView] = useState<"list" | "grid">("list");


  const triggerRefreshTree = () => {
    setRefreshFlag(prev => prev + 1);
  };


  const handleSelect = (node: any, files: FileItem[]) => {
    setSelectedFolder(node);
    setFolderFiles(files);
  };

   const handleUploadedFile = (uploadedFile: FileItem) => {
    console.log(uploadedFile);
  };



const renderContent = () => {
  return <FolderContent files={folderFiles} view={view} />
};




  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* Top Toolbar */}
      <div className="bg-white px-4 py-2">
        <CloudToolbar 
          selectedFolder={selectedFolder} 
          entityId={entityId} 
          onCreated={triggerRefreshTree} 
          onUploaded={handleUploadedFile}  
          setView={setView}
          view={view}
          />
      </div>

      {/* Resizable Panels */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Left Panel - Tree */}
          <Panel defaultSize={30} minSize={20} maxSize={50} className="bg-gray-900">
            <FolderTree 
                onSelect={handleSelect} 
                entityId={entityId} 
                onCreated={triggerRefreshTree} 
                refreshTrigger={refreshFlag}
                />
          </Panel>

          <PanelResizeHandle className="w-1 bg-gray-700 hover:bg-blue-500 cursor-col-resize" />

          {/* Right Panel - Content */}
          <Panel>
            <div className="p-4 h-full overflow-auto">
              {selectedFolder ? 
                  renderContent()
               : (
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
