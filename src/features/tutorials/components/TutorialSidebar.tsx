import { useState, useRef, useEffect } from "react";
import { Home, Book, FileText, Users, LogOut, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, List, User, FileCheck, BookOpen } from "lucide-react";
import CustomBadge from "@/components/common/CustomBadge";
import { Link } from "@tanstack/react-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { MdCardMembership } from "react-icons/md";

interface TutorialSidebarProps {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
  user_id?: string;
  email?: string;
}

export function TutorialSidebar({ isOpen, onToggle}: TutorialSidebarProps) {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const currentUser = useSelector((state: RootState) => state.auth.user);



  const handleToggle = () => {
    onToggle(!isOpen);
  };

  useEffect(() => {
    const savedState = localStorage.getItem("tutorial-sidebar-open");
    if (savedState !== null) {
      onToggle(savedState === "true");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("tutorial-sidebar-open", String(isOpen));
  }, [isOpen]);

  const menuItems = [
    { icon: Home, label: "Trang chủ", url: "/" },
    { icon: Book, label: "Khóa học", url: "/tutorials/home-page" },
    { icon: FileText, label: "Bài viết", url: "/tutorials/home-page", status: <CustomBadge text="Dev" className="ml-2 bg-red-800" /> },
    { icon: Users, label: "Cộng đồng", url: "/tutorials/home-page", status: <CustomBadge text="Dev" className="ml-2 bg-red-800" /> },
  ];

  const adminMenuItems = [
    { icon: BookOpen, label: "Courses", url: "/tutorials/admin/courses" },
    { icon: List, label: "Lessons", url: "/tutorials/admin/lessons" },
    { icon: FileCheck, label: "Enrollments", url: "/tutorials/admin/enrollments" },
    { icon: MdCardMembership , label: "User Enrollments", url: "/tutorials/admin/user-enrollments" },
  ];

  const isAdmin = currentUser?.email === "duengocnguyen@gmail.com" && currentUser?.id === 101 ;

  return (
    <>
      {/* Sidebar for medium and larger screens */}
      <aside
        ref={sidebarRef}
        className={`fixed top-[60px] left-0 h-screen bg-gray-900 text-white transition-all duration-300 ease-in-out z-20 ${
          isOpen ? "w-64" : "w-16"
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
              <Link
                key={index}
                to={item.url}
                className={`w-full h-12 rounded-xl bg-gray-800/70 hover:bg-emerald-800/60 flex items-center justify-start px-4 transition-all duration-300 ${
                  !isOpen ? "justify-center" : "justify-start"
                } hover:shadow-md`}
              >
                <item.icon className="h-6 w-6 text-teal-300" />
                {isOpen && (
                  <>
                    <span className="ml-4 text-base font-semibold text-gray-200">{item.label}</span>
                    {item.status}
                  </>
                )}
              </Link>
            ))}

            {/* Admin Menu */}
            {isAdmin && isOpen && (
              <div className="mt-6">
                <button
                  onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                  className="w-full h-12 rounded-xl bg-gray-800/70 hover:bg-emerald-800/60 flex items-center justify-between px-4 transition-all duration-300 hover:shadow-md"
                >
                  <div className="flex items-center">
                    <Users className="h-6 w-6 text-teal-300" />
                    <span className="ml-4 text-base font-semibold text-gray-200">Admin</span>
                  </div>
                  {isAdminMenuOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </button>
                {isAdminMenuOpen && (
                  <div className="flex flex-col space-y-2 mt-2 pl-8">
                    {adminMenuItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.url}
                        className="w-full h-10 rounded-lg bg-gray-800/50 hover:bg-emerald-800/50 flex items-center px-4 transition-all duration-300 hover:shadow-sm"
                      >
                        <item.icon className="h-5 w-5 text-teal-300" />
                        <span className="ml-4 text-sm font-medium text-gray-200">{item.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Toggle Button */}
          <div className="absolute top-1/2 -right-4 hidden group-hover:block opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto md:block">
            <button
              onClick={handleToggle}
              className={`absolute -right-2 bg-gray-800/70 w-8 h-8 hover:bg-emerald-800/60 text-white flex items-center justify-center rounded-full shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100`}
              title={isOpen ? "Thu gọn" : "Mở rộng"}
            >
              {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
        </div>
      </aside>

      {/* Horizontal navbar for small screens */}
      <nav className="md:hidden bg-gradient-to-b from-teal-900/90 via-emerald-900/80 to-gray-900/80 text-white p-3 flex justify-around items-center fixed bottom-0 left-0 w-full z-20 shadow-lg">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.url}
            className="flex flex-col items-center space-y-1 transition-all duration-200 hover:scale-105"
          >
            <item.icon className="h-6 w-6 text-teal-300" />
            <span className="text-sm font-medium text-gray-200">{item.label}</span>
          </Link>
        ))}
        {isAdmin && (
          <div className="relative flex flex-col items-center">
            <button
              onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
              className="flex flex-col items-center space-y-1 transition-all duration-200 hover:scale-105"
            >
              <Users className="h-6 w-6 text-teal-300" />
              <span className="text-sm font-medium text-gray-200">Admin</span>
            </button>
            {isAdminMenuOpen && (
              <div className="absolute bottom-16 flex flex-col bg-gray-900 rounded-lg shadow-lg p-2 space-y-2">
                {adminMenuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.url}
                    className="flex items-center px-4 py-2 text-sm text-gray-200 hover:bg-emerald-800/50 rounded-md"
                  >
                    <item.icon className="h-5 w-5 text-teal-300 mr-2" />
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </nav>
    </>
  );
}