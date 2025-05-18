import React, { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatHeader from "./ChatHeader";
import { MessageBubble } from "../../chat-customer/components/MessageBubble";

export default function ChatBox({
  selectedSession,
  messages,
  input,
  handleInputChange,
  handleSend,
  isTyping,
}: any) {
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedSession) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground text-base">
        Select a customer to view messages
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-background">
      <ChatHeader selectedSession={selectedSession} />

      {/* CHAT MESSAGES */}
      <div  className="
            px-2
            flex-1 overflow-y-auto mb-2 space-y-2 pr-1
            scrollbar-thin
            scrollbar-thumb-zinc-500
            scrollbar-track-transparent
            hover:scrollbar-thumb-zinc-400
            dark:scrollbar-thumb-zinc-700
          ">
        {messages.map((msg, idx) => {
          const fromSunpport = msg.from === 'support' ;
          return (
            <MessageBubble
              key={idx}
              text={msg.text}
              from={msg.from}
              avatar={selectedSession?.user?.avatarUrl}
              userName={msg.userName}
              showAvatar={fromSunpport}
            />
          );
        })}
      </div>

      {/* Typing indicator */}
      <div className={`h-6 px-6 text-xs text-muted-foreground italic min-h-6 transition-opacity duration-300 ${isTyping ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        {isTyping && <span>The customer is typing...</span>}
      </div>

      {/* INPUT AREA */}
      <div className="flex gap-2 p-4 border-t bg-background shadow-inner dark:border-zinc-500">
        <Input
          className="flex-1 rounded-full border border-muted bg-muted px-5 py-3 text-50 "
          placeholder="Type your reply..."
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <Button
          onClick={handleSend}
          disabled={!input.trim()}
          className="rounded-full px-6 py-3"
        >
          Send
        </Button>
      </div>
    </div>
  );
}
