import { useState } from "react"
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar"
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
import LeftHeader from "@/sections/LeftHeader"

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
    const [collapsed, setCollapsed] = useState(false);
    const { language, toggleLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
      };

    return (
        <div className="flex min-h-screen bg-behind text-white relative">
            {/* Sidebar section */}
            <div className="relative group bg-behind ">
                <Sidebar
                    collapsed={collapsed}
                    backgroundColor="#0b1120"
                    rootStyles={{ height: "100vh", backgroundImage: "url(/sidebar-bg.png)", backgroundSize: "cover" }}
                >
                    {/* Logo and Title */}
                    <div className="flex items-center justify-center gap-2 px-2 py-3 border-b border-[#1c1c2a] shadow-sm">
                        <LogoWord isHiddenText={true} />
                        {!collapsed && (
                            <h1 className="text-transparent text-white text-base font-semibold tracking-wider">
                                DeepBIM
                            </h1>
                        )}
                    </div>

                    <Menu
                        menuItemStyles={{
                            button: {
                            padding: "12px 20px",
                            fontWeight: 500,
                            fontSize: "0.925rem",
                            color: "white",
                            [`&:hover`]: {
                                backgroundColor: "#1d283a",
                                color: "black", // text màu đen khi hover
                            },
                            [`&.active`]: {
                                backgroundColor: "#1d283a",
                                color: "#60a5fa",
                            },
                            [`& svg`]: {
                                transition: "color 0.3s ease",
                            },
                            [`&:hover svg`]: {
                                color: "black", // icon chuyển sang đen khi hover
                            },
                            },
                        }}
                        >
                        <div className="px-4 pt-2 pb-1 uppercase text-xs tracking-wide text-slate-400">General</div>
                        <MenuItem icon={<BarChart3 size={18} />} component={<Link to="/" />}>Home</MenuItem>
                        <MenuItem icon={<Map size={18} />} component={<Link to="/" />}>Spaces</MenuItem>
                        <MenuItem icon={<LayoutGrid size={18} />} component={<Link to="/managements/me" />}>Me</MenuItem>
                        </Menu>


                    {/* Footer call to action */}
                    {!collapsed && (
                        <div className="absolute left-0 right-0 bottom-0 mt-auto px-4 py-6">
                            <div className="bg-gradient-to-br from-green-500 to-cyan-400 rounded-xl p-4 text-center">
                                <div className="text-white font-semibold text-sm">Wellcome to DeepBim</div>
                                <div className="text-xs text-slate-100">v1.1.0</div>
                                <button className="mt-2 bg-white text-blue-600 text-xs font-bold py-1 px-3 rounded shadow">Hello</button>
                            </div>
                        </div>
                    )}
                </Sidebar>

                {/* Collapse Toggle Button */}
                <div
                    className="absolute top-4 -right-4 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <button className="bg-slate-800 hover:bg-slate-700 text-white rounded-full px-2 py-1 shadow-md">
                        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>
            </div>

            {/* Main layout */}
            <div className="flex flex-col flex-1 p-4">
                <div className="text-sm text-muted-foreground mb-4">
                    <div className="flex items-center justify-between">
                        <BreadcrumbsWithIconAndLabel/>
                        <LeftHeader 
                            toggleLanguage={toggleLanguage}
                            language={language.toUpperCase()}
                            toggleTheme={toggleTheme}
                            theme={theme}
                        />
                    </div>
                </div>
                <main className="bg-behind">
                    {children}
                </main>
            </div>
        </div>
    )
}