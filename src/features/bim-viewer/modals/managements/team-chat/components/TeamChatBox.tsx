import React, { useRef, useEffect, useState, useCallback } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"; // Update path theo dự án của bạn
import { MessageBubble } from "@/features/chats/chat-customer/components/MessageBubble";
import { ShowInfoMenuItem } from "./ShowInfoMenuItem";
import { Input } from "@/components/ui/input";
import { TypingIndicator } from "@/components/common/TypingIndicator";
import { useAppSelector } from "@/hooks/reduxHooks";
import { CLASS_NAME_DEFAULT } from "@/utils/class";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/common/LoadingState";
import { IoIosSend } from "react-icons/io";

export interface Message {
  id: number;
  sender: string;
  content: string;
  created_at: string;
  avatar?: string;
  userName?: string;
}

interface TeamChatBoxProps {
  teamId: number;
  messages: Message[];
  onSend: (message: string) => void;
  sendTyping: () => void;
  teamName?: string;
  onShowInfo?: () => void; // Mở sidebar phải
  typingUsers: [];
  loadingMessage: boolean
}

export const TeamChatBox: React.FC<TeamChatBoxProps> = ({
  messages,
  onSend,
  teamName,
  onShowInfo,
  sendTyping,
  typingUsers,
  loadingMessage,
}) => {
  const [input, setInput] = React.useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAppSelector((state) => state.auth);
  const [currentUser, setCurrentUser] = useState<typeof user>(user);

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };


  return (
    <main className="flex flex-col flex-1 h-svh  overflow-y-auto ">
      {/* Header */}
      <div className="px-6 py-3 border-b border-gray-400 bg-muted flex items-center justify-between gap-3 bg-zinc-950 ">
        <div className="flex items-center gap-3">
          <div className="text-lg text-slate-200 dark:text-slate-300">{teamName || "Team Chat"}</div>
        </div>
        {/* Nút 3 chấm menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-400 focus:outline-none"
              aria-label="More"
              type="button"
            >
              <MoreHorizontal  className="text-gray-700 " size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={6} className="min-w-[180px] border border-gray-500">
            <ShowInfoMenuItem onClick={onShowInfo} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Message List */}
      <div className="
            p-4
            bg-slate-200
            dark:bg-slate-800
            flex-1 overflow-y-auto mb-2 space-y-2 pr-1
            scrollbar-thin
            scrollbar-thumb-zinc-500
            scrollbar-track-transparent
            hover:scrollbar-thumb-zinc-400
            dark:scrollbar-thumb-zinc-700
          ">
        {
          loadingMessage ? <LoadingState /> :
            (<>
              {messages.map((msg) => {
                const isMe = currentUser && String(msg.sender_id) === String(currentUser.id);
                return (
                  <div key={msg.id}>
                    <MessageBubble
                      text={msg.content}
                      from={isMe ? "user" : "admin"}
                      avatar={msg.avatar}
                      userName={msg.sender}
                      showAvatar={!isMe}
                      createdAt={msg.created_at}
                    />
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </>
            )
        }
      </div>
      <TypingIndicator typingUsers={typingUsers} currentUserId={currentUser?.id} />

      {/* Input */}
      <form
        onSubmit={handleSend}
        className=" ml-2 p-2 border-t border-gray-400 bg-muted flex gap-2 border-r-0"
      >
        <div className="flex items-center gap-4 justify-stretch w-full">
          <textarea
            className="flex-1 py-1 rounded px-4 text-sm outline-none dark:bg-slate-500 dark:text-gray-100 bg-slate-200 text-gray-700 "
            placeholder="Type a message..."
            value={input}
            onChange={e => {
              setInput(e.target.value);
              sendTyping();
            }}
            rows={2}


            onKeyDown={e => {
              if (e.key === "Enter" && !e.ctrlKey) {
                e.preventDefault();  // Chặn xuống dòng
                if (input.trim()) {
                  onSend(input.trim());
                  setInput("");
                }
              } else if (e.key === "Enter" && e.ctrlKey) {
                // Cho phép xuống dòng khi Ctrl+Enter
                setInput(input + "\n");
              }
            }}


          />
          <Button
            type="submit"
            className={`${CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_CREATE}`}
          >
            <IoIosSend />
            Send
          </Button>
        </div>
      </form>
    </main>
  );
};
