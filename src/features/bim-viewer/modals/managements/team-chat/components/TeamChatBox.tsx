import React, { useRef, useEffect } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"; // Update path theo dự án của bạn
import { MessageBubble } from "@/features/chats/chat-customer/components/MessageBubble";

export interface Message {
  id: number;
  sender: string;
  content: string;
  created_at: string;
  avatar?: string;
  userName?: string;
  // ... các field khác nếu có
}

interface TeamChatBoxProps {
  teamId: number;
  messages: Message[];
  onSend: (message: string) => void;
  teamName?: string;
  onShowInfo?: () => void; // Mở sidebar phải
}

const currentUserName = "You"; // Thực tế lấy từ context/store

export const TeamChatBox: React.FC<TeamChatBoxProps> = ({
  messages,
  onSend,
  teamName,
  onShowInfo,
}) => {
  const [input, setInput] = React.useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
    <main className="flex flex-col flex-1 bg-zinc-950">
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
            <DropdownMenuItem
              onClick={() => {
                onShowInfo && onShowInfo();
              }}
            >
              Show information group
            </DropdownMenuItem>
            {/* Thêm các item menu khác nếu muốn */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3">
        {messages.map((msg) => {
          const isMe = msg.sender === currentUserName;
          return (
            <div key={msg.id}>
              <MessageBubble
                text={msg.content}
                from={isMe ? "user" : "support"}
                avatar={msg.avatar}
                userName={msg.sender}
                showAvatar={!isMe}
              />
              <div
                className={`text-xs mt-1 px-2 ${
                  isMe ? "text-right text-zinc-400" : "text-left text-zinc-500"
                }`}
              >
                {!isMe && msg.sender}{" "}
                <span className="ml-2 text-xs">{msg.created_at}</span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-zinc-800 bg-zinc-900 flex gap-2"
      >
        <input
          className="flex-1 rounded bg-zinc-800 px-4 py-2 text-sm outline-none"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="rounded bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </main>
  );
};
