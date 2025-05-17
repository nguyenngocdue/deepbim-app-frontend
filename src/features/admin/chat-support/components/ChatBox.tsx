import React, { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ChatHeader from "./ChatHeader";

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
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {messages.map((msg: any, idx: number) => (
          <div
            key={idx}
            className={`flex w-full mb-4 ${msg.from === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`
                px-4 py-2 rounded-2xl max-w-[70%] shadow-sm
                ${msg.from === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-green-400 text-gray-900"
                }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Typing indicator */}
      <div className={`h-6 px-6 text-xs text-muted-foreground italic min-h-6 transition-opacity duration-300 ${isTyping ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
        {isTyping && <span>The customer is typing...</span>}
      </div>

      {/* INPUT AREA */}
      <div className="flex gap-2 p-4 border-t bg-background shadow-inner">
        <Input
          className="flex-1 rounded-full border border-muted bg-muted px-5 py-3"
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
