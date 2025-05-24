import { useEffect, useState } from "react";
import { getUnreadCounts } from "@/apis/team-api";
import { io } from "socket.io-client";

export function useUnreadCountsRealtime(currentUserId: number) {
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let socket;
    let mounted = true;
    // Lấy badge ban đầu
    getUnreadCounts().then(list => {
      if (list?.data && Array.isArray(list.data)) list = list.data;
      if (!Array.isArray(list)) return setCounts({});
      const map: Record<string, number> = {};
      list.forEach(item => { map[item.team_id] = item.unread_count; });
      if (mounted) setCounts(map);
    });

    // Kết nối socket
    socket = io(import.meta.env.VITE_API_BASE_URL + "/team-chat", {
      transports: ["websocket"],
      auth: { token: localStorage.getItem("access_token") }
    });

    // Khi có tin nhắn mới (nhưng user không ở phòng đó)
    socket.on("team_new_message", ({ teamId }) => {
        console.log(teamId);
      setCounts(prev => ({
        ...prev,
        [teamId]: (prev[teamId] || 0) + 1
      }));
    });

    // Khi user đọc hết tin nhắn team nào đó (gọi mark as read thành công)
    socket.on("team_message_read", ({ teamId }) => {
      setCounts(prev => ({
        ...prev,
        [teamId]: 0
      }));
    });



    





    return () => {
      mounted = false;
      if (socket) socket.disconnect();
    };
  }, [currentUserId]);

  return counts;
}
