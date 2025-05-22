import { TimeOnly } from "@/components/bim-viewer/common/TimeOnly";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import React from "react";
import ReactMarkdown from 'react-markdown';

export function MessageBubble({
  text,
  from,
  avatar,
  userName,
  showAvatar = false,
  reaction,
  createdAt,
}: {
  text: string;
  from: "user" | "support" | "admin" | "member";
  avatar?: string | null;
  userName?: string | null;
  showAvatar?: boolean;
  reaction?: React.ReactNode;
  createdAt?: String;
}) {
  // Nếu không có avatar, render avatar ảo
  const avatarSrc = avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${userName}`;

  const isUser = from === "user";
  return (
    <div className={`px-4 flex items-end mb-1 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <Avatar>
          <AvatarImage src={avatarSrc} className="w-7 h-7 object-cover rounded-full mr-1" />
        </Avatar>
      )}
      <div className="relative flex flex-col">
        <div className={`flex flex-nowrap items-baseline flex-row-reverse `}>
          <div
            className={`
          relative max-w-[75vw] px-4 py-1 rounded-md text-sm leading-snug break-words
          ${isUser
                ? "bg-green-500 text-white rounded-br-md"
                : "dark:bg-slate-200 text-gray-800 rounded-bl-md bg-slate-300"
              }
          shadow
        `}
            style={{
              borderRadius: isUser
                ? "18px 18px 6px 18px"
                : "18px 18px 18px 6px",
            }}
          >
            <div className="whitespace-pre-line break-words text-sm max-w-lg">
              {/* <ReactMarkdown>{text}</ReactMarkdown> */}
              {text}
            </div>

            <div className={`flex items-center justify-end gap-1 mt-1`}>
              {reaction && (
                <span className="text-lg select-none">{reaction}</span>
              )}
              <span className=" text-zinc-200/70 dark:text-zinc-600 px-1">
                <TimeOnly isoString={createdAt?.toString() ?? ""} className="text-[10px]"/>
              </span>
            </div>


          </div>
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
