import React, { useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle, X } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useCustomerChatSocket } from "../hooks/useCustomerChatSocket";

export default function CustomerChat() {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const {
    open,
    setOpen,
    sessionId,
    messages,
    input,
    setInput,
    handleSend,
    handleInputChange,
    handleClose,
    isTyping,
  } = useCustomerChatSocket(currentUser?.id);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {open && (
        <Card className="fixed bottom-6 right-6 z-50 w-80 max-w-[96vw] shadow-2xl border border-green-200">
          <div className="flex items-center justify-between p-4 border-b">
            <span className="font-semibold text-green-700">Hỗ trợ khách hàng</span>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X />
            </Button>
          </div>
          <CardContent className="p-4 pt-2 flex flex-col h-80">
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
                  {msg.from === "user" ? (
                    <div className="ml-2 flex items-center">
                      <span className="text-xs text-green-700 ml-1">Bạn</span>
                    </div>
                  ) : (
                    <div className="mr-2 flex items-center">
                      <span className="text-xs text-green-700 mr-1">Admin</span>
                    </div>
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            <div className="h-5 text-xs text-gray-400 pl-2 min-h-5">
              {isTyping && <span>Admin đang nhập...</span>}
            </div>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                placeholder="Nhập tin nhắn..."
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={!sessionId}
              />
              <Button onClick={handleSend} disabled={!sessionId || !input.trim()}>
                Gửi
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
