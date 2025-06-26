import React, { useRef, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { CustomerChatBox } from "./components/CustomerChatBox";
import { useCustomerChatSocket } from "../chat-support/hooks/useCustomerChatSocket";

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
          className="fixed bottom-16 md:lg:bottom-6 right-5 md:lg:right-6 z-50 bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
      {open && (
        <CustomerChatBox
          messages={messages}
          input={input}
          handleInputChange={handleInputChange}
          handleSend={handleSend}
          handleClose={handleClose}
          isTyping={isTyping}
          sessionId={sessionId}
          chatEndRef={chatEndRef}
        />
      )}
    </>
  );
}
