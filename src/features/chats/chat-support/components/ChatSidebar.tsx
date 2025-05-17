import { ConversationItem } from "@/features/admin/chat-support/components/ConversationItem";
import React from "react";

export default function ChatSidebar({
  sessions,
  selectedSession,
  setSelectedSession,
  currentUser
}: any) {
  return (
    <aside className="w-[330px] bg-background border-r h-full flex flex-col font-sans">
      {/* Header */}
      <div className="h-14 flex items-center px-5 border-b text-lg font-semibold text-primary">
        All messages
      </div>
      {/* List conversation */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 pt-2 bg-background">
        {sessions.map((s: any) => {
          const lastMsg = s.lastMessage?.content || "";
          const lastMsgIsYou = s.lastMessage?.sender_id === currentUser?.id;
          let lastTime = "";
          if (s.lastMessage?.created_at) {
            const d = new Date(s.lastMessage.created_at);
            lastTime = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          }
          const isActive = selectedSession?.id === s.id;
          return (
            <div
              key={s.id}
              onClick={() => setSelectedSession(s)}
              className={`
                cursor-pointer rounded-lg transition-all select-none flex items-center gap-4 px-3 py-3
                ${isActive ? "ring-2 ring-primary/40 bg-muted" : "hover:bg-muted hover:shadow-sm hover:scale-[1.01]"}
                mb-1
              `}
            >
              <img
                src={s.user.avatarUrl}
                alt="avatar"
                className="w-11 h-11 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <div className="truncate text-sm font-medium text-foreground">
                    {s.user.user_name || s.user.email}
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">{lastTime}</div>
                </div>
                <div className="truncate text-sm text-muted-foreground">
                  {lastMsgIsYou && <span className="font-semibold text-muted-foreground">You: </span>}
                  {lastMsg}
                </div>
              </div>
            </div>
          );
        })}
        {sessions.length === 0 && (
          <div className="text-muted-foreground text-sm text-center pt-8">No conversations yet.</div>
        )}
      </div>
    </aside>
  );
}
