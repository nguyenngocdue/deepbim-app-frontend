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
    <main className="flex flex-col flex-1 bg-zinc-950 overflow-y-auto">
      {/* Header */}
      <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="text-lg font-bold">{teamName || "Team Chat"}</div>
        </div>
        {/* Nút 3 chấm menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 focus:outline-none"
              aria-label="More"
              type="button"
            >
              <MoreHorizontal size={22} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={6} className="min-w-[180px]">
            <ShowInfoMenuItem onClick={onShowInfo} />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Message List */}
      <div className="
            px-4
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
        className="p-4 border-t border-zinc-800 bg-zinc-900 flex gap-2"
      >
        <textarea
          className="flex-1 rounded bg-zinc-800 px-4 py-2 text-sm outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={e => {
            setInput(e.target.value);
            sendTyping();
          }}
          rows={2}
        />
        <Button
          type="submit"
          className={`${CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_CREATE}`}
        >
          Send
        </Button>
      </form>
    </main>
  );
};
