import { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { LogoWord } from "../LogoWord";
import { useTheme } from "@/context/theme-context";
import { Button } from "../ui/button";
import { MdAdminPanelSettings, MdWorkspaces } from "react-icons/md";
import { GrProjects } from "react-icons/gr";
import { TiFlowChildren } from "react-icons/ti";
import { BsChatQuoteFill } from "react-icons/bs";
import { ThemeSwitch } from "../theme-switch";
import { ProfileDropdown } from "../common/ProfileDropdown";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import BreadcrumbsWithIconAndLabel2 from "../BreadcrumbsWithIconAndLabel2";
import { LuWorkflow } from "react-icons/lu";
import { TbBoxModel2 } from "react-icons/tb";

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    return stored === "true";
  });
  const { theme } = useTheme();
  console.log(theme);

  // Theme-based colors
  const themeColors = {
    light: {
      sidebarBg: "#f8fafc",
      textColor: "#1e293b",
      activeBg: "#e2e8f0",
      hoverBg: "#edf2f7",
      activeText: "#1d4ed8",
      borderColor: "#e5e7eb",
    },
    dark: {
      sidebarBg: "#0f172a",
      textColor: "#f1f5f9",
      activeBg: "#1e293b",
      hoverBg: "#293548",
      activeText: "#3b82f6",
      borderColor: "#1e293b",
    },
     system: {
      sidebarBg: "#0f172a",
      textColor: "#f1f5f9",
      activeBg: "#1e293b",
      hoverBg: "#293548",
      activeText: "#3b82f6",
      borderColor: "#1e293b",
    },
  };

  const colors = themeColors[theme];

  return (
    <div className="flex h-screen bg-background text-foreground transition-colors duration-300 relative">
      {/* Sidebar section */}
      <div className="relative group z-50">
        <Sidebar
          collapsed={collapsed}
          backgroundColor={colors.sidebarBg}
          rootStyles={{
            height: "100%",
            backgroundImage: collapsed ? "none" : "url(/sidebar-bg.png)",
            backgroundSize: "cover",
            borderRight: `1px solid ${colors.borderColor}`,
            transition: "width 0.3s ease, background 0.3s ease",
          }}
          width="250px"
          collapsedWidth="60px"
        >
          {/* Logo */}
          <div className="flex items-center justify-center px-4 py-4 border-b" style={{ borderColor: colors.borderColor }}>
            <LogoWord isHiddenText={collapsed} path="/images/logo_no_bg.png" size="md" />
          </div>

          <Menu
            menuItemStyles={{
              button: ({ level, active }) => ({
                backgroundColor: active ? colors.activeBg : level > 0 ? colors.sidebarBg : "transparent",
                color: active ? colors.activeText : colors.textColor,
                padding: collapsed ? "10px 12px" : "10px 20px",
                fontWeight: active ? 600 : 500,
                fontSize: "0.95rem",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: "8px",
                margin: collapsed ? "0 8px" : "0 12px",
                [`&:hover`]: {
                  backgroundColor: colors.hoverBg,
                  color: colors.activeText,
                  transform: "translateX(2px)",
                },
                [`& svg`]: {
                  transition: "color 0.2s ease",
                  color: active ? colors.activeText : colors.textColor,
                },
                [`&:hover svg`]: {
                  color: colors.activeText,
                },
              }),
              label: {
                display: collapsed ? "none" : "block",
                fontSize: "0.95rem",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              },
              subMenuContent: {
                backgroundColor: colors.sidebarBg,
                borderRadius: "8px",
                margin: "0 12px",
              },
            }}
          >
            {!collapsed && (
              <div className="px-4 pt-4 pb-2 uppercase text-xs tracking-wider font-medium" style={{ color: colors.textColor + "80" }}>
                General
              </div>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <MenuItem icon={<LuWorkflow   size={22} />} component={<Link to="/managements/workflows" />}>
                    Workflows
                  </MenuItem>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right" className="bg-background text-foreground text-sm py-1.5 px-3 rounded-md">Home</TooltipContent>}
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <MenuItem icon={<TbBoxModel2  size={22} />} component={<Link to="/view2" />}>
                    Model Example
                  </MenuItem>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right" className="bg-background text-foreground text-sm py-1.5 px-3 rounded-md">Spaces</TooltipContent>}
              </Tooltip>
              <Tooltip>
                {/* <TooltipTrigger asChild>
                  <MenuItem icon={<IoPerson size={22} />} component={<Link to="/managements/me" />}>
                    Me
                  </MenuItem>
                </TooltipTrigger> */}
                {collapsed && <TooltipContent side="right" className="bg-background text-foreground text-sm py-1.5 px-3 rounded-md">Me</TooltipContent>}
              </Tooltip>
            </TooltipProvider>

            {!collapsed && (
              <div className="px-4 pt-4 pb-2 uppercase text-xs tracking-wider font-medium" style={{ color: colors.textColor + "80" }}>
                Project Management
              </div>
            )}
            <SubMenu label="Workspaces" icon={<MdWorkspaces size={22} />} defaultOpen>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <MenuItem icon={<GrProjects size={20} className={collapsed ? "" : "ml-4"} />} component={<Link to="/managements/projects" />}>
                      Projects
                    </MenuItem>
                  </TooltipTrigger>
                  {collapsed && <TooltipContent side="right" className="bg-background text-foreground text-sm py-1.5 px-3 rounded-md">Projects</TooltipContent>}
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <MenuItem icon={<TiFlowChildren size={20} className={collapsed ? "" : "ml-4"} />} component={<Link to="/managements/sub-projects" />}>
                      Sub-Projects
                    </MenuItem>
                  </TooltipTrigger>
                  {collapsed && <TooltipContent side="right" className="bg-background text-foreground text-sm py-1.5 px-3 rounded-md">Sub-Projects</TooltipContent>}
                </Tooltip>
              </TooltipProvider>
            </SubMenu>

            {!collapsed && (
              <div className="px-4 pt-4 pb-2 uppercase text-xs tracking-wider font-medium" style={{ color: colors.textColor + "80" }}>
                Admin Management
              </div>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <MenuItem icon={<MdAdminPanelSettings size={22} />} component={<Link to="/managements/users" />}>
                    User
                  </MenuItem>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right" className="bg-background text-foreground text-sm py-1.5 px-3 rounded-md">User</TooltipContent>}
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <MenuItem icon={<BsChatQuoteFill size={22} />} component={<Link to="/managements/chat-support" />}>
                    Chat
                  </MenuItem>
                </TooltipTrigger>
                {collapsed && <TooltipContent side="right" className="bg-background text-foreground text-sm py-1.5 px-3 rounded-md">Chat</TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          </Menu>

          {/* Footer call to action */}
          {!collapsed && (
            <div className="absolute left-0 right-0 bottom-0 mt-auto px-6 py-8 hidden sm:block">
              <div className="bg-gradient-to-br from-blue-700 to-indigo-600 rounded-lg p-4 text-center shadow-md">
                <div className="text-white font-semibold text-sm">Welcome to DeepBIM</div>
                <div className="text-xs text-white/80">v1.1.0</div>
                <Button className="mt-3 bg-white text-blue-700 text-xs cursor-none font-semibold py-1.5 px-4 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </Sidebar>

        {/* Collapse Toggle Button */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="absolute top-1/2 -right-4 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={() => {
                  const newValue = !collapsed;
                  setCollapsed(newValue);
                  localStorage.setItem("sidebar-collapsed", String(newValue));
                }}
              >
                <Button
                  className="p-2 rounded-full shadow-lg bg-background border hover:bg-accent"
                  style={{ borderColor: colors.borderColor, color: colors.activeText }}
                >
                  {collapsed ? <ChevronRight size={24} /> : <ChevronLeft size={24} />}
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-background text-foreground text-sm py-1.5 px-3 rounded-md">
              {collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Main layout */}
      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: colors.borderColor }}>
          <BreadcrumbsWithIconAndLabel2 />
          <div className="flex items-center gap-4">
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </div>
        <main className="flex-1 overflow-auto p-4 ">{children}</main>
      </div>
    </div>
  );
}