import React from "react";

export function MessageBubble({
  text,
  from,
  avatar,
  userName,
  showAvatar = false,
  reaction,
}: {
  text: string;
  from: "user" | "support";
  avatar?: string | null;
  userName?: string | null;
  showAvatar?: boolean;
  reaction?: React.ReactNode;
}) {
  // Nếu không có avatar, render avatar ảo
  const avatarSrc =
    avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || "U")}&background=444&color=fff&size=64`;

  const isUser = from === "user";

  return (
    <div className={`flex items-end mb-2 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && showAvatar && (
        <img
          src={avatarSrc}
          className="w-8 h-8 rounded-full mr-2 object-cover border bg-[#444]"
          alt="avatar"
        />
      )}
      <div className="relative flex flex-col">
        <div
          className={`
            max-w-[75vw] px-4 py-2 rounded-2xl text-base leading-snug break-words
            ${isUser
              ? "bg-green-500 text-white rounded-br-md"
              : "bg-gray-200 text-gray-800 rounded-bl-md"
            }
          `}
          style={{
            borderRadius: isUser
              ? "20px 20px 5px 20px"
              : "20px 20px 20px 5px",
          }}
        >
          {text}
        </div>
        {reaction && (
          <span className="absolute -bottom-5 right-2 text-xl select-none">{reaction}</span>
        )}
      </div>
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
