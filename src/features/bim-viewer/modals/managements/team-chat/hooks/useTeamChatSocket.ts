import { getMessageByTeamId } from "@/apis/team-chat-message";
import { UserProfile } from "@/types/User";
import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

const TEAM_CHAT_SOCKET_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}`
  : `http://localhost:${import.meta.env.VITE_API_PORT}`;

export interface TeamMessage {
  id: number;
  team_id: number;
  sender: string;
  content: string;
  created_at: string;
  avatar?: string;
  user_name?: string;
}

interface UserTyping {
  user_id: number;
  user_name: string;
}

export function useTeamChatSocket(teamId: number | undefined, currentUser: { id: number; user_name: string; avatar?: string, currentUser: UserProfile }) {
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<UserTyping[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [readersMap, setReadersMap] = useState<{ [msgId: number]: any[] }>({});



useEffect(() => {
  if (!socketRef.current) return;
  const socket = socketRef.current;
  function handleMessageRead(data: any) {
    const { messageId, userId, userName, avatar } = data;
    setReadersMap(prev => {
      const oldList = prev[messageId] || [];
      if (oldList.some(u => u.user_id === userId)) return prev;
      return {
        ...prev,
        [messageId]: [
          ...oldList,
          { user_id: userId, user: { user_name: userName, picture: avatar, id: userId } }
        ]
      };
    });
  }
  socket.on("message_read", handleMessageRead);
  return () => {
    socket.off("message_read", handleMessageRead);
  };
}, [messages]);


  const markMessageAsRead = useCallback((messageId: number) => {
    if (socketRef.current && teamId && currentUser?.id && messageId) {
      socketRef.current.emit("read_team_message", {
        teamId,
        messageId,
        userId: currentUser.id,
        avatar: currentUser.avatar,
        userName: currentUser.user_name,
      });
    }
  }, [teamId, currentUser]);

  
  // Khi vào team mới: kết nối socket, fetch message cũ
  useEffect(() => {
    if (!teamId || !currentUser?.id) return;

    // Kết nối socket.io
    const socket = io(TEAM_CHAT_SOCKET_URL, {
      transports: ["websocket"],
      auth: { token: localStorage.getItem("access_token") }
    });



    // TEST
      socket.on("connect", () => {
    console.log("🟢 Connected to backend!");
    socket.emit("ping_test", { source: "frontend", at: Date.now() });
  });

  socket.on("pong_test", (data) => {
    console.log("📥 Received pong_test:", data);
  });






    socketRef.current = socket;

    // Join team room
    socket.emit("join_team", { teamId });

    setIsConnected(true);

    console.log(socketRef);

    // Fetch lịch sử chat cũ (REST API)
    (async () => {
      setLoadingMessage(true);
      setMessages([]);
      const msgs = await getMessageByTeamId(teamId);
      if (msgs.ok) {
        setMessages(msgs.data);
        setLoadingMessage(false);
      }
    })();

    // Read message
      socket.on('message_read', (data) => {
    })


    // Nhận tin nhắn realtime
    socket.on("receive_team_message", (msg: TeamMessage) => {
      setMessages(prev => [...prev, msg]);
    });


    // Nhận user khác đang typing
    socket.on("team_member_typing", (payload: { userId: number; userName: string }) => {
      setTypingUsers(prev => {
        // Không thêm trùng chính mình, hoặc đã có rồi thì thôi
        if (payload.userId === currentUser.id || prev.some(u => u.user_id === payload.userId)) return prev;
        return [...prev, { user_id: payload.userId, user_name: payload.userName }];
      });
    });

    // Khi user dừng typing
    socket.on("team_member_stop_typing", (payload: { userId: number }) => {
      setTypingUsers(prev => prev.filter(u => u.user_id !== payload.userId));
    });

    // Khi client rời team hoặc component bị unmount
    return () => {
      socket.off('message_read');
      socket.off("receive_team_message");
      socket.off("team_member_typing");
      socket.off("team_member_stop_typing");
      setIsConnected(false);
      setTypingUsers([]);
      socket.disconnect();
      socketRef.current = null;
      setMessages([]);
    };
    // eslint-disable-next-line
  }, [teamId, currentUser?.id]);

  // Gửi message
  const sendTeamMessage = useCallback((content: string) => {
    if (socketRef.current && teamId && content.trim()) {
      socketRef.current.emit("send_team_message", {
        teamId,
        senderId: currentUser.id,
        userName: currentUser.user_name,
        avatar: currentUser.avatar,
        content,
      });
    }
  }, [teamId, currentUser]);

  // Gửi typing event, tối ưu không gửi liên tục
  const typingTimeout = useRef<any>(null);

  const sendTyping = useCallback(() => {
    if (socketRef.current && teamId) {
      socketRef.current.emit("team_member_typing", {
        teamId,
        userId: currentUser.id,
        userName: currentUser.user_name,
      });

      // Clear old timeout (chỉ gửi stop khi đã ngừng gõ 1 thời gian)
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => {
        socketRef.current?.emit("team_member_stop_typing", {
          teamId,
          userId: currentUser.id,
        });
      }, 1200);
    }
  }, [teamId, currentUser]);

  // Gửi event "dừng typing" khi unmount, tránh stuck "typing"
  useEffect(() => {
    return () => {
      if (socketRef.current && teamId && currentUser?.id) {
        socketRef.current.emit("team_member_stop_typing", {
          teamId,
          userId: currentUser.id,
        });
      }
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
    // eslint-disable-next-line
  }, [teamId, currentUser?.id]);

  return {
    messages,
    sendTeamMessage,
    isConnected,
    typingUsers, // mảng user đang typing (trừ mình)
    sendTyping,
    loadingMessage,
    markMessageAsRead,
    readersMap,
  };
}
