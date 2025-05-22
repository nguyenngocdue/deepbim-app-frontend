import React from "react";
import { UserCircle2 } from "lucide-react"; // Sử dụng icon miễn phí Lucide (nếu chưa có thì xóa đi)

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

function getInitial(name: string) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "?";
}

export const TeamInfoSidebar: React.FC<TeamInfoSidebarProps> = ({ team }) => {
  if (!team)
    return (
      <aside className="w-80 min-w-[240px] bg-zinc-900/95 border-l border-zinc-800 p-8 flex flex-col rounded-r-2xl shadow-2xl">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-zinc-400 italic">Select a team</div>
        </div>
      </aside>
    );

  return (
    <aside className="w-80 min-w-[240px] bg-zinc-900/95 border-l border-zinc-800 p-8 flex flex-col rounded-r-2xl shadow-2xl h-full">
      {/* Team Info Header */}
      <div className="mb-8">
        <div className="text-2xl font-extrabold text-white flex items-center gap-3">
          <span className="inline-block w-9 h-9 rounded-full bg-blue-600 text-white text-lg font-bold flex items-center justify-center shadow">
            {getInitial(team.name)}
          </span>
          <span>{team.name}</span>
        </div>
        <div className="text-base text-zinc-400 mt-3">{team.description}</div>
      </div>
      {/* Members List */}
      <div className="flex-1">
        <div className="font-semibold mb-3 text-zinc-300 tracking-wide">
          Members <span className="ml-2 text-xs text-zinc-400">({team.members.length})</span>
        </div>
        <ul className="space-y-2 overflow-auto max-h-[300px] pr-1">
          {team.members.map((m) => (
            <li
              key={m.id}
              className={`
                flex items-center gap-3 px-3 py-2 rounded-xl
                bg-zinc-800/70 hover:bg-blue-950/80 transition-all
                border border-zinc-800
                ${m.role === "Leader" ? "ring-2 ring-yellow-400/60" : ""}
              `}
            >
              <span
                className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-white bg-gradient-to-br
                  ${
                    m.role === "Leader"
                      ? "from-yellow-400 to-yellow-600 text-black"
                      : "from-blue-600 to-purple-700"
                  }
                `}
                title={m.name}
              >
                {getInitial(m.name)}
              </span>
              <span className="font-medium text-zinc-100 truncate">{m.name}</span>
              <span
                className={`text-xs rounded px-2 py-0.5 ml-auto
                  ${m.role === "Leader"
                    ? "bg-yellow-400 text-black font-semibold shadow"
                    : "bg-zinc-700 text-white"} 
                `}
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
