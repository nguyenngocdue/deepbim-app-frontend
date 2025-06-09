import React, { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { MessageBubble } from "@/features/chats/chat-customer/components/MessageBubble";
import { TypingIndicator } from "@/components/common/TypingIndicator";
import { Button } from "@/components/ui/button";
import { IoIosSend } from "react-icons/io";
import { LoadingState } from "@/components/common/LoadingState";
import { useAppSelector } from "@/hooks/reduxHooks";

export interface Message {
  id: number;
  sender: string;
  sender_id?: number;
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
  typingUsers: [];
  loadingMessage: boolean;
  markMessageAsRead?: (messageId: number) => void;
  readersMap?: { [msgId: number]: any[] };
}

export const TeamChatBox: React.FC<TeamChatBoxProps> = ({
  teamId,
  messages,
  onSend,
  teamName,
  sendTyping,
  typingUsers,
  loadingMessage,
  markMessageAsRead,
  readersMap = {},
}) => {
  const [input, setInput] = useState("");
  const { user } = useAppSelector((state) => state.auth);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  console.log(messages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  const [maxReadId, setMaxReadId] = useState(0);
  useEffect(() => {
    setMaxReadId(0);
  }, [teamId]);

  const lastMsg = messages[messages.length - 1];
  const { ref: lastMsgRef, inView: lastMsgInView } = useInView({
    threshold: 0.7,
    triggerOnce: false,
  });

  useEffect(() => {
    if (
      lastMsgInView &&
      lastMsg?.id &&
      lastMsg.id > maxReadId &&
      markMessageAsRead
    ) {
      setMaxReadId(lastMsg.id);
      markMessageAsRead(lastMsg.id);
    }
  }, [lastMsgInView, lastMsg, markMessageAsRead, maxReadId]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-background border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Header */}
      <div
        className="
          flex items-center justify-between px-6 py-3 h-14 
          border-b border-gray-200/20 dark:border-zinc-700/20
          bg-muted
          select-none
        "
      >
        <span className="text-lg font-bold text-foreground">{teamName || "Team Chat"}</span>
      </div>

      {/* Messages list */}
      <div
        className="
          flex-1 overflow-y-auto p-4 space-y-3
          scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent min-h-0
          bg-background
          border-b border-gray-200/20 dark:border-zinc-700/20
        "
      >
        {loadingMessage ? (
          <LoadingState />
        ) : (
          <>
            {messages.map((msg, idx) => {
              const isMe = user && String(msg.sender_id) === String(user.id);

              const isLastUserMessage =
                isMe &&
                messages
                  .slice(idx + 1)
                  .findIndex((m) => String(m.sender_id) === String(user.id)) === -1;

              const ref = idx === messages.length - 1 ? lastMsgRef : undefined;

              return (
                <div key={msg.id} ref={ref}>
                  <MessageBubble
                    text={msg.content}
                    from={isMe ? "user" : "admin"}
                    avatar={msg.avatar}
                    userName={msg.sender}
                    showAvatar={!isMe}
                    createdAt={msg.created_at}
                    seenBy={readersMap[msg.id] || []}
                    loadingSeen={false}
                    isLastUserMessage={isLastUserMessage ?? undefined}
                  />
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input form */}
      <form
        onSubmit={handleSend}
        className="relative flex items-center gap-2 px-4 pb-2 pt-2 border-t border-gray-200/20 dark:border-zinc-700/20 bg-muted "
      >
        <TypingIndicator typingUsers={typingUsers} currentUserId={user?.id} />
        <textarea
          className="
            flex-1 px-4 py-2 text-base rounded-xl border
            bg-background border-gray-200/20 dark:border-zinc-700/20
            text-foreground
            resize-none
            focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
            transition
          "
          placeholder={`Type a message to "${teamName}"`}
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            sendTyping();
          }}
          rows={2}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.ctrlKey) {
              e.preventDefault();
              if (input.trim()) handleSend();
            } else if (e.key === "Enter" && e.ctrlKey) {
              setInput(input + "\n");
            }
          }}
        />
        <Button
          type="submit"
          className="rounded-xl px-4 h-10 flex items-center gap-2 shadow-md bg-purple-300 dark:bg-purple-300 text-primary-foreground disabled:opacity-50"
          disabled={!input.trim()}
          title="Send"
        >
          <IoIosSend size={22} />
        </Button>
      </form>
    </div>
  );
};
