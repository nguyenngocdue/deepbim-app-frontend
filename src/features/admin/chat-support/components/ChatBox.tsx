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
      <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
        Select a customer to view messages
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col items-stretch justify-stretch relative">
      <div className="flex flex-col h-full w-full">
        <ChatHeader selectedSession={selectedSession} />
        {/* CHAT MESSAGES */}
        <div className="flex-1 px-6 py-3 flex flex-col overflow-y-auto bg-[#f5f6fa]">
          {messages.map((msg: any, idx: number) => (
            <div
              key={idx}
              className={`flex w-full mb-2 ${msg.from === "user" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`px-4 py-2 rounded-2xl text-sm max-w-[70%] shadow
                  ${msg.from === "user"
                    ? "bg-white text-gray-900 border border-gray-200"
                    : "bg-blue-500 text-white border border-blue-400"
                  }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Typing indicator */}
        <div className={`h-6 px-6 text-xs text-gray-400 min-h-6 transition-opacity duration-300 ${isTyping ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
          {isTyping && <span>The customer is typing...</span>}
        </div>

        {/* INPUT AREA */}
        <div className="flex gap-2 p-5 border-t bg-white shadow-inner z-20">
          <Input
            className="flex-1 border rounded-2xl bg-[#f7f7fb]"
            placeholder="Type your reply..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim()}
            className="rounded-2xl px-6"
          >
            Send
          </Button>
        </div>
      </div>
    </main>
  );
}
