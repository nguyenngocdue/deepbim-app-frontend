import ChatSessionItem from "@/components/ChatSessionItem";
import React from "react";
import { Sidebar, sidebarClasses } from "react-pro-sidebar";
import { SearchBox } from "@/components/SearchBox"; // Import SearchBox
import { useUnreadCountsRealtime } from "../hooks/useUnreadCountsRealtime";

interface TeamListSidebarProps {
  teams: {
    id: number;
    name: string;
    lastMessage?: {
      content: string;
      sender_id?: number;
      created_at?: string;
    };
    unread?: number;
    mediaAvatar?: { url?: string };
    avatar_temp?: string;
  }[];
  selectedTeamId?: number;
  onSelectTeam: (id: number) => void;
  currentUser: any;
}

export const TeamListSidebar: React.FC<TeamListSidebarProps> = ({
  teams,
  selectedTeamId,
  onSelectTeam,
  currentUser,
}) => {
  const [collapsed, setCollapsed] = React.useState(Boolean(localStorage.getItem('collapsed_team_chat')) || false);

  // State tìm kiếm
  const [search, setSearch] = React.useState("");

  // Filter team theo tên hoặc nội dung tin nhắn cuối
  const filteredTeams = React.useMemo(() => {
    if (!search.trim()) return teams;
    const lower = search.trim().toLowerCase();
    return teams.filter(
      (team) =>
        team.name.toLowerCase().includes(lower) ||
        (team.lastMessage?.content?.toLowerCase() || "").includes(lower)
    );
  }, [teams, search]);

    const unreadCounts = useUnreadCountsRealtime(currentUser?.id);


  return (
    
    <Sidebar
      collapsed={collapsed}
      width="350px"
      breakPoint="lg"
       className="max-h-[90vh] overflow-y-auto overflow-hidden"
      rootStyles={{
        [`.${sidebarClasses.container}`]: {
          background: "linear-gradient(135deg,#18181b 70%,#23242a 100%)",
          minWidth: collapsed ? "100px" : "250px",
          borderRight: "1px solid #283046",
          borderLeft: "1px solid #283046",
          borderTop: "1px solid #283046",
          borderBottom: "1px solid #283046",
          transition: "all 0.2s cubic-bezier(.4,0,.2,1)",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          paddingBottom:"10px",
        },
      }}
    >
      {/* HEADER */}
      <div className="
        w-full flex items-center px-5 h-14
        border-b border-zinc-700 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-800
        sticky top-0 z-50
        shadow-lg shadow-zinc-600 
        ">
        <button
          className="mr-3 rounded-full p-1 bg-zinc-800 hover:bg-zinc-700 transition-colors"
          onClick={() => {
            setCollapsed((v) => !v)
            localStorage.setItem('collapsed_team_chat', String(collapsed))
          }}
        >
          <svg width={20} height={20} viewBox="0 0 20 20">
            <rect y="3" width="20" height="2" rx="1" fill="currentColor" />
            <rect y="9" width="20" height="2" rx="1" fill="currentColor" />
            <rect y="15" width="20" height="2" rx="1" fill="currentColor" />
          </svg>
        </button>
        {!collapsed && (
          <span className="text-lg font-bold tracking-wide text-white select-none">Groups</span>
        )}
      </div>

      {/* SEARCH */}
      {!collapsed && (
        <div className="px-3 pt-4">
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search group or message..."
          />
        </div>
      )}

      {/* DANH SÁCH NHÓM */}
      <div
        className={`
          flex-1 overflow-y-auto px-2 py-3
          bg-[#20222b] dark:bg-[#18181b]
          space-y-2
          scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent
        `}
        style={{
          minHeight: 0,
        }}
      >
        {filteredTeams.map((team) => {
          const session = {
            team: team,
            user: {
              id: team.id,
              user_name: team.name,
              email: "",
              picture: team?.mediaAvatar?.url || team.avatar_temp,
            },
            lastMessage: {
              content: team.lastMessage?.content,
              sender_id: team.lastMessage?.sender_id,
              created_at: team.lastMessage?.created_at,
            },
          };
          return (
            <ChatSessionItem
              key={team.id}
              session={session}
              isActive={selectedTeamId === team.id}
              onClick={() => onSelectTeam(team.id)}
              currentUser={currentUser}
              collapsed={collapsed}
              unReadNumber={unreadCounts[team.id]}
            />
          );
        })}
        {filteredTeams.length === 0 && (
          <div className="text-muted-foreground text-sm text-center pt-10 min-w-[260px] italic opacity-70">
            No groups found.
          </div>
        )}
      </div>
    </Sidebar>
  );
};
