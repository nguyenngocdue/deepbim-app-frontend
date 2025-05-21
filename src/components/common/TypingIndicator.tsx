// components/TypingIndicator.tsx
import React from "react";

interface TypingUser {
  user_id: number;
  user_name: string;
}

interface TypingIndicatorProps {
  typingUsers: TypingUser[];
  // Optionally: currentUserId để ẩn mình khỏi danh sách
  currentUserId?: number;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  typingUsers,
  currentUserId
}) => {
  // Ẩn chính mình khỏi danh sách (nếu muốn)
  const filtered = currentUserId
    ? typingUsers.filter(u => u.user_id !== currentUserId)
    : typingUsers;

  if (!filtered.length) return null;

  // Xử lý hiển thị tên người dùng đang typing
  const names = filtered.map(u => u.user_name);

  let text = "";
  if (names.length === 1) {
    text = `${names[0]} is typing...`;
  } else if (names.length === 2) {
    text = `${names[0]} and ${names[1]} are typing...`;
  } else {
    text = `${names[0]} and ${names.length - 1} others are typing...`;
  }

  return (
    <div className="px-4 py-2 text-sm italic text-blue-400 animate-pulse">
      {text}
    </div>
  );
};
