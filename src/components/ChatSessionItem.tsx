export default function ChatSessionItem({
  session,
  isActive,
  onClick,
  currentUser,
}: {
  session: any,
  isActive: boolean,
  onClick: () => void,
  currentUser: any,
}) {
  const lastMsg = session.lastMessage?.content || "";
  const lastMsgIsYou = session.lastMessage?.sender_id === currentUser?.id;
  let lastTime = "";
  if (session.lastMessage?.created_at) {
    const d = new Date(session.lastMessage.created_at);
    lastTime = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return (
    <div
      onClick={onClick}
      title={`Id: #${session.user.id} \nEmail: ${session.user.email}`}
      className={`
        cursor-pointer rounded-md transition-all select-none flex items-center gap-4 px-3 py-3 
        ${isActive ? "ring-2 ring-primary/40 bg-muted" : "hover:bg-muted hover:shadow-sm hover:scale-[1.01]"}
        mb-1
      `}
    >
      <img
        src={session.user.picture}
        alt="avatar"
        className="w-11 h-11 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <div className="truncate text-sm font-medium text-foreground">
            {session.user.user_name || session.user.email}
          </div>
          <div className="text-xs text-muted-foreground whitespace-nowrap">{lastTime}</div>
        </div>
        <div className="w-full max-w-[200px]">
          <div className="truncate text-sm text-muted-foreground text-left">
            {lastMsgIsYou && <span className="font-semibold text-muted-foreground">You: </span>}
            {lastMsg}
          </div>
        </div>
      </div>
    </div>
  );
}
