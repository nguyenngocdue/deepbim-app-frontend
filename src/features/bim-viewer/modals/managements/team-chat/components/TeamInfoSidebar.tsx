import React from "react";

interface Member {
  id: number;
  name: string;
  role: string;
}

interface TeamInfoSidebarProps {
  team?: {
    id: number;
    name: string;
    description: string;
    members: Member[];
  };
}

export const TeamInfoSidebar: React.FC<TeamInfoSidebarProps> = ({ team }) => {
  if (!team)
    return (
      <aside className="w-72 min-w-[200px] bg-zinc-900 border-l border-zinc-800 p-6 rounded-r-xl">
        <div className="text-center text-muted-foreground italic">
          Select a team
        </div>
      </aside>
    );

  return (
    <aside className="w-72 min-w-[200px] bg-zinc-900 border-l border-zinc-800 flex flex-col p-6 rounded-r-xl">
      {/* Team Info Header */}
      <div className="mb-6">
        <div className="text-xl font-bold text-white">{team.name}</div>
        <div className="text-sm text-zinc-400 mt-2">{team.description}</div>
      </div>
      {/* Members List */}
      <div>
        <div className="font-semibold mb-2 text-white">
          Members ({team.members.length})
        </div>
        <ul className="space-y-2">
          {team.members.map((m) => (
            <li
              key={m.id}
              className="flex items-center gap-3 p-2 rounded hover:bg-zinc-800 transition"
            >
              <span
                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white font-bold"
                title={m.name}
              >
                {m.name.charAt(0).toUpperCase()}
              </span>
              <span className="font-medium text-white">{m.name}</span>
              <span
                className={`text-xs rounded px-2 py-0.5 ${
                  m.role === "Leader"
                    ? "bg-yellow-500 text-black"
                    : "bg-zinc-700 text-white"
                }`}
              >
                {m.role}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
