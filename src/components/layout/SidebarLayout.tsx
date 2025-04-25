import { useState } from "react"
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar"
import {
  Home,
  User,
  Rocket,
  ChevronLeft,
  ChevronRight,
  Calendar,
  BookOpen,
  BarChart3,
  Map,
  LayoutGrid,
  ShoppingCart,
  Puzzle,
  Heart,
} from "lucide-react"
import { Link } from "@tanstack/react-router"

export default function SidebarLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen bg-slate-950 text-white relative">
      {/* Sidebar section */}
      <div className="relative group">
        <Sidebar
          collapsed={collapsed}
          backgroundColor="#0b1120"
          rootStyles={{ height: "100vh", backgroundImage: "url(/sidebar-bg.png)", backgroundSize: "cover" }}
        >
          {/* Logo and Title */}
          <div className="flex items-center justify-center py-6">
            <img src="/logo.png" alt="Logo" className="h-10" />
          </div>
          {!collapsed && (
            <h1 className="text-center text-blue-400 font-bold text-md pb-2">Pro Sidebar</h1>
          )}

          <Menu
            menuItemStyles={{
              button: {
                padding: "12px 20px",
                fontWeight: 500,
                fontSize: "0.925rem",
                [`&.active`]: {
                  backgroundColor: "#1d283a",
                  color: "#60a5fa",
                },
              },
            }}
          >
            <div className="px-4 pt-2 pb-1 uppercase text-xs tracking-wide text-slate-400">General</div>
            <MenuItem icon={<BarChart3 size={18} />} component={<Link to="/charts" />}>Charts <span className="ml-auto text-xs bg-red-600 text-white px-2 rounded-full">6</span></MenuItem>
            <MenuItem icon={<Map size={18} />} component={<Link to="/maps" />}>Maps</MenuItem>
            <MenuItem icon={<LayoutGrid size={18} />} component={<Link to="/theme" />}>Theme</MenuItem>
            <MenuItem icon={<Puzzle size={18} />} component={<Link to="/components" />}>Components</MenuItem>
            <MenuItem icon={<ShoppingCart size={18} />} component={<Link to="/ecommerce" />}>E-commerce</MenuItem>

            <div className="px-4 pt-4 pb-1 uppercase text-xs tracking-wide text-slate-400">Extra</div>
            <MenuItem icon={<Calendar size={18} />} component={<Link to="/calendar" />}>Calendar <span className="ml-auto text-xs bg-green-500 text-white px-2 rounded-full">New</span></MenuItem>
            <MenuItem icon={<BookOpen size={18} />} component={<Link to="/docs" />}>Documentation</MenuItem>
            <MenuItem icon={<Heart size={18} />} component={<Link to="/examples" />}>Examples</MenuItem>
          </Menu>

          {/* Footer call to action */}
          {!collapsed && (
            <div className="mt-auto px-4 py-6">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl p-4 text-center">
                <div className="text-white font-semibold text-sm">Pro Sidebar</div>
                <div className="text-xs text-slate-100">v1.1.0</div>
                <button className="mt-2 bg-white text-blue-600 text-xs font-bold py-1 px-3 rounded shadow">View code</button>
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
        <div className="text-sm text-muted-foreground mb-4">Home / Dashboard</div>
        <main className="bg-slate-900 rounded-lg p-4 shadow-inner overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}