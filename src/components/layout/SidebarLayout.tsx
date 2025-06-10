// imports
import { useState } from "react";
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
  const { theme } = useTheme();

  const isDark = theme === "dark" || theme === "system";
  const sidebarBg = isDark ? "bg-zinc-900" : "bg-zinc-50";
  const textColor = isDark ? "text-zinc-100" : "text-zinc-800";
  const mutedText = isDark ? "text-zinc-400 " : "text-zinc-500";
  const hoverBg = isDark ? "hover:bg-zinc-800 " : "hover:bg-zinc-100 ";
  const tooltipContent = isDark ? " text-gray-200" : "text-gray-700";

  const toggleCollapse = () => {
    const newVal = !collapsed;
    setCollapsed(newVal);
    localStorage.setItem("sidebar-collapsed", String(newVal));
  };

  return (
    <div className="flex min-h-screen overflow-x-hidden">
      <aside className={`group relative z-40 border-r transition-all duration-300 dark:border-gray-600 border-gray-400 ${sidebarBg} ${collapsed ? "w-[60px]" : "w-[250px]"}`}>
        <div className="flex items-center justify-center h-20 border-b bg-background dark:border-gray-600 border-gray-400">
          <LogoWord isHiddenText={collapsed} path="/images/logo_no_bg.png" size="md" />
        </div>

        <nav className="p-2 overflow-y-auto h-[calc(100%-5rem)] pb-36 bg-background">
          {!collapsed && <div className={`uppercase text-xs font-semibold px-3 mb-1 ${mutedText}`}>General</div>}
          <ul className="space-y-1">
            {[{ text: "Workflows", icon: AppIcons.Workflow, to: "/managements/workflows" }, { text: "Model Previews", icon: AppIcons.BoxModel, to: "/managements/model-previews" }].map(({ text, icon: Icon, to }) => (
              <TooltipProvider key={text}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <li>
                      <Link to={to} className={`flex items-center  ${collapsed ? "justify-center" : "gap-3"} px-3 py-2 rounded-md ${textColor} ${hoverBg} text-sm font-medium `}>
                        <Icon />
                        {!collapsed && <span>{text}</span>}
                      </Link>
                    </li>
                  </TooltipTrigger>
                  {collapsed && <TooltipContent side="right" className={tooltipContent}>{text}</TooltipContent>}
                </Tooltip>
              </TooltipProvider>
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
                    <Link to="/managements/projects" className={`block ${hoverBg} rounded-md px-2.5 py-2 text-sm ${textColor}`}>
                      <AppIcons.Projects className="inline mr-2" /> Projects
                    </Link>
                  </li>
                  <li  className="w-full text-left">
                    <Link to="/managements/sub-projects" className={`block ${hoverBg} rounded-md px-2.5 py-2 text-sm ${textColor}`}>
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
                  <TooltipContent side="right" >
                    <div className="bg-slate-600 dark:bg-slate-300 rounded-md shadow-md w-44">
                      <Link to="/managements/projects" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-background/10">
                        <AppIcons.Projects size={16} /> Projects
                      </Link>
                      <Link to="/managements/sub-projects" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-background/10">
                        <AppIcons.SubProjects size={16} /> Sub-Projects
                      </Link>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </ul>

          {!collapsed && <div className={`uppercase text-xs bg-accent/95 p-2 font-semibold px-3 mt-5 mb-1 ${mutedText}`}>Admin Management</div>}
          <ul className="space-y-1">
            {[{ text: "User", icon: AppIcons.AdminPanel, to: "/managements/users" }, { text: "Chat", icon: AppIcons.Chat, to: "/managements/chat-support" }].map(({ text, icon: Icon, to }) => (
              <TooltipProvider key={text}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <li>
                      <Link to={to} className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} px-3 py-2 rounded-md ${textColor} ${hoverBg} text-sm font-medium`}>
                        <Icon />
                        {!collapsed && <span>{text}</span>}
                      </Link>
                    </li>
                  </TooltipTrigger>
                  {collapsed && <TooltipContent side="right" className={tooltipContent}>{text}</TooltipContent>}
                </Tooltip>
              </TooltipProvider>
            ))}
          </ul>
        </nav>

        <div className="absolute top-1/2 -right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={toggleCollapse} className="rounded-full p-2 border bg-zinc-600 shadow">
                  {collapsed ? <AppIcons.ChevronRight /> : <AppIcons.ChevronLeft />}
                </Button>
              </TooltipTrigger>
              <TooltipContent className={tooltipContent}>{collapsed ? "Expand Sidebar" : "Collapse Sidebar"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {!collapsed && (
          <div className="absolute left-0 right-0 bottom-0 px-4 pb-6 hidden md:block">
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
            </div>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-col h-full">
        <header className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-600 border-gray-400">
          <BreadcrumbsWithIconAndLabel2 />
          <div className="flex items-center gap-4">
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </header>
        <main className="p-4 overflow-y-auto flex-1 bg-background">{children}</main>
      </div>
    </div>
  );
}
