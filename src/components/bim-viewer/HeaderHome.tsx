import { useState } from "react";
import { FaBars, FaBell, FaMoon, FaChevronRight, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
  breadcrumbs?: { label: string; href?: string }[];
}

const HeaderHome: React.FC<HeaderProps> = ({ toggleSidebar, isSidebarOpen, breadcrumbs = [{ label: "Home" }] }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header className="flex items-center justify-between bg-gray-900 px-6 p-[0.3125rem] shadow-md w-full">
      {/* Left: Sidebar Toggle & Breadcrumb */}
      <div className="flex items-center gap-4">
        {/* Button with Hover Effect */}
        <button
          onClick={toggleSidebar}
          className="p-2 text-gray-400 hover:text-white transition"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isSidebarOpen ? (isHovered ? <FaArrowLeft /> : <FaBars />) : (isHovered ? <FaArrowRight />: <FaBars /> )}
        </button>

        {/* Breadcrumb Navigation */}
        <nav className="flex items-center text-green-400 text-xl font-semibold">
          <span>Viralution</span>
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center text-gray-300 text-lg ml-2">
              <FaChevronRight size={14} className="mx-1" />
              {crumb.href ? (
                <a href={crumb.href} className="hover:text-white transition">
                  {crumb.label}
                </a>
              ) : (
                <span>{crumb.label}</span>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Right: Dark Mode, Notifications, User */}
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-white transition">
          <FaMoon size={20} />
        </button>
        <button className="p-2 text-gray-400 hover:text-white transition">
          <FaBell size={20} />
        </button>
        <Avatar className="cursor-pointer">
          <AvatarImage src="https://via.placeholder.com/40" />
        </Avatar>
      </div>
    </header>
  );
};

export default HeaderHome;
