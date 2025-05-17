import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { MessageBubble } from "./MessageBubble";

/**
 * CustomerChatBox - The main chat box UI for the customer.
 * 
 * Props:
 * - messages: Array<{text, from, avatar?, userName?}>
 * - input: string
 * - handleInputChange: (e) => void
 * - handleSend: () => void
 * - handleClose: () => void
 * - isTyping: boolean
 * - sessionId: number | null
 * - chatEndRef: React.RefObject<HTMLDivElement>
 */
export function CustomerChatBox({
  messages,
  input,
  handleInputChange,
  handleSend,
  handleClose,
  isTyping,
  sessionId,
  chatEndRef,
  showAvatar = false, // <-- NEW: you can pass this prop to control avatar visibility
}: {
  messages: {
    text: string;
    from: "user" | "support";
    avatar?: string | null;
    userName?: string | null;
    reaction?: React.ReactNode;
  }[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSend: () => void;
  handleClose: () => void;
  isTyping: boolean;
  sessionId: number | null;
  chatEndRef: React.RefObject<HTMLDivElement>;
  showAvatar?: boolean;
}) {
  return (
    <Card
      className="
        fixed bottom-6 right-6 z-50 w-80 max-w-[96vw]
        shadow-2xl border-none
        text-zinc-100
        bg-gradient-to-b
        from-[#140212] to-[#230823]
        dark:bg-gradient-to-b
         dark:from-gray-800 dark:to-zinc-900
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <span className="font-semibold text-green-500">Customer Support</span>
        <Button variant="ghost" size="icon" onClick={handleClose}>
          <X />
        </Button>
      </div>

      {/* Chat content */}
      <CardContent className="p-4 pt-2 flex flex-col h-96">
        {/* Messages list */}
        <div
          className="
            flex-1 overflow-y-auto mb-2 space-y-2 pr-1
            scrollbar-thin
            scrollbar-thumb-zinc-500
            scrollbar-track-transparent
            hover:scrollbar-thumb-zinc-400
            dark:scrollbar-thumb-zinc-700
          "
        >
          {messages.map((msg, idx) => (
            <MessageBubble
              key={idx}
              text={msg.text}
              from={msg.from}
              avatar={msg.avatar}
              userName={msg.userName}
              showAvatar={showAvatar}
              reaction={msg.reaction}
            />
          ))}
          {/* Dummy element for auto-scroll */}
          <div ref={chatEndRef} />
        </div>

        {/* Typing indicator */}
        <div className="h-5 text-xs text-gray-400 pl-2 min-h-5">
          {isTyping && <span>Admin is typing...</span>}
        </div>

        {/* Input area */}
        {/* Input area */}
        <div className="flex gap-2 items-end pt-1">
          <textarea
            className={`
      flex-1 resize-none rounded-2xl border border-zinc-700 bg-zinc-800 
      px-4 py-2 text-base shadow-sm
      focus:outline-none focus:ring-2 focus:ring-zinc-700
      transition-all duration-200
      placeholder:text-zinc-400
      ${input.trim() ? "bg-zinc-900 text-white" : "text-zinc-300"}
    `}
            style={{ minHeight: 40, maxHeight: 120 }}
            placeholder="Type your message..."
            value={input}
            rows={1}
            onChange={handleInputChange}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            disabled={!sessionId}
          />
          <Button
            onClick={handleSend}
            disabled={!sessionId || !input.trim()}
            className={`
      rounded-2xl px-6 py-2 text-base font-medium shadow-md
      transition-all duration-150
      ${input.trim()
                ? "bg-zinc-900 text-white hover:bg-zinc-800"
                : "bg-zinc-600 text-zinc-200 cursor-not-allowed opacity-60"}
    `}
          >
            Send
          </Button>
        </div>


      </CardContent>
    </Card>
  );
}
