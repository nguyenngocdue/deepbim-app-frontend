import React, { useRef, useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import { MessageBubble } from "@/features/chats/chat-customer/components/MessageBubble";
import { ShowInfoMenuItem } from "./ShowInfoMenuItem";
import { TypingIndicator } from "@/components/common/TypingIndicator";
import { useAppSelector } from "@/hooks/reduxHooks";
import { CLASS_NAME_DEFAULT } from "@/utils/class";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/common/LoadingState";
import { IoIosSend } from "react-icons/io";

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
  onShowInfo?: () => void;
  typingUsers: [];
  loadingMessage: boolean;
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

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (

              <div className='flex flex-1 flex-col gap-2 pr-6 pl-2 pt-0 bg-behind border-none '>
                <div className='flex size-full flex-1'>
                  <div className='chat-text-container relative -mr-4 flex flex-1 flex-col overflow-y-hidden'>
                    <div className='chat-flex flex h-40 w-full grow flex-col-reverse justify-start gap-4 overflow-y-auto'>
                        <main className="flex flex-col flex-1 min-h-0 bg-slate-100 dark:bg-zinc-900 transition-all border border-[#283046] shadow-lg">
                          {/* Header */}
                          <div className="px-6 py-3 h-14 border-b border-zinc-300 dark:border-zinc-700 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-800 flex items-center justify-between gap-3 sticky top-0 z-10 shadow-sm">
                            <div className="flex items-center gap-3">
                              <span className="text-lg font-bold text-white drop-shadow">{teamName || "Team Chat"}</span>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button
                                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-zinc-800 transition focus:outline-none"
                                  aria-label="More"
                                  type="button"
                                >
                                  <MoreHorizontal className="text-gray-400" size={22} />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" sideOffset={6} className="min-w-[180px] border border-zinc-700 shadow-xl bg-zinc-900 text-white">
                                <ShowInfoMenuItem onClick={onShowInfo} />
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Message List */}
                          <div
                            className="
                              flex-1 overflow-y-auto p-6 space-y-3 bg-slate-100 dark:bg-zinc-900
                              scrollbar-thin scrollbar-thumb-zinc-500 scrollbar-track-transparent
                              hover:scrollbar-thumb-zinc-400 dark:scrollbar-thumb-zinc-700
                              transition-all
                            "
                          >
                            {loadingMessage ? (
                              <LoadingState />
                            ) : (
                              <>
                                {messages.map((msg) => {
                                  const isMe =
                                    currentUser && String(msg.sender_id) === String(currentUser.id);
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
                            )}
                          </div>

                          {/* Typing Indicator */}
                          <TypingIndicator typingUsers={typingUsers} currentUserId={currentUser?.id} />

                          {/* Input */}
                          <form
                            onSubmit={handleSend}
                            className="flex gap-2 items-center border-t border-zinc-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 px-4 py-3"
                          >
                            <textarea
                              className="flex-1 resize-none py-2 px-4 rounded-xl text-base outline-none transition border bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 focus:border-blue-500 dark:focus:border-blue-500 text-zinc-900 dark:text-zinc-100 shadow-sm"
                              placeholder="Type a message..."
                              value={input}
                              onChange={e => {
                                setInput(e.target.value);
                                sendTyping();
                              }}
                              rows={2}
                              onKeyDown={e => {
                                if (e.key === "Enter" && !e.ctrlKey) {
                                  e.preventDefault();
                                  if (input.trim()) handleSend();
                                }
                                // Ctrl+Enter xuống dòng
                                else if (e.key === "Enter" && e.ctrlKey) {
                                  setInput(input + "\n");
                                }
                              }}
                            />
                            <Button
                              type="submit"
                              className={`rounded-xl px-4 h-10 flex items-center gap-2 shadow-md transition ${CLASS_NAME_DEFAULT.CLASS_APP_BUTTON_CREATE}`}
                              disabled={!input.trim()}
                              title="Send"
                            >
                              <IoIosSend size={22} />
                            </Button>
                          </form>
                        </main>
                    </div>
                  </div>
                </div>
              </div>
  );
};
