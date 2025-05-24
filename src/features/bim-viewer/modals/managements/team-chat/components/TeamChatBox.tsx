import React, { useState, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { MessageBubble } from "@/features/chats/chat-customer/components/MessageBubble";
import { TypingIndicator } from "@/components/common/TypingIndicator";
import { Button } from "@/components/ui/button";
import { IoIosSend } from "react-icons/io";
import { LoadingState } from "@/components/common/LoadingState";
import { useAppSelector } from "@/hooks/reduxHooks";
import { getReaders } from "@/apis/team-chat";

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
    readersMap,

}) => {
  const [input, setInput] = useState("");
  const { user } = useAppSelector((state) => state.auth);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto scroll xuống cuối mỗi khi messages đổi
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  // Đọc tin nhắn
  const [maxReadId, setMaxReadId] = useState(0);
  useEffect(() => { setMaxReadId(0); }, [teamId]);

  const lastMsg = messages[messages.length - 1];
  const { ref: lastMsgRef, inView: lastMsgInView } = useInView({
    threshold: 0.7, triggerOnce: false,
  });

  useEffect(() => {
    if (lastMsgInView && lastMsg?.id && lastMsg.id > maxReadId && markMessageAsRead) {
      setMaxReadId(lastMsg.id);
      markMessageAsRead(lastMsg.id);
    }
  }, [lastMsgInView, lastMsg, markMessageAsRead, maxReadId]);

  // ====== Phần readers ======
  // readersMap: { [msgId]: [{id, name, avatar}] }
  // const [readersMap, setReadersMap] = useState<{ [msgId: number]: any[] }>({});
  const [loadingReaders, setLoadingReaders] = useState<{ [msgId: number]: boolean }>({});

  // useEffect(() => {
  //   if (
  //     lastMsg &&
  //     String(lastMsg.sender_id) === String(user?.id) && // Nếu message cuối là của mình
  //     !readersMap[lastMsg.id] && // Chưa fetch reader
  //     !loadingReaders[lastMsg.id]
  //   ) {
  //     setLoadingReaders(prev => ({ ...prev, [lastMsg.id]: true }));
  //     getReaders(teamId, lastMsg.id)
  //       .then(res => {
  //         setReadersMap(prev => ({ ...prev, [lastMsg.id]: res?.data || [] }));
  //       })
  //       .finally(() => {
  //         setLoadingReaders(prev => ({ ...prev, [lastMsg.id]: false }));
  //       });
  //   }
  //   // eslint-disable-next-line
  // }, [lastMsg?.id, user?.id, teamId, messages]);

  // ===== Gửi tin nhắn =====
  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <div className="flex flex-col h-full  bg-[#EBECF0] dark:bg-zinc-900">
      {/* Header */}
      <div className="
            flex items-center justify-between px-6 py-3 h-14 
            bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-800 
            shadow-md shadow-zinc-600
            ">
        <span className="text-lg font-bold text-white">{teamName || "Team Chat"}</span>
      </div>

      {/* Danh sách tin nhắn */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-zinc-600 scrollbar-track-transparent min-h-0">
        {loadingMessage ? (
          <LoadingState />
        ) : (
          <>
            {messages.map((msg, idx) => {
              const isMe = user && String(msg.sender_id) === String(user.id);

              const isLastUserMessage =
                isMe &&
                // Không còn message nào sau nó do user này gửi
                messages
                  .slice(idx + 1)
                  .findIndex(m => String(m.sender_id) === String(user.id)) === -1;


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
                    loadingSeen={!!loadingReaders[msg.id]}
                    isLastUserMessage={isLastUserMessage ?? undefined}
                  />
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <form
        onSubmit={handleSend}
        className="relative flex items-center gap-2 px-4 pb-2 pt-2 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-800"
      >
        <TypingIndicator typingUsers={typingUsers} currentUserId={user?.id} />
        <textarea
          className="flex-1 px-4 py-2 text-base rounded-xl border dark:bg-zinc-800 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
          placeholder={`Type a message to "${teamName}"`}
          value={input}
          onChange={e => { setInput(e.target.value); sendTyping(); }}
          rows={2}
          onKeyDown={e => {
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
          className="rounded-xl px-4 h-10 flex items-center gap-2 shadow-md bg-purple-500 dark:bg-purple-500"
          disabled={!input.trim()}
          title="Send"
        >
          <IoIosSend size={22} />
        </Button>
      </form>
    </div>
  );
};
