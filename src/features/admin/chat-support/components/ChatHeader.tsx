import React from "react";

export default function ChatHeader({ selectedSession }: any) {
  return (
    <div className="flex items-center gap-3 h-16 px-6 border-b bg-white shadow-sm z-10">
      <img
        src={selectedSession.user.avatarUrl || "https://ui-avatars.com/api/?name=" + (selectedSession.user.user_name || selectedSession.user.email)}
        alt="avatar"
        className="w-10 h-10 rounded-full object-cover bg-gray-200 border"
      />
      <span className="font-bold text-lg">
        {selectedSession.user.user_name || selectedSession.user.email}
      </span>
    </div>
  );
}
