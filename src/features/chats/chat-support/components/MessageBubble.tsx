
interface MessageBubbleProps {
  text: string;
  avatarUrl?: string;
  isSender: boolean;
  showAvatar: boolean;
}

export function MessageBubble({
  text,
  avatarUrl,
  isSender,    // true nếu là message của mình
  showAvatar,  // true: hiện avatar, false: không
}: MessageBubbleProps) {
  return (
    <div className={`flex items-end mb-3 ${isSender ? "flex-row-reverse" : ""}`}>
      {showAvatar && (
        <img
          src={avatarUrl || "https://ui-avatars.com/api/?name=User"}
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover border bg-white shadow mr-2 ml-2"
        />
      )}
      <div
        className={`
          px-4 py-2 rounded-2xl max-w-[70%] 
          ${isSender
            ? "bg-blue-500 text-white rounded-br-sm ml-1"
            : "bg-[#f2f3f5] text-gray-900 rounded-bl-sm mr-1"}
        `}
        style={{ wordBreak: "break-word" }}
      >
        {text}
      </div>
    </div>
  );
}
