import { useState } from "react";
import Sidebar from "@/components/bim-viewer/Sidebar";
import MainHome from "@/components/bim-viewer/MainHome";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className="flex relative">
      {/* Sidebar - Can be collapsed or fully hidden */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isCollapsed={isCollapsed}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        toggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main Content */}
      <MainHome toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen}/>
    </div>
  );
};

export default Home;
