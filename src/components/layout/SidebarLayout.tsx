import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useTheme } from "@/context/theme-context";
import { LogoWord } from "../LogoWord";
import { Button } from "../ui/button";
import { ThemeSwitch } from "../theme-switch";
import { ProfileDropdown } from "../common/ProfileDropdown";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import BreadcrumbsWithIconAndLabel2 from "../BreadcrumbsWithIconAndLabel2";
import { AppIcons } from "../icons";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("sidebar-collapsed") === "true");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { theme } = useTheme();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isDark = theme === "dark" || theme === "system";
  const sidebarBg = isDark ? "bg-zinc-900" : "bg-zinc-50";
  const textColor = isDark ? "text-zinc-100" : "text-zinc-800";
  const mutedText = isDark ? "text-zinc-400" : "text-zinc-500";
  const hoverBg = isDark ? "hover:bg-slate-600" : "hover:bg-slate-300";
  const tooltipContent = isDark ? "text-gray-200" : "text-gray-700";

  const toggleCollapse = () => {
    const newVal = !collapsed;
    setCollapsed(newVal);
    localStorage.setItem("sidebar-collapsed", String(newVal));
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <aside
        className={`group fixed md:sticky top-0 left-0 z-40 border-r transition-all duration-300 dark:border-gray-600 border-gray-400 ${sidebarBg} ${
          collapsed ? "w-[60px]" : "w-[250px]"
        } ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 h-full`}
      >
        <div className="flex items-center justify-between h-20 border-b bg-background dark:border-gray-600 border-gray-400 px-4">
          <LogoWord isHiddenText={collapsed} path="/images/logo_no_bg.png" size="md" />
          <Button
            onClick={toggleMobileSidebar}
            className="md:hidden p-2"
            variant="ghost"
          >
            <AppIcons.X />
          </Button>
        </div>

        <nav className="p-2 overflow-y-auto h-[calc(100%-5rem)] pb-36 bg-background">
          {!collapsed && <div className={`uppercase text-xs font-semibold px-3 mb-1 ${mutedText}`}>General</div>}
          <ul className="space-y-1">
            {[
              { text: "Workflows", icon: AppIcons.Workflow, to: "/managements/workflows" },
              { text: "Model Previews", icon: AppIcons.BoxModel, to: "/managements/model-previews" },
            ].map(({ text, icon: Icon, to }) => (
              isMobile ? (
                <li key={text}  >
                  <Link
                    to={to}
                    className={`flex items-center hover:bg-slate-300 dark:hover:bg-slate-500 ${collapsed ? "justify-center" : "gap-3"} px-3 py-2 rounded-md ${textColor} ${hoverBg} text-sm font-medium`}
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    <Icon />
                    {!collapsed && <span>{text}</span>}
                  </Link>
                </li>
              ) : (
                <TooltipProvider key={text}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <li className="">
                        <Link
                          to={to}
                          className={`flex hover:bg-slate-300 dark:hover:bg-slate-500 items-center ${collapsed ? "justify-center" : "gap-3"} px-3 py-2 rounded-md ${textColor} ${hoverBg} text-sm font-medium`}
                          onClick={() => setIsMobileSidebarOpen(false)}
                        >
                          <Icon />
                          {!collapsed && <span>{text}</span>}
                        </Link>
                      </li>
                    </TooltipTrigger>
                    {collapsed && <TooltipContent side="right" className={tooltipContent}>{text}</TooltipContent>}
                  </Tooltip>
                </TooltipProvider>
              )
            ))}
          </ul>

          {!collapsed && <div className={`uppercase bg-accent/95 p-2 text-xs font-semibold px-3 mt-5 mb-1 ${mutedText}`}>Project Management</div>}
          <ul className="space-y-1 w-full">
            {!collapsed ? (
              <>
                <li className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground">
                  <AppIcons.Workspaces />
                  <span>Workspaces</span>
                </li>
                <ul className="ml-8 space-y-1 flex flex-col items-start">
                  <li className="w-full text-left">
                    <Link
                      to="/managements/projects"
                      className={`block ${hoverBg}  rounded-md px-2.5 py-2 text-sm ${textColor}`}
                      onClick={() => setIsMobileSidebarOpen(false)}
                    >
                      <AppIcons.Projects className="inline mr-2 " /> Projects
                    </Link>
                  </li>
                  <li className="w-full text-left">
                    <Link
                      to="/managements/sub-projects"
                      className={`block ${hoverBg} rounded-md px-2.5 py-2 text-sm ${textColor}`}
                      onClick={() => setIsMobileSidebarOpen(false)}
                    >
                      <AppIcons.SubProjects className="inline mr-2" /> Sub-Projects
                    </Link>
                  </li>
                </ul>
              </>
            ) : (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <li className={`flex items-center justify-center p-2 rounded-md ${hoverBg}`}>
                      <AppIcons.Workspaces className={textColor} />
                    </li>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <div className="bg-slate-600 dark:bg-slate-300 rounded-md shadow-md w-44">
                      <Link
                        to="/managements/projects"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-background/10"
                        onClick={() => setIsMobileSidebarOpen(false)}
                      >
                        <AppIcons.Projects size={16} /> Projects
                      </Link>
                      <Link
                        to="/managements/sub-projects"
                        className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-background/10"
                        onClick={() => setIsMobileSidebarOpen(false)}
                      >
                        <AppIcons.SubProjects size={16} /> Sub-Projects
                      </Link>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </ul>

          {!collapsed && <div className={`uppercase text-xs bg-accent/95 p-2 font-semibold px-3 mt-5 mb-1 ${mutedText}`} >Admin Management</div>}
          <ul className="space-y-1">
            {[
              { text: "User", icon: AppIcons.AdminPanel, to: "/managements/users" },
              { text: "Chat", icon: AppIcons.Chat, to: "/managements/chat-support" },
            ].map(({ text, icon: Icon, to }) => (
              isMobile ? (
                <li key={text}>
                  <Link
                    to={to}
                    className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} px-3 py-2 rounded-md ${textColor} ${hoverBg} text-sm font-medium`}
                    onClick={() => setIsMobileSidebarOpen(false)}
                  >
                    <Icon />
                    {!collapsed && <span>{text}</span>}
                  </Link>
                </li>
              ) : (
                <TooltipProvider key={text}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <li>
                        <Link
                          to={to}
                          className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} px-3 py-2 rounded-md ${textColor} ${hoverBg} text-sm font-medium`}
                          onClick={() => setIsMobileSidebarOpen(false)}
                        >
                          <Icon />
                          {!collapsed && <span>{text}</span>}
                        </Link>
                      </li>
                    </TooltipTrigger>
                    {collapsed && <TooltipContent side="right" className={tooltipContent}>{text}</TooltipContent>}
                  </Tooltip>
                </TooltipProvider>
              )
            ))}
          </ul>
        </nav>

        <div className="absolute top-1/2 -right-4 hidden group-hover:block opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto md:block">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={toggleCollapse}
                  className="rounded-full p-2 border bg-zinc-600 shadow hover:scale-105 transition-transform"
                >
                  {collapsed ? <AppIcons.ChevronRight /> : <AppIcons.ChevronLeft />}
                </Button>
              </TooltipTrigger>
              <TooltipContent className={tooltipContent}>
                {collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {!collapsed && (
          <div className="absolute left-0 right-0 bottom-0 px-4 pb-6">
            <div className="bg-gradient-to-tr from-blue-600 via-indigo-600 to-indigo-700 rounded-xl shadow-lg text-white px-4 py-5 text-center space-y-2">
              <div className="text-base font-semibold">🎉 Welcome to DeepBIM</div>
              <div className="text-xs opacity-80">Version 1.1.0</div>
              <Button
                asChild
                variant="default"
                className="w-full border-white text-white text-xs font-semibold hover:bg-white/10"
              >
                <Link to="/managements/projects" className="block w-full text-center">
                  Get Started
                </Link>
              </Button>
              <div className="flex justify-center gap-4 mt-4 md:hidden">
                <ThemeSwitch />
                <ProfileDropdown />
              </div>
            </div>
          </div>
        )}
      </aside>

      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      <div className="flex-1 flex flex-col h-full">
        <header className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-600 border-gray-400">
          <div className="flex items-center gap-4">
            <Button
              onClick={toggleMobileSidebar}
              className="md:hidden p-2"
              variant="ghost"
            >
              <AppIcons.Menu />
            </Button>
            <BreadcrumbsWithIconAndLabel2 />
          </div>
          <div className="hidden md:flex items-center gap-4">
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </header>
        <main className="p-4 overflow-y-auto flex-1 bg-background">{children}</main>
      </div>
    </div>
  );
}