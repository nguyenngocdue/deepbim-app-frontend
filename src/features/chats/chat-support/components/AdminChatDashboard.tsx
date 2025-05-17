import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useAdminChatSocket } from "../hooks/useAdminChatSocket";
import ChatSidebar from "./ChatSidebar";
import ChatBox from "./ChatBox";
import ChatUserInfoPanel from "./ChatUserInfoPanel";

export default function AdminChatDashboard() {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const chatSocket = useAdminChatSocket(currentUser?.id);

  if (!currentUser) return null;

  return (
    <div className="flex w-full h-[80vh] rounded-lg border bg-background shadow mx-auto overflow-hidden">
      <ChatSidebar {...chatSocket} />
      <ChatBox {...chatSocket} />
      <ChatUserInfoPanel selectedSession={chatSocket.selectedSession} />
    </div>
  );
}
