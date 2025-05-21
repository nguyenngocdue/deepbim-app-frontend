import ChatSessionItem from "@/components/ChatSessionItem";

export default function ChatSidebar({
  sessions,
  selectedSession,
  setSelectedSession,
  currentUser,
}: any) {
  
  return (
    <aside className="w-[330px] bg-background border-r dark:border-zinc-500 border-gray-300 h-full flex flex-col font-sans">
      {/* Header */}
      <div className="h-14 flex items-center px-5 border-b dark:border-zinc-500 border-gray-300 text-lg font-semibold text-50">
        All messages
      </div>
      {/* List conversation */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 pt-2 bg-background">
        {sessions.map((s: any) => (
          <ChatSessionItem
            key={s.id}
            session={s}
            isActive={selectedSession?.id === s.id}
            onClick={() => setSelectedSession(s)}
            currentUser={currentUser}
          />
        ))}
        {sessions.length === 0 && (
          <div className="text-muted-foreground text-sm text-center pt-8">
            No conversations yet.
          </div>
        )}
      </div>
    </aside>
  );
}
