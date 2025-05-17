import { fetchWithAuth2 } from "@/api";

// Kiểu dữ liệu tin nhắn
export type ChatMessage = {
  id: number;
  session_id: number;
  sender_id: number;
  content: string;
  created_at: string;
  is_read: boolean;
};

// Khởi tạo/lấy session
export async function initSession(user_id: number, admin_id: number): Promise<number> {
  const res = await fetchWithAuth2('/chat/start', {
    method: 'POST',
    body: JSON.stringify({ user_id, admin_id }),
  });
  // res chính là object đã parse, không cần .json()
  return res.data.session_id;
}

// Gửi tin nhắn mới
export async function sendMessage(
  session_id: number,
  sender_id: number,
  content: string
): Promise<void> {
  await fetchWithAuth2(`/chat/${session_id}/messages`, {
    method: 'POST',
    body: JSON.stringify({ sender_id, content }),
  });
}

// Lấy lịch sử tin nhắn
export async function getMessageHistory(session_id: number): Promise<ChatMessage[]> {
  const res = await fetchWithAuth2(`/chat/${session_id}/messages`);
  return res;
}


export type ChatSession = {
  id: number;
  user: {
    id: number;
    user_name: string;
    email: string;
  };
};

export async function getSessionList(): Promise<{ data: ChatSession[] }> {
  return await fetchWithAuth2("/chat/sessions");
}