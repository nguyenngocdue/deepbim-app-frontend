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
          backgroundColor: "#1F293B",
          minWidth: collapsed ? "80px" : "260px",
          borderRight: "1px solid #9ca3af",
          transition: "all 0.2s",
        },
      }}
    >
      <div className="w-full flex items-center px-4 py-4 border-b bg-muted border-gray-400 bg-zinc-950">
        <button
          className="mr-2 text-zinc-500 hover:text-zinc-400"
          onClick={() => setCollapsed((v) => !v)}
        >
          <svg width={22} height={22} viewBox="0 0 20 20">
            <rect y="3" width="20" height="2" rx="1" fill="currentColor" />
            <rect y="9" width="20" height="2" rx="1" fill="currentColor" />
            <rect y="15" width="20" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>
        {!collapsed && (
          <span className="text-lg font-bold  dark:text-slate-100 text-slate-200">Groups</span>
        )}
      </div>
      <div className=" px-2 py-2 bg-muted bg-[#1F293B]">
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
          <div className="text-muted-foreground text-sm text-center pt-8 min-w-[260px]">
            No groups yet.
          </div>
        )}
      </div>
    </Sidebar>
  );
};
