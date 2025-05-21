import ChatSessionItem from "@/components/ChatSessionItem";
import React from "react";
import { Sidebar, sidebarClasses } from "react-pro-sidebar";

interface TeamListSidebarProps {
  teams: {
    id: number;
    name: string;
    lastMessage?: {
      content: string;
      sender_id?: number;
      create_at?: string;
    };
    lastMessageTime?: string;
    unread?: number;
  }[];
  selectedTeamId?: number;
  onSelectTeam: (id: number) => void;
  currentUser: any; // Truyền user hiện tại vào để so sánh với sender
}

export const TeamListSidebar: React.FC<TeamListSidebarProps> = ({
  teams,
  selectedTeamId,
  onSelectTeam,
  currentUser,
}) => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <Sidebar
      collapsed={collapsed}
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          backgroundColor: "#18181b",
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
      <div className="px-2 py-2 ">
        {teams.map((team) => {
          // Tạo object session cho mỗi team
          const session = {
            user: {
              id: team.id,
              user_name: team.name,
              email: "",
              picture: team?.mediaAvatar?.url || team.avatar_temp, // Ảnh đại diện mặc định cho team
            },
            lastMessage: {
              content: team.lastMessage?.content,
              sender_id: team.lastMessage?.sender_id,
              created_at: team.lastMessage?.create_at,
            },
          };
          return ( 
            <ChatSessionItem
              key={team.id}
              session={session}
              isActive={selectedTeamId === team.id}
              onClick={() => onSelectTeam(team.id)}
              currentUser={currentUser}
            />
          );
        })}
        {teams.length === 0 && (
          <div className="text-muted-foreground text-sm text-center pt-8">
            No groups yet.
          </div>
        )}
      </div>
    </Sidebar>
  );
};
