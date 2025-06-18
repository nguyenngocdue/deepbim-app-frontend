import { useState, useRef, useEffect } from "react";
import {
  Home, Book, FileText, Users, LogOut, ChevronLeft,
  ChevronRight, ChevronDown, ChevronUp, List, User,
  FileCheck, BookOpen
} from "lucide-react";
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

export function TutorialSidebar({ isOpen, onToggle }: TutorialSidebarProps) {
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
  }, []);

  useEffect(() => {
    localStorage.setItem("tutorial-sidebar-open", String(isOpen));
  }, [isOpen]);

  const menuItems = [
    { icon: Home, label: "Trang chủ", url: "/" },
    { icon: Book, label: "Khóa học", url: "/tutorials/home-page" },
    { icon: FileText, label: "Bài viết", url: "/tutorials/home-page", status: <CustomBadge text="Dev" className="ml-2 bg-pink-600 text-white" /> },
    { icon: Users, label: "Cộng đồng", url: "/tutorials/home-page", status: <CustomBadge text="Dev" className="ml-2 bg-pink-600 text-white" /> },
  ];

  const adminMenuItems = [
    { icon: BookOpen, label: "Courses", url: "/tutorials/admin/courses" },
    { icon: List, label: "Lessons", url: "/tutorials/admin/lessons" },
    { icon: FileCheck, label: "Enrollments", url: "/tutorials/admin/enrollments" },
    { icon: MdCardMembership, label: "User Enrollments", url: "/tutorials/admin/user-enrollments" },
  ];

  const isAdmin = currentUser?.email === "deepbimnet@gmail.com";

  return (
    <>
      <aside
        ref={sidebarRef}
        className={`fixed  ${isOpen ? 'top-40' : 'top-1/4'} left-4 h-auto bg-gradient-to-br from-zinc-900 via-gray-900 to-neutral-800 backdrop-blur-lg border border-zinc-700 text-white transition-all duration-300 ease-in-out z-20 ${
          isOpen ? "w-64" : "w-16"
        } hidden md:flex flex-col items-center py-6 px-2 group rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.6)]`}
      >
        <div className="relative w-full ">
          <div className="mb-8 px-2 flex items-center justify-center">
            {isOpen ? (
              <span className="text-lg font-bold tracking-wide text-emerald-400 transition-opacity duration-300">
                Khu vực học tập
              </span>
            ) : (
              <BookOpen className="w-6 h-6 text-emerald-400" />
            )}
          </div>
          <div className="flex-1 overflow-y-auto lg:max-h-[70vh] md:max-h-[50vh] max-h-[20vh]">
              <nav className="flex flex-col space-y-4 flex-1 w-full">
                {menuItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.url}
                    className={`w-full h-12 rounded-xl bg-zinc-800/70 hover:bg-emerald-600/30 flex items-center px-4 transition-all duration-300 ${
                      !isOpen ? "justify-center" : "justify-start"
                    } hover:shadow-md hover:shadow-emerald-400/20`}
                  >
                    <item.icon className="h-6 w-6 text-emerald-400" />
                    {isOpen && (
                      <>
                        <span className="ml-4 text-base font-semibold text-white/90">{item.label}</span>
                        {item.status}
                      </>
                    )}
                  </Link>
                ))}

                {isAdmin && isOpen && (
                  <div className="mt-6">
                    <button
                      onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                      className="w-full h-12 rounded-xl bg-zinc-800/70 hover:bg-emerald-600/30 flex items-center justify-between px-4 transition-all duration-300 hover:shadow-md hover:shadow-emerald-400/20"
                    >
                      <div className="flex items-center">
                        <Users className="h-6 w-6 text-emerald-400" />
                        <span className="ml-4 text-base font-semibold text-white/90">Admin</span>
                      </div>
                      <span className="transition-transform duration-300">
                        {isAdminMenuOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </span>
                    </button>
                    {isAdminMenuOpen && (
                      <div className="flex flex-col space-y-2 mt-2 pl-8">
                        {adminMenuItems.map((item, index) => (
                          <Link
                            key={index}
                            to={item.url}
                            className="w-full h-10 rounded-lg bg-zinc-800/50 hover:bg-emerald-700/30 flex items-center px-4 transition-all duration-300 hover:shadow-sm hover:shadow-emerald-400/10"
                          >
                            <item.icon className="h-5 w-5 text-emerald-400" />
                            <span className="ml-4 text-sm font-medium text-white/90">{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </nav>

              <div className="absolute top-1/2 -right-4 hidden group-hover:block opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto md:block">
                <button
                  onClick={handleToggle}
                  className="absolute -right-2 bg-zinc-800/70 w-8 h-8 hover:bg-emerald-600/40 text-white flex items-center justify-center rounded-full shadow-lg transition-all duration-300"
                  title={isOpen ? 'Thu gọn' : 'Mở rộng'}
                >
                  <div className="transition-transform duration-300">
                    {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                  </div>
                </button>
              </div>
            </div>

          </div>
      </aside>
    </>
  );
}