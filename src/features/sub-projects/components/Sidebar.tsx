// features/subProject/components/Sidebar.tsx

import { useState } from "react";
import { useRouterState, useRouter } from "@tanstack/react-router";
import {
  Folder,
  AlertCircle,
  FileText,
  Users,
  Bell,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LoadingState } from "@/components/common/LoadingState";
import { RiMessage2Fill } from "react-icons/ri";

interface SidebarItemProps {
  label: string;
  icon: any;
  count?: number;
  color?: string;
  to: string;
  collapsed: boolean;
}

interface SubProject {
  id: string | number;
  name: string;
}

interface Props {
  subProject: SubProject;
}

export function Sidebar({ subProject }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const subProjectId = subProject?.id;

  return (
    <aside
      className={cn(
        "transition-all duration-300 border-r border-gray-400 dark:border-gray-700 p-4 space-y-4 bg-background text-foreground shadow-sm",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {
        subProject ? (
          <>
            <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
              {!collapsed && <span className="truncate" title={subProject.name}>{`Project: ${subProject.name}`}</span>}
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-1 rounded hover:bg-muted text-muted-foreground"
              >
                {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>
            </div>
            {!collapsed && <div className="text-sm font-semibold">Smart Overview</div>}
            <nav className="space-y-2 text-sm mt-4">
              <SidebarItem collapsed={collapsed} label="Dashboard" icon={Folder} count={68} to={`/managements/sub-projects/${subProjectId}/dashboard`} />
              <SidebarItem collapsed={collapsed} label="Document Management" icon={Folder} count={68} to={`/managements/sub-projects/${subProjectId}/data`} />
              <SidebarItem collapsed={collapsed} label="Your Teams" icon={Users} to={`/managements/sub-projects/${subProjectId}/your-team`} />
              <SidebarItem collapsed={collapsed} label="Messages" icon={RiMessage2Fill } to={`/managements/sub-projects/${subProjectId}/messages`} />
              <SidebarItem collapsed={collapsed} label="Notifications" icon={Bell} to={`/managements/sub-projects/${subProjectId}/notifications`} />
              <SidebarItem collapsed={collapsed} label="Issues" icon={AlertCircle} count={5} color="bg-destructive/20 text-destructive" to={`/managements/sub-projects/${subProjectId}/issues`} />
              <SidebarItem collapsed={collapsed} label="RFIs" icon={FileText} count={18} color="bg-success/20 text-success" to={`/managements/sub-projects/${subProjectId}/rfis`} />
            </nav>
          </>
        ) : <LoadingState />
      }

    </aside>
  );
}

function SidebarItem({ label, icon: Icon, count, color, to, collapsed }: SidebarItemProps) {
  const router = useRouter();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isActive = pathname === to || pathname.startsWith(to + "/");

  return (
    <div
      onClick={() => router.navigate({ to })}
      className={cn(
        "flex items-center justify-between text-sm px-2.5 py-2 rounded-md cursor-pointer transition-colors",
        isActive ? "bg-accent text-accent-foreground font-semibold" : "hover:bg-muted/60"
      )}
    >
      <span className="flex items-center gap-2 w-full">
        <Icon className="w-4 h-4 shrink-0" /> {!collapsed && <span className="truncate">{label}</span>}
      </span>
      {!collapsed && count !== undefined && (
        <span className={cn("text-xs px-2 py-0.5 rounded-full text-center ml-2", color ?? "bg-muted")}>{count}</span>
      )}
    </div>
  );
}
