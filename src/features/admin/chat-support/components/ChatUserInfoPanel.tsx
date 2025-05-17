import React from "react";

export default function ChatUserInfoPanel({ selectedSession }: any) {
  if (!selectedSession) return null;

  const user = selectedSession.user;

  return (
    <aside className="w-[300px] border-l bg-background p-4 flex flex-col gap-4">
      <div className="flex flex-col items-center">
        <img
          src={
            user.avatarUrl ||
            "https://ui-avatars.com/api/?name=" +
              (user.user_name || user.email)
          }
          alt="avatar"
          className="w-20 h-20 rounded-full object-cover bg-muted ring-1 ring-muted"
        />
        <div className="mt-2 text-lg font-semibold text-foreground">
          {user.user_name || user.email}
        </div>
        <div className="text-sm text-muted-foreground">{user.email}</div>
      </div>

      <div className="space-y-2">
        <div>
          <span className="text-xs text-muted-foreground">User ID:</span>
          <div className="text-sm">{user.id}</div>
        </div>
        {user.phone && (
          <div>
            <span className="text-xs text-muted-foreground">Phone:</span>
            <div className="text-sm">{user.phone}</div>
          </div>
        )}
        {/* Add more info if needed */}
      </div>
    </aside>
  );
}
