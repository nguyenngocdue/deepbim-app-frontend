export default function ChatSessionItem({
  session,
  isActive,
  onClick,
  currentUser,
  collapsed = false, // nhận prop mới, default false
}: {
  session: any,
  isActive: boolean,
  onClick: () => void,
  currentUser: any,
  collapsed?: boolean
}) {
  const lastMsg = session.lastMessage?.content || "";
  const lastMsgIsYou = session.lastMessage?.sender_id === currentUser?.id;
  let lastTime = session.lastMessage?.created_at;
  const picture = session.user.picture;
  if (session.lastMessage?.created_at) {
    const d = new Date(session.lastMessage.created_at);
    lastTime = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  function getInitial(name: string) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "?";
}

  return (
    <div
      onClick={onClick}
      title={`Id: #${session.user.id} \nEmail: ${session.user.email}`}
      className={`
        cursor-pointer rounded-lg transition-all select-none flex items-center gap-4
        ${collapsed ? "justify-center px-0 py-2" : "px-4 py-3"}
        mb-1
        ${isActive
          ? "ring-1 ring-blue-500 bg-slate-400 dark:bg-slate-700 text-gray-900 dark:text-white"
          : "bg-slate-100 dark:bg-zinc-900 text-gray-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 hover:shadow-sm"
        }
      `}
    >
      {
          picture ? 
          <>
            <img
              src={session.user.picture}
              alt="avatar"
              className={`rounded-full object-cover border border-gray-400 shadow-slate-800
                ${collapsed ? "w-8 h-8" : "w-11 h-11"}
              `}
            />
          </> :
          <>
          <span className="w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 text-white text-2xl font-bold flex items-center justify-center shadow">
            {getInitial(session.team.name)}
          </span>
          
          </>
      }
      {!collapsed && (
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <div className="truncate text-sm font-medium text-foreground">
              {session.user.user_name || session.user.email}
            </div>
            <div className="text-xs whitespace-nowrap text-gray-400">{lastTime}</div>
          </div>
          <div className="w-full max-w-[200px]">
            <div className="truncate text-sm text-muted-foreground text-left text-slate-700 dark:text-gray-200 italic">
              {lastMsgIsYou && <span className="text-muted-foreground text-gray-100">You: </span>}
              {lastMsg}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
