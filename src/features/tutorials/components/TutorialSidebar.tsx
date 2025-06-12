import { useState, useRef, useEffect } from "react";
import { Home, Book, FileText, Users, LogOut, ChevronLeft, ChevronRight } from "lucide-react";

interface TutorialSidebarProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}

export function TutorialSidebar({ isOpen, onToggle }: TutorialSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    onToggle(!isOpen);
  };

  const menuItems = [
    { icon: Home, label: "Trang chủ" },
    { icon: Book, label: "Khóa học" },
    { icon: FileText, label: "Bài viết" },
    { icon: Users, label: "Cộng đồng" },
  ];

  return (
    <>
      {/* Sidebar for medium and larger screens */}
      <aside
        ref={sidebarRef}
        className={`fixed top-20 left-0 h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out z-20 ${isOpen ? "w-64" : "w-16"
          } hidden md:flex flex-col items-center py-6 px-2 group`}
      >
        <div className="relative w-full h-full">
          <div className="mb-8">
            <span className={`text-lg font-semibold ${!isOpen ? "hidden" : ""}`}>
              Tutorial Hub
            </span>
          </div>
          <nav className="flex flex-col space-y-4 flex-1 w-full">
            {menuItems.map((item, index) => (
              <button
                key={index}
                className={`w-full h-12 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-start px-4 transition-colors duration-200 ${!isOpen ? "justify-center" : ""
                  }`}
              >
                <item.icon className="h-6 w-6 text-white" />
                {isOpen && <span className="ml-4 text-sm font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          {/* Toggle Button */}
          <div className="absolute top-1/2 -right-4 hidden group-hover:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto md:block">
            <button
              onClick={handleToggle}
              className={`absolute -right-2 bg-transparent w-6 h-6 bg-gray-800 hover:bg-gray-700 text-white flex items-center justify-center rounded-full shadow-lg transition-opacity duration-500 opacity-0 group-hover:opacity-100`}
              title={isOpen ? "Thu gọn" : "Mở rộng"}
            >
              {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
        </div>
      </aside>

      {/* Horizontal navbar for small screens */}
      <nav className="md:hidden bg-gray-900 text-white p-4 flex justify-around items-center fixed bottom-0 left-0 w-full z-20 shadow-lg">
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="flex flex-col items-center space-y-1"
          >
            <item.icon className="h-6 w-6 text-white" />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
}