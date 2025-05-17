import React, { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useAdminChatSocket } from "../hooks/useAdminChatSocket";

export default function AdminChatDashboard() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const {
    sessions,
    selectedSession,
    setSelectedSession,
    messages,
    input,
    setInput,
    handleSend,
    isTyping,
    handleInputChange,
  } = useAdminChatSocket(currentUser?.id);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!currentUser) return null;

  return (
    <div className="flex h-[90vh]">
      {/* Danh sách khách đang chat */}
      <div className="w-64 border-r overflow-y-auto">
        <h3 className="p-2 font-bold">Khách hàng</h3>
        {sessions.map((s) => (
          <div
            key={s.id}
            onClick={() => setSelectedSession(s)}
            className={`cursor-pointer px-4 py-2 hover:bg-green-100 ${
              selectedSession?.id === s.id ? "bg-green-200 font-semibold" : ""
            }`}
          >
            {s.user.user_name || s.user.email}
          </div>
        ))}
      </div>
      {/* Chat với khách */}
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <Card className="flex-1 flex flex-col">
            <div className="p-4 border-b font-semibold text-green-700">
              Đang chat với: {selectedSession.user.user_name || selectedSession.user.email}
            </div>
            <CardContent className="flex-1 flex flex-col p-4">
              <div className="flex-1 overflow-y-auto mb-2 space-y-2 pr-1">
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`px-3 py-2 rounded-2xl max-w-[80%] text-sm ${
                        msg.from === "user"
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <div className="h-5 text-xs text-gray-400 pl-2 min-h-5">
                {isTyping && <span>Khách đang nhập...</span>}
              </div>
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  placeholder="Nhập tin nhắn trả lời..."
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <Button onClick={handleSend} disabled={!input.trim()}>
                  Gửi
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Chọn khách hàng để xem tin nhắn
          </div>
        )}
      </div>
    </div>
  );
}
