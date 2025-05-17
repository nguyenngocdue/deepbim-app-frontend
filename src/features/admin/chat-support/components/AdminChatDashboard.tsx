import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useAdminChatSocket } from "../hooks/useAdminChatSocket";
import ChatSidebar from "./ChatSidebar";
import ChatBox from "./ChatBox";

export default function AdminChatDashboard() {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const chatSocket = useAdminChatSocket(currentUser?.id);

  if (!currentUser) return null;

  return (
    <div className="flex h-[100vh] overflow-hidden">
      <ChatSidebar {...chatSocket} />
      <ChatBox {...chatSocket} />
    </div>
  );
}
