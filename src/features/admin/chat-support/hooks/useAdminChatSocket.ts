import { useEffect, useRef, useState, useCallback } from "react";
import { getSessionList, getMessageHistory } from "@/apis/chat";
import { io, Socket } from "socket.io-client";
import { mapMessages, DisplayMessage } from "./useChatMessages";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL;

export function useAdminChatSocket(adminId?: number) {
  const [sessions, setSessions] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchSessions = async () => {
      const res = await getSessionList();
      console.log(res);
      if (mounted) setSessions(Array.isArray(res.data) ? res.data : []);
    };
    fetchSessions();
    const interval = setInterval(fetchSessions, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!selectedSession || !adminId) return;
    let mounted = true;
    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;
    socket.emit("join_chat", selectedSession.id);

    (async () => {
      const msgs = await getMessageHistory(selectedSession.id);
      if (mounted) setMessages(mapMessages(msgs, adminId));
    })();

    socket.on("receive_message", (msg) => {
      setMessages((prev) => [
        ...prev,
        {
          from: msg.sender_id === adminId ? "user" : "support", // *** quan trọng
          text: msg.content,
          created_at: msg.created_at,
        },
      ]);
    });

    socket.on("user_typing", () => setIsTyping(true));
    socket.on("user_stop_typing", () => setIsTyping(false));

    return () => {
      mounted = false;
      socket.disconnect();
      socketRef.current = null;
    };
  }, [selectedSession, adminId]);

  const handleSend = useCallback(() => {
    if (!input.trim() || !selectedSession || !socketRef.current || !adminId) return;
    socketRef.current.emit("send_message", {
      sessionId: selectedSession.id,
      sender_id: adminId,
      content: input,
    });
    setInput("");
  }, [input, selectedSession, adminId]);

  // Emit typing event
  const handleInputChange = (e: any) => {
    setInput(e.target.value);
    if (selectedSession && socketRef.current) {
      socketRef.current.emit("admin_typing", { sessionId: selectedSession.id });
      clearTimeout((handleInputChange as any).typingTimeout);
      (handleInputChange as any).typingTimeout = setTimeout(() => {
        socketRef.current?.emit("admin_stop_typing", { sessionId: selectedSession.id });
      }, 1200);
    }
  };

  return {
    sessions,
    selectedSession,
    setSelectedSession,
    messages,
    input,
    setInput,
    handleSend,
    isTyping,
    handleInputChange,
  };
}
