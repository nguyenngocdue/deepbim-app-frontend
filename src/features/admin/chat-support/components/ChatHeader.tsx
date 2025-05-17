import React from "react";

export default function ChatHeader({ selectedSession }: any) {
  return (
    <div className="flex items-center gap-3 h-14 px-4 border-b bg-background shadow-sm z-10">
      <img
        src={
          selectedSession.user.avatarUrl ||
          "https://ui-avatars.com/api/?name=" +
            (selectedSession.user.user_name || selectedSession.user.email)
        }
        alt="avatar"
        className="w-11 h-11 rounded-full object-cover bg-muted ring-1 ring-muted"
      />
      <span className="font-semibold text-base text-foreground">
        {selectedSession.user.user_name || selectedSession.user.email}
      </span>
    </div>
  );
}
