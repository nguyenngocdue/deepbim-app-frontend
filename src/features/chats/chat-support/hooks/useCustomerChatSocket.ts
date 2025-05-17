import { useEffect, useRef, useState } from "react";
import { fetchAdminId } from "@/apis/users/UserSettings";
import { getMessageHistory, initSession } from "@/apis/chat";
import { io, Socket } from "socket.io-client";
import { mapMessages, DisplayMessage } from "./useChatMessages";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL;

export function useCustomerChatSocket(userId?: number) {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [adminId, setAdminId] = useState<number | null>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Lấy adminId khi mở chat lần đầu
  useEffect(() => {
    if (!open || adminId) return;
    (async () => {
      const res = await fetchAdminId();
      if (res.data?.[0]?.id) setAdminId(res.data[0].id);
    })();
  }, [open, adminId]);

  // Khi đã có adminId, tạo/lấy session và lấy tin nhắn, kết nối socket
  useEffect(() => {
    if (!open || !adminId || !userId || sessionId) return;
    (async () => {
      const id = await initSession(userId, adminId);
      setSessionId(id);
      const msgs = await getMessageHistory(id);
      setMessages(mapMessages(msgs, userId));
    })();
  }, [open, adminId, sessionId, userId]);

  // Khởi tạo và quản lý socket
  useEffect(() => {
    if (!open || !sessionId || !userId) return;
    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.emit("join_chat", sessionId);

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          from: msg.sender_id === userId ? "user" : "support",
          text: msg.content,
          created_at: msg.created_at,
        },
      ]);
    });

    socket.on("admin_typing", () => setIsTyping(true));
    socket.on("admin_stop_typing", () => setIsTyping(false));

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [open, sessionId, userId]);

  // Gửi tin nhắn qua socket
  const handleSend = () => {
    if (!input.trim() || !sessionId || !socketRef.current || !userId) return;
    socketRef.current.emit("send_message", {
      sessionId,
      sender_id: userId,
      content: input,
    });
    setInput("");
  };

  // Emit typing event
  const handleInputChange = (e: any) => {
    setInput(e.target.value);
    if (sessionId && socketRef.current) {
      socketRef.current.emit("user_typing", { sessionId });
      clearTimeout((handleInputChange as any).typingTimeout);
      (handleInputChange as any).typingTimeout = setTimeout(() => {
        socketRef.current?.emit("user_stop_typing", { sessionId });
      }, 1200);
    }
  };

  const handleClose = () => setOpen(false);

  return {
    open,
    setOpen,
    sessionId,
    adminId,
    messages,
    input,
    setInput,
    handleSend,
    handleInputChange,
    handleClose,
    isTyping,
  };
}
