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
  let lastTime = session.lastMessage?.created_at;
  if (session.lastMessage?.created_at) {
    const d = new Date(session.lastMessage.created_at);
    lastTime = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  return (
    <div
      onClick={onClick}
      title={`Id: #${session.user.id} \nEmail: ${session.user.email}`}
        className={`
      cursor-pointer rounded-lg transition-all select-none flex items-center gap-4 px-4 py-3 mb-1
      ${isActive
        ? "ring-1 ring-blue-200 bg-slate-200 dark:bg-slate-700 text-gray-900 dark:text-white"
        : "bg-slate-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 hover:shadow-sm"
      }
    `}

    >
      <img
        src={session.user.picture}
        alt="avatar"
        className="w-11 h-11 rounded-full object-cover border border-gray-400 shadow-slate-800"
      />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <div className="truncate text-sm font-medium text-foreground">
            {session.user.user_name || session.user.email}
          </div>
          <div className="text-xs whitespace-nowrap text-gray-400">{lastTime}</div>
        </div>
        <div className="w-full max-w-[200px]">
          <div className="truncate text-sm text-muted-foreground text-left text-slate-700 dark:text-gray-200 italic">
            {lastMsgIsYou && <span className="text-muted-foreground text-gray-100 ">You: </span>}
            {lastMsg}
          </div>
        </div>
      </div>
    </div>
  );
}
