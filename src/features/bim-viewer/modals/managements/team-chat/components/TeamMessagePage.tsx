import React, { useEffect, useState, useMemo } from "react";
import { TeamListSidebar } from "./TeamListSidebar";
import { TeamInfoSidebar } from "./TeamInfoSidebar";
import { Sidebar, sidebarClasses } from "react-pro-sidebar";
import { TeamChatFeature } from "../featutes/TeamChatFeature";
import { useAppSelector } from "@/hooks/reduxHooks";
import { useTeamsByUser } from "../hooks/useTeamsByUser";
import EmptyState from "@/components/common/EmptyState";
import { LoadingState } from "@/components/common/LoadingState";

// ----- MOCK (Thay bằng API ở các hooks/feature real nếu có) -----
// ---------------------------------------------------------------

export default function TeamMessagePage() {
  const { user } = useAppSelector((state) => state.auth);
  const { teams, loading: teamsLoading } = useTeamsByUser(user);

  // State lưu id team đang chọn, mặc định chọn team đầu nếu có
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const selectedTeam = useMemo(() => teams.find((t) => t.id === selectedTeamId), [teams, selectedTeamId]);
  const [infoOpen, setInfoOpen] = useState(false); // Trạng thái mở sidebar phải


  // Khi đã load xong, tự động chọn team đầu tiên nếu chưa chọn
  useEffect(() => {
    if (!teamsLoading && teams.length && selectedTeamId == null) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, teamsLoading, selectedTeamId]);

  // Handler chọn team
  const handleSelectTeam = (id: number) => {
    setSelectedTeamId(id);
    setInfoOpen(false); // Ẩn sidebar info khi chuyển team
  };

  return (
    <div className="h-screen flex bg-zinc-950">
      {/* Sidebar team list */}
      {teamsLoading ? (
        <LoadingState />
      ) : teams.length ? (
        <TeamListSidebar
          teams={teams}
          selectedTeamId={selectedTeamId || undefined}
          onSelectTeam={handleSelectTeam}
        />
      ) : (
        <EmptyState />
      )}

      {/* Box message/chat */}
      <div className="flex-1 flex flex-col">
        {selectedTeamId && selectedTeam ? (
          <TeamChatFeature
            teamId={selectedTeamId}
            currentUser={user}
            teamName={selectedTeam.name}
            onShowInfo={() => setInfoOpen(true)}
          />
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground text-xl">
            Select a team chat to get info
          </div>
        )}
      </div>

      {/* Sidebar phải với react-pro-sidebar */}
      <Sidebar
        collapsed={!infoOpen}
        collapsedWidth="0px"
        width="320px"
        rootStyles={{
          [`.${sidebarClasses.container}`]: {
            background: "#18181b",
            borderLeft: "1px solid #27272a",
            transition: "all 0.2s",
            zIndex: 30,
            minWidth: "0px",
            maxWidth: "100vw",
          },
        }}
      >
        {/* Nút đóng sidebar phải */}
        <div className="flex justify-end p-3 border-b border-zinc-800">
          <button
            onClick={() => setInfoOpen(false)}
            className="text-zinc-400 hover:text-zinc-100 p-1"
            title="Đóng"
          >
            <svg width={22} height={22} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {/* {selectedTeam && <TeamInfoSidebar team={selectedTeam} />} */}
      </Sidebar>
    </div>
  );
}
