import { useState } from "react"
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar"
import {
    ChevronLeft,
    ChevronRight,
    BarChart3,
    Map,
    LayoutGrid,
} from "lucide-react"
import { Link } from "@tanstack/react-router"
import { LogoWord } from "../LogoWord"
import BreadcrumbsWithIconAndLabel from "@/components/BreadcrumbsWithIconAndLabel"
import { useLanguage } from "@/context/LanguageContext"
import { useTheme } from "@/context/theme-context"
import { Button } from "../ui/button"
import { IoPerson } from "react-icons/io5"
import { MdAdminPanelSettings, MdWorkspaces } from "react-icons/md"
import { HiHomeModern } from "react-icons/hi2"
import { GrProjects, GrVirtualStorage } from "react-icons/gr"
import { TiFlowChildren } from "react-icons/ti";
import { BsChatQuoteFill } from "react-icons/bs"
import { ThemeSwitch } from "../theme-switch"
import { ProfileDropdown } from "../common/ProfileDropdown"

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(() => {
        const stored = localStorage.getItem('sidebar-collapsed');
        return stored === 'true';// localStorage lưu kiểu string, nên phải so sánh
    });
    const { language, toggleLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();


    return (
        <div className="flex h-full bg-behind text-white">
            {/* Sidebar section */}
            <div className="relative group bg-behind z-50">
                <Sidebar
                    collapsed={collapsed}
                    backgroundColor="#0b1120"
                    rootStyles={{ height: "100%", backgroundImage: "url(/sidebar-bg.png)", backgroundSize: "cover" }}
                    width="200px"
                >
                    {/* Logo and Title */}
                    <div className="flex items-center justify-center  px-2 py-3 border-b border-[#1c1c2a] shadow-sm">
                        <LogoWord isHiddenText={true} path="/images/logo_no_bg.png" size="md" />
                        {!collapsed && (
                            <h1 className="text-transparent text-white text-base font-heading tracking-wider">
                                DeepBIM
                            </h1>
                        )}
                    </div>

                    <Menu
                        menuItemStyles={{
                            button: ({ level, active }) => ({
                                backgroundColor: active ? "#1d283a" : level > 0 ? "#0f172a" : "transparent",
                                color: active ? "#60a5fa" : "#f8fafc",
                                padding: "12px 20px",
                                fontWeight: 500,
                                fontSize: "0.925rem",
                                [`&:hover`]: {
                                    backgroundColor: "#1e293b",
                                    color: "#60a5fa",
                                },
                                [`& svg`]: {
                                    transition: "color 0.3s ease",
                                    color: active ? "#60a5fa" : undefined,
                                },
                                [`&:hover svg`]: {
                                    color: "#3b82f6",
                                },
                            }),
                            label: {
                                fontSize: "0.925rem",
                            }
                        }}
                    >

                        {!collapsed && <div className="px-4 pt-2 pb-1 uppercase text-xs tracking-wide text-slate-400">General</div>}
                        <MenuItem icon={<HiHomeModern size={18} />} component={<Link to="/managements/home" />}>Home</MenuItem>
                        <MenuItem icon={<MdWorkspaces size={18} />} component={<Link to="/managements/spaces" />}>Spaces</MenuItem>
                        <MenuItem icon={<IoPerson size={18} />} component={<Link to="/managements/me" />}>Me</MenuItem>

                        {!collapsed && <div className="px-4 pt-2 pb-1 uppercase text-xs tracking-wide text-slate-400">Project Managerment</div>}

                        <SubMenu label="Workspaces" icon={<MdWorkspaces size={18} />} defaultOpen={true}>
                            <MenuItem icon={<GrProjects className="ml-5" size={20} />} component={<Link to="/managements/projects" />}>Projects</MenuItem>
                            <MenuItem icon={<TiFlowChildren className="ml-5" size={20} />} component={<Link to="/managements/sub-projects" />}>Sub-Projects</MenuItem>
                        </SubMenu>

                        {!collapsed && <div className="px-4 pt-2 pb-1 uppercase text-xs tracking-wide text-slate-400">Admin Management</div>}
                        <MenuItem icon={<MdAdminPanelSettings size={18} />} component={<Link to="/managements/users" />} >User</MenuItem>
                        <MenuItem icon={<BsChatQuoteFill size={18} />} component={<Link to="/managements/chat-support" />} >Chat</MenuItem>
                    </Menu>


                    {/* Footer call to action */}
                    {!collapsed && (
                        <div className="absolute left-0 right-0 bottom-0 mt-auto px-4 py-6 sm:hidden">
                            <div className="bg-gradient-to-br from-green-500 to-cyan-400 rounded-xl p-4 text-center">
                                <div className="text-white font-semibold text-sm">Wellcome to DeepBim</div>
                                <div className="text-xs text-slate-100">v1.1.0</div>
                                <Button className="mt-2 bg-white text-blue-600 text-xs font-bold py-1 px-3 rounded shadow">Hello</Button>
                            </div>
                        </div>
                    )}
                </Sidebar>

                {/* Collapse Toggle Button */}
                <div
                    className="absolute top-[50%] bottom-0 right-[-18px] z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-transparent"
                    onClick={() => {
                        setCollapsed(prev => {
                            const newValue = !prev;
                            localStorage.setItem('sidebar-collapsed', String(newValue));
                            return newValue;
                        });
                    }}
                >
                    <Button className=" hover:bg-slate-700 p-1 shadow-md rounded bg-green-100 text-green-700">
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </Button>
                </div>
            </div>

            {/* Main layout */}
            <div className="flex flex-col flex-1 h-screen overflow-hidden p-4">
                <div className="text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                        <BreadcrumbsWithIconAndLabel />
                        <div className="flex items-center gap-2 md:gap-4">
                            <ThemeSwitch />
                            <ProfileDropdown />
                        </div>
                    </div>
                </div>
                <main className="w-full p-4 h-[95vh] overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    )
}