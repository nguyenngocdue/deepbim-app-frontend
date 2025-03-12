import HeaderHome from "./HeaderHome";

interface MainHomeProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

const MainHome: React.FC<MainHomeProps> = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <div className="h-full w-full flex-col flex flex-1 overflow-auto">
      <HeaderHome toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen}/>
      <div className="overflow-auto flex-1 p-4 bg-gray-800 text-white"> {/* Main Content Here */} </div>
    </div>
  );
};

export default MainHome;
