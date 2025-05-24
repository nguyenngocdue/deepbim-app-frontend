import React from "react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { TimeOnly } from "@/components/bim-viewer/common/TimeOnly";

export function MessageBubble({
  text,
  from,
  avatar,
  userName,
  showAvatar = false,
  reaction,
  createdAt,
  seenBy = [],
  loadingSeen,
  isLastUserMessage = false, // <- prop mới
}: {
  text: string;
  from: "user" | "support" | "admin" | "member";
  avatar?: string | null;
  userName?: string | null;
  showAvatar?: boolean;
  reaction?: React.ReactNode;
  createdAt?: String;
  seenBy?: any[];
  loadingSeen?: boolean;
  isLastUserMessage?: boolean;
}) {
  const avatarSrc = avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${userName}`;
  const isUser = from === "user";

  // Tooltip title
 const seenTitle = loadingSeen
  ? "Loading viewers..."
  : seenBy.length
    ? "Seen by: " + seenBy.map(u => u.user?.user_name).join(", ")
    : "";


  // Số avatar tối đa show, những người còn lại hiển thị +N
  const MAX_AVATAR = 2;
  const mainAvatars = seenBy.slice(0, MAX_AVATAR);
  const remainCount = seenBy.length - MAX_AVATAR;

  // Chỉ hiện khi là tin nhắn cuối cùng của bạn và có người đã xem
  const showSeen = isLastUserMessage && seenBy.length > 0;

  return (
    <div
      className={`px-4 flex items-end mb-1 relative ${isUser ? "justify-end" : "justify-start"}`}
      style={{ minHeight: 40 }}
    >
      {/* Avatar bên ngoài với message của người khác */}
      {!isUser && (
        <Avatar>
          <AvatarImage src={avatarSrc} className="object-cover mr-1 rounded-full w-7 h-7" />
        </Avatar>
      )}

      <div className="relative flex flex-col max-w-[75vw]">
        {/* Bubble */}
        <div className={`flex flex-nowrap items-baseline flex-row-reverse`}>
          <div
            className={`
              relative px-4 py-1 rounded-md text-sm leading-snug break-words
              ${isUser
                ? "bg-green-500 text-white rounded-br-md"
                : "dark:bg-slate-200 text-gray-800 rounded-bl-md bg-slate-300"
              }
              shadow max-w-lg
            `}
            style={{
              borderRadius: isUser
                ? "18px 18px 6px 18px"
                : "18px 18px 18px 6px",
            }}
          >
            <div className="break-words whitespace-pre-line text-lg">{text}</div>
            <div className={`flex items-center justify-end gap-1 mt-1`}>
              {reaction && (
                <span className="text-lg select-none">{reaction}</span>
              )}
              <span className="px-1 text-zinc-200/70 dark:text-zinc-600">
                <TimeOnly isoString={createdAt?.toString() ?? ""} className="text-[10px]" />
              </span>
            </div>
          </div>
        </div>

        {/* Hiện đã xem bên dưới bubble cuối của mình */}
        {showSeen && (
          <div
            className={`
              flex items-center gap-1
              mt-1
              select-none
            `}
            title={seenTitle}
          >
            {mainAvatars.map((u, i) => (
              <img
                key={u.user?.id || u.user_id}
                src={
                  u.user?.picture ||
                  `https://api.dicebear.com/7.x/adventurer/svg?seed=${u.user?.user_name || u.user_id}`
                }
                alt={u.user?.user_name}
                className="w-5 h-5 rounded-full border-2 border-white shadow -ml-1"
                style={{ zIndex: 10 + i, background: "#fff" }}
                title={u.user?.user_name}
              />
            ))}
            {remainCount > 0 && (
              <span className="text-xs text-gray-600 bg-zinc-100 dark:bg-zinc-700 rounded-full px-1 ml-1">
                +{remainCount}
              </span>
            )}
            <span className="ml-2 text-xs text-zinc-500">
              {loadingSeen ? "Loadng..." : "seen"}
            </span>
          </div>
        )}
      </div>
      {/* Avatar của mình ngoài cùng khi gửi tin nhắn */}
      {isUser && showAvatar && (
        <img
          src={avatarSrc}
          className="w-8 h-8 rounded-full ml-2 object-cover border bg-[#444]"
          alt="avatar"
        />
      )}
    </div>
  );
}
