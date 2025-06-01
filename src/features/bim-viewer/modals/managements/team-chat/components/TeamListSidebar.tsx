import React, { useState, useMemo, useEffect } from "react";
import ChatSessionItem from "@/components/ChatSessionItem";
import { SearchBox } from "@/components/SearchBox";
import { useUnreadCountsRealtime } from "../hooks/useUnreadCountsRealtime";

interface Team {
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
}

interface TeamListSidebarProps {
  teams: Team[];
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
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("collapsed_team_chat");
    return saved === "true";
  });

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(handler);
  }, [search]);

  const filteredTeams = useMemo(() => {
    if (!debouncedSearch.trim()) return teams;
    const lower = debouncedSearch.trim().toLowerCase();
    return teams.filter(
      (team) =>
        team.name.toLowerCase().includes(lower) ||
        (team.lastMessage?.content?.toLowerCase() || "").includes(lower)
    );
  }, [teams, debouncedSearch]);

  const unreadCounts = useUnreadCountsRealtime(currentUser?.id);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      localStorage.setItem("collapsed_team_chat", String(!prev));
      return !prev;
    });
  };

  return (
    <aside
      className={`flex flex-col h-full transition-all duration-200
        ${collapsed ? "w-16" : "w-72"}
        bg-background
        border border-gray-200 dark:border-gray-700
        shadow-sm
      `}
    >
      {/* HEADER */}
      <div
        className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-gray-700
          bg-gradient-to-r 
          sticky top-0 z-10"
      >
        <button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={toggleCollapsed}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors"
        >
          <svg width={20} height={20} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={1.5}>
            <rect y="3" width="20" height="2" rx="1" />
            <rect y="9" width="20" height="2" rx="1" />
            <rect y="15" width="20" height="2" rx="1" />
          </svg>
        </button>
        {!collapsed && (
          <h2 className="ml-3 text-lg font-semibold select-none text-gray-900 dark:text-gray-100">
            Groups
          </h2>
        )}
      </div>

      {/* SEARCH */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder="Search group or message..."
          />
        </div>
      )}

      {/* TEAM LIST */}
      <div
        className="flex-1 overflow-y-auto px-2 py-3 space-y-2
          bg-background
          scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-zinc-600 scrollbar-track-transparent"
        style={{ minHeight: 0 }}
      >
        {filteredTeams.length === 0 && (
          <div className="text-muted-foreground text-sm text-center pt-10 italic opacity-70">
            No groups found.
          </div>
        )}

        {filteredTeams.map((team) => {
          const session = {
            team,
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
      </div>
    </aside>
  );
};
