// TeamListSidebar.tsx
import React from "react";
import {
  Sidebar,
  Menu,
  MenuItem,
  sidebarClasses,
  menuClasses,
} from "react-pro-sidebar";
import { FiMessageSquare } from "react-icons/fi";

interface TeamListSidebarProps {
  teams: { id: number; name: string; lastMessage: string; unread?: number }[];
  selectedTeamId?: number;
  onSelectTeam: (id: number) => void;
}

export const TeamListSidebar: React.FC<TeamListSidebarProps> = ({
  teams,
  selectedTeamId,
  onSelectTeam,
}) => {
  // Có thể thêm state collapse nếu muốn
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Sidebar
      collapsed={collapsed}
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          backgroundColor: "#18181b", // Tailwind bg-zinc-900
          borderRight: "1px solid #27272a",
          minWidth: collapsed ? "80px" : "260px",
          transition: "all 0.2s",
        },
      }}
    >
      <div className="flex items-center px-4 py-3 border-b border-zinc-700">
        <button
          className="mr-2 text-zinc-400 hover:text-zinc-200"
          onClick={() => setCollapsed((v) => !v)}
        >
          {/* Icon menu/hamburger */}
          <svg width={22} height={22} viewBox="0 0 20 20">
            <rect y="3" width="20" height="2" rx="1" fill="currentColor" />
            <rect y="9" width="20" height="2" rx="1" fill="currentColor" />
            <rect y="15" width="20" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>
        {!collapsed && (
          <span className="text-lg font-bold text-white">Groups</span>
        )}
      </div>
      <Menu
        rootStyles={{
          [`.${menuClasses.menuItemRoot}`]: {
            padding: "0",
            margin: "0",
          },
        }}
      >
        {teams.map((team) => (
          <MenuItem
            key={team.id}
            icon={<FiMessageSquare size={20} />}
            active={selectedTeamId === team.id}
            onClick={() => onSelectTeam(team.id)}
            style={{
              background: selectedTeamId === team.id ? "#27272a" : undefined,
              color: "#fff",
              fontWeight: selectedTeamId === team.id ? 600 : 400,
              borderLeft: selectedTeamId === team.id ? "4px solid #2563eb" : undefined,
              borderRadius: 0,
              padding: "0 18px",
              marginBottom: 2,
            }}
          >
            <div className="flex flex-col">
              <div className="flex items-center">
                <span className="truncate">{team.name}</span>
                {team.unread ? (
                  <span className="ml-2 bg-blue-600 text-xs text-white rounded-full px-2 py-0.5">{team.unread}</span>
                ) : null}
              </div>
              <span className="text-xs text-zinc-400 truncate">
                {team.lastMessage}
              </span>
            </div>
          </MenuItem>
        ))}
      </Menu>
    </Sidebar>
  );
};
