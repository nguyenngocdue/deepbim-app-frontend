// components/team-chat/TeamMessagePage.tsx
import React, { useState } from "react";
import { TeamListSidebar } from "./TeamListSidebar";
import { TeamChatBox } from "./TeamChatBox";
import { TeamInfoSidebar } from "./TeamInfoSidebar";
import { Sidebar, sidebarClasses } from "react-pro-sidebar";
// Mock data mẫu
const TEAMS = [
  {
    id: 1,
    name: "Frontend Devs",
    lastMessage: "Đã deploy bản mới 🚀",
    unread: 3,
    description: "Nhóm phát triển giao diện",
    members: [
      { id: 1, name: "A", role: "Leader" },
      { id: 2, name: "B", role: "Member" },
      { id: 3, name: "C", role: "Member" },
    ],
  },
   {
    id: "user_123",
    type: "user",
    name: "Nguyen Van A",
    lastMessage: "Gửi cho bạn tài liệu rồi nhé",
    unread: 1,
    avatar: "https://i.pravatar.cc/300?u=123",
  },
  {
    id: 2,
    name: "Backend Devs",
    lastMessage: "API lỗi 500 rồi kìa",
    unread: 0,
    description: "Nhóm backend, API & DB",
    members: [
      { id: 4, name: "D", role: "Leader" },
      { id: 2, name: "B", role: "Member" },
    ],
  },
];

const MSGS: Record<number, any[]> = {
  1: [
    { id: 1, sender: "A", content: "Hello team!", created_at: "09:00", self: false },
    { id: 2, sender: "You", content: "Hi mọi người!", created_at: "09:01", self: true },
    { id: 3, sender: "B", content: "Code tới đâu rồi?", created_at: "09:03", self: false },
  ],
  2: [
    { id: 1, sender: "D", content: "API ready", created_at: "08:00", self: false },
    { id: 2, sender: "You", content: "OK, test nhé", created_at: "08:03", self: true },
  ],
};


export default function TeamMessagePage() {
  const [selectedTeamId, setSelectedTeamId] = useState<number>(TEAMS[0].id);
  const selectedTeam = TEAMS.find((t) => t.id === selectedTeamId);
  const [messages, setMessages] = useState(MSGS[selectedTeamId] || []);
  const [infoOpen, setInfoOpen] = useState(false); // Trạng thái mở sidebar phải

  React.useEffect(() => {
    setMessages(MSGS[selectedTeamId] || []);
  }, [selectedTeamId]);

  const handleSend = (text: string) => {
    setMessages((msgs) => [
      ...msgs,
      {
        id: msgs.length + 1,
        sender: "You",
        content: text,
        created_at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        self: true,
      },
    ]);
  };

  return (
    <div className="h-screen flex bg-zinc-950">
      {/* Sidebar team list */}
      <TeamListSidebar
        teams={TEAMS}
        selectedTeamId={selectedTeamId}
        onSelectTeam={setSelectedTeamId}
      />
      {/* Box message */}
      <div className="flex-1 flex flex-col">
        <TeamChatBox
          teamId={selectedTeamId}
          messages={messages}
          onSend={handleSend}
          teamName={selectedTeam?.name}
          onShowInfo={() => setInfoOpen(true)} // Nhận sự kiện mở info
        />
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
        <TeamInfoSidebar team={selectedTeam} />
      </Sidebar>
    </div>
  );
}