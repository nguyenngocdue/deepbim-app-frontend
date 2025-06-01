import { Badge } from "./ui/badge";

export default function ChatSessionItem({
  session,
  isActive,
  onClick,
  currentUser,
  collapsed = false,
  unReadNumber,
}: {
  session: any;
  isActive: boolean;
  onClick: () => void;
  currentUser: any;
  collapsed?: boolean;
  unReadNumber?: number;
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
        relative
        cursor-pointer rounded-lg transition-all select-none flex items-center gap-4
        ${collapsed ? "justify-center px-0 py-2" : "px-4 py-3"}
        mb-1
        ${isActive
          ? "ring-2 ring-blue-500 bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-300 shadow-md"
          : "bg-background text-foreground hover:bg-muted hover:dark:bg-muted-dark hover:shadow-sm"
        }
      `}
    >
      {picture ? (
        <img
          src={picture}
          alt="avatar"
          className={`
            rounded-full object-cover border border-border shadow-sm
            ${collapsed ? "w-8 h-8" : "w-11 h-11"}
          `}
        />
      ) : (
        <span
          className={`
            w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500
            text-white text-2xl font-bold flex items-center justify-center shadow-md
          `}
        >
          {getInitial(session?.team?.name ?? session?.user.user_name)}
        </span>
      )}

      {typeof unReadNumber === "number" && unReadNumber > 0 && (
        <Badge
          className="absolute top-0 left-[45px] w-6 h-6 flex items-center justify-center
          bg-red-600 rounded-full text-xs font-semibold text-white shadow-md"
          variant="outline"
        >
          {unReadNumber > 99 ? "99+" : unReadNumber}
        </Badge>
      )}

      {!collapsed && (
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center">
            <div className="truncate text-sm font-semibold text-foreground">
              {session.user.user_name || session.user.email}
            </div>
            <div className="text-xs whitespace-nowrap text-muted-foreground">
              {lastTime}
            </div>
          </div>
          <div className="w-full max-w-[200px]">
            <div className="truncate text-sm text-muted-foreground italic text-left">
              {lastMsgIsYou && (
                <span className="text-muted-foreground font-semibold mr-1">
                  You:
                </span>
              )}
              {typeof unReadNumber === "number" && unReadNumber > 0 ? (
                <span className="text-blue-600 dark:text-blue-400 font-semibold">
                  {lastMsg}
                </span>
              ) : (
                <span>{lastMsg}</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
