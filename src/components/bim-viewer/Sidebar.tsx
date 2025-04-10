import { useState } from "react";
import { FaHome, FaRocket, FaUser, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { LogoWord } from "../LogoWord";

interface SidebarProps {
  isSidebarOpen: boolean;
  isCollapsed: boolean;
  toggleSidebar: () => void;
  toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, isCollapsed, toggleSidebar, toggleCollapse }) => {
    const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
    >
      {/* Sidebar */}
      <aside
        className={` p-[0.3125rem] h-screen bg-gray-900 text-white flex flex-col shadow-md transition-all duration-300 ease-in-out ${
          isSidebarOpen ? (isCollapsed ? "w-full" : "w-60") : "hidden"
        }`}
      >
       
        {/* Logo (Centered based on collapse state) */}
        {isSidebarOpen && (
        <div className="flex items-center justify-center ">
            <LogoWord isHiddenText={Boolean(isCollapsed)} />
        </div>
        )}


        {/* Sidebar Menu */}
        <nav className="flex flex-col space-y-2 mt-6">
          <SidebarItem icon={<FaHome />} text="Home" isCollapsed={isCollapsed} href="/home" active />
          <SidebarItem icon={<FaRocket />} text="Spaces" isCollapsed={isCollapsed} href="/spaces" />
          <SidebarItem icon={<FaUser />} text="Me" isCollapsed={isCollapsed} href="/me" />
        </nav>

        {/* Shrink Sidebar Button - Chỉ hiện khi hover */}
        {isSidebarOpen && isHovered && (
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8  flex items-center justify-center "
            onClick={toggleCollapse}
          >
            {isCollapsed ? <FaChevronRight size={18} /> : <FaChevronLeft size={18} />}
          </button>
        )}

        {/* Show Button when Sidebar is Fully Hidden - Chỉ hiện khi hover */}
        {!isSidebarOpen && isHovered && (
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 w-8 h-12 bg-gray-800 text-gray-300 rounded-r-lg shadow-md flex items-center justify-center hover:bg-gray-700 transition"
            onClick={toggleSidebar}
          >
            <FaChevronRight size={18} />
          </button>
        )}
      </aside>
    </div>
  );
};

// Sidebar Item Component
const SidebarItem = ({
  icon,
  text,
  isCollapsed,
  href,
  active = false,
}: {
  icon: React.ReactNode;
  text: string;
  isCollapsed: boolean;
  href: string;
  active?: boolean;
}) => {
  return (
    <a
      href={href}
      className={`flex items-center  ${isCollapsed ?  "self-center" : ""} gap-3 p-2 rounded-lg hover:bg-gray-800 cursor-pointer transition-all duration-200 ${
        active ? "bg-green-600 text-white" : ""
      }`}
    >
      {icon}
      {!isCollapsed && <span className="transition-opacity duration-300">{text}</span>}
    </a>
  );
};

export default Sidebar;
