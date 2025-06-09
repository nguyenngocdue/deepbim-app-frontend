import { useEffect, useRef, useState } from "react";
import { fetchAdminId } from "@/apis/users/UserSettings";
import { getMessageHistory, initSession } from "@/apis/chat";
import { io, Socket } from "socket.io-client";
import { mapMessages, DisplayMessage } from "./useChatMessages";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL;
const AUTO_REPLY_DELAY = 8000; // 8s, bạn muốn chờ bao lâu thì chỉnh
const AUTO_REPLY_TEXT = "Chúng tôi sẽ phản hồi bạn khi chúng tôi online.";


export function useCustomerChatSocket(userId?: number) {
  const [open, setOpen] = useState(false);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [adminId, setAdminId] = useState<number | null>(null);
  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef<Socket | null>(null);

const defaultWelcomeMessages: DisplayMessage[] = [
  { text: "Thank you for visiting our website.", from: "support" },
  { text: "How can I help you today?", from: "support" },
];

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages(defaultWelcomeMessages);
    }
    // eslint-disable-next-line
  }, [open]);

  // Lấy adminId khi mở chat lần đầu
  useEffect(() => {
    if (!open || adminId) return;
    (async () => {
      const res = await fetchAdminId();
      if (res.data?.[0]?.id) setAdminId(res.data[0].id);
    })();
  }, [open, adminId, sessionId, userId]);

  // Khi đã có adminId, tạo/lấy session và lấy tin nhắn, kết nối socket
  useEffect(() => {
    if (!open || !adminId || !userId || sessionId) return;
    (async () => {
      const id = await initSession(userId, adminId);
      setSessionId(id);
      const msgs = await getMessageHistory(id);
      // Nếu message history đã có welcome, chỉ nối phần chưa có
      let userMsgs = mapMessages(msgs, userId) || [];
      // Kiểm tra xem đã có message chào mừng chưa
      let hasWelcome = userMsgs.length >= 2 &&
        userMsgs[0].text === defaultWelcomeMessages[0].text &&
        userMsgs[1].text === defaultWelcomeMessages[1].text;

      if (userMsgs.length > 0 && !hasWelcome) {
        setMessages([...defaultWelcomeMessages, ...userMsgs]);
      } else if (userMsgs.length > 0 && hasWelcome) {
        setMessages(userMsgs);
      } else {
        setMessages(defaultWelcomeMessages);
      }
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

    // Đánh dấu thời điểm gửi của user
    const sentAt = new Date().getTime();

    socketRef.current.emit("send_message", {
      sessionId,
      sender_id: userId,
      content: input,
    });
    setInput("");


     // Đặt timer chờ phản hồi admin
    setTimeout(() => {
      // Kiểm tra trong messages: từ lúc gửi đến giờ, có tin nhắn nào from support mới không?
      setMessages(prevMessages => {
        // Tìm tin nhắn cuối cùng từ support
        const lastSupportMsg = [...prevMessages].reverse().find(msg => msg.from === "support");
        // Nếu không có support trả lời sau tin user gửi thì push auto-reply
        if (!lastSupportMsg || !lastSupportMsg.created_at || (lastSupportMsg.created_at && new Date(lastSupportMsg.created_at).getTime() < sentAt)) {
          // Kiểm tra chưa có auto-reply thì mới gửi (tránh spam)
          if (!prevMessages.some(msg => msg.text === AUTO_REPLY_TEXT)) {
            return [
              ...prevMessages,
              { from: "support", text: AUTO_REPLY_TEXT, created_at: new Date().toISOString() }
            ];
          }
        }
        return prevMessages;
      });
    }, AUTO_REPLY_DELAY);

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
