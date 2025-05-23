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

interface TeamMessagePageProps {
  teamId?: number | null;
}

export default function TeamMessagePage({ teamId }: TeamMessagePageProps) {
  const { user } = useAppSelector((state) => state.auth);
  const { teams, loading: teamsLoading } = useTeamsByUser(user);

  // State lưu id team đang chọn, mặc định chọn team đầu nếu có
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>();
  const selectedTeam = useMemo(() => teams.find((t) => t.id === selectedTeamId), [teams, selectedTeamId]);
  const [infoOpen, setInfoOpen] = useState(false); // Trạng thái mở sidebar phải


  // Khi đã load xong, tự động chọn team đầu tiên nếu chưa chọn
  useEffect(() => {
    if (!teamsLoading && teams.length && selectedTeamId == null) {
      setSelectedTeamId(teams[0].id);
    }
    if (teamsLoading) {
      setSelectedTeamId(Number(teamId));
    }
  }, [teams, teamsLoading, selectedTeamId]);


  // Handler chọn team
  const handleSelectTeam = (id: number) => {
    setSelectedTeamId(id);
    setInfoOpen(false); // Ẩn sidebar info khi chuyển team
  };

  return (
    <>
       {
          // !teamsLoading ?  
          // <div className="flex m-auto justify-center h-full w-full">
          //   <LoadingState /> 
          // </div>
          // :
          <div className="h-full flex  overflow-hidden  dark:bg-[#1F293B]">
            {/* Sidebar team list */}
            {teamsLoading ? (
              <LoadingState />
            ) : teams.length ? (
                  <TeamListSidebar
                    teams={teams}
                    selectedTeamId={selectedTeamId || undefined}
                    onSelectTeam={handleSelectTeam}
                    currentUser={user}
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

            {
              teamsLoading ?
                <LoadingState /> :
                <>
                    {selectedTeam && <TeamInfoSidebar team={selectedTeam} />}
                </>
            }


          </div>
      }
    </>
  );
}
