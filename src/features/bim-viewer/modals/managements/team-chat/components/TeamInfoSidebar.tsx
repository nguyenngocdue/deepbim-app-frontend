import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

function getInitial(name?: string) {
  return name?.trim()?.charAt(0)?.toUpperCase() || "?";
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "--";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

interface Member {
  id: number;
  name: string;
  role: string;
  picture?: string;
  user?: {
    id: number;
    user_name: string;
    picture?: string;
    email?: string;
  };
}

interface TeamInfoSidebarProps {
  team?: {
    id: number;
    name: string;
    description?: string;
    subProject?: { id: number; name: string };
    owner?: { id: number; user_name: string; email?: string; picture?: string };
    created_at?: string;
    members: Member[];
    // Optionally, you can add files, links fields for demo
    files?: { id: number; name: string; url: string }[];
    links?: { id: number; label: string; url: string }[];
  };
}

export const TeamInfoSidebar: React.FC<TeamInfoSidebarProps> = ({ team }) => {
  if (!team)
    return (
      <aside className="w-80 min-w-[240px] bg-gradient-to-br from-[#18181b] to-[#23242a] border-l border-[#283046] p-8 flex flex-col rounded-r-2xl shadow-2xl h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-zinc-400 italic">Select a team</div>
        </div>
      </aside>
    );

  // Chuẩn hoá members
  const normalizedMembers: Member[] =
    team.members?.map((m) => ({
      ...m,
      name: m.user?.user_name || m.name,
      picture: m.user?.picture || m.picture,
      role: m.role || "Member",
    })) || [];

  // Sắp xếp Leader lên đầu
  const sortedMembers = [
    ...normalizedMembers.filter(
      (m) =>
        m.role?.toLowerCase() === "leader" || m.role?.toLowerCase() === "owner"
    ),
    ...normalizedMembers.filter(
      (m) =>
        m.role?.toLowerCase() !== "leader" && m.role?.toLowerCase() !== "owner"
    ),
  ];

  const memberCount = normalizedMembers.length;

  // Dummy data nếu chưa truyền files/links
  const files =
    team.files ||
    [
      { id: 1, name: "Spec Sheet.pdf", url: "#" },
      { id: 2, name: "Team Notes.docx", url: "#" },
    ];
  const links =
    team.links ||
    [
      { id: 1, label: "Project Board", url: "https://trello.com" },
      { id: 2, label: "Figma Design", url: "https://figma.com" },
    ];

  return (

    <div className="sm:hidden bg-gradient-to-br from-[#18181b] to-[#23242a] min-w-96 border border-[#283046]  ">
      <div className="flex w-full m-auto items-center justify-center px-5 h-14 border-b border-zinc-700 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-800 sticky top-0 z-50 shadow-2xl shadow-zinc-600">
        <span className="text-white text-lg">Group Infomation</span>
      </div>
      <aside
        className="
        min-w-[260px]
        border-[#283046]
        shadow-xl
        p-2
        "
      >
        {/* Header */}
        <div className="mb-4 pt-8 pb-2 border-b border-[#283046]">
          <div className="flex items-center gap-4">
            <span className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-2xl font-extrabold flex items-center justify-center shadow">
              {getInitial(team.name)}
            </span>
            <div>
              <div className="text-xl font-bold text-white leading-tight truncate">
                {team.name}
              </div>
              <div className="text-xs text-zinc-400 mt-1 truncate max-w-[11rem]">
                {team.description}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 mt-4 text-[15px]">
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Project:</span>
              <span className="font-semibold text-zinc-200">
                {team.subProject?.name || "--"}
              </span>
              {team.subProject?.id && (
                <span className="ml-1 text-xs text-zinc-500">
                  #{team.subProject.id}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Manager:</span>
              {team.owner?.picture ? (
                <img
                  src={team.owner.picture}
                  className="w-6 h-6 rounded-full object-cover border border-zinc-700"
                  alt={team.owner.user_name}
                />
              ) : (
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-700 text-white font-bold text-xs">
                  {getInitial(team.owner?.user_name)}
                </span>
              )}
              <span className="font-semibold text-zinc-200 ml-1">
                {team.owner?.user_name || "--"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-zinc-400">Created:</span>
              <span className="font-semibold text-zinc-200">
                {formatDate(team.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* Members List - Scrollable */}
        <div className="flex-1 flex flex-col pt-4 pb-2 overflow-hidden mb-4 border-b border-[#283046] max-h-60">
          <div className="font-semibold mb-1 text-zinc-300 tracking-wide flex items-center">
            Members
            <span className="ml-2 text-xs text-zinc-400">({memberCount})</span>
          </div>
          <ul className="space-y-2 overflow-y-auto max-h-56 pr-2 scrollbar-thin scrollbar-thumb-zinc-700
          flex-1 px-2 py-3
          scrollbar-track-transparent
          ">
            {sortedMembers.map((m) => {
              const { user } = m;
                if(!user) return;
                const userId = user.id;
                return (

                  <li
                    key={userId}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-xl border shadow
                      ${m.role?.toLowerCase() === "leader" ||
                        m.role?.toLowerCase() === "owner"
                        ? "bg-yellow-50/10 border-yellow-400/40 ring-2 ring-yellow-200/30"
                        : "bg-zinc-800/70 border-zinc-700"
                      }
                      hover:bg-blue-950/60 transition-all
                    `}
                  >
                    {/* Avatar */}
                    {m.picture ? (
                      <img
                        src={m.picture}
                        alt={m.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-zinc-700"
                      />
                    ) : (
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold
                          ${m.role?.toLowerCase() === "leader" ||
                            m.role?.toLowerCase() === "owner"
                            ? "bg-gradient-to-br from-yellow-200 to-yellow-400 text-black shadow"
                            : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                          }
                        `}
                        title={m.name}
                      >
                        {getInitial(m.name)}
                      </span>
                    )}
                    <span className="font-medium text-zinc-100 truncate">
                      {m.name}
                    </span>
                    <span
                      className={`
                        text-xs rounded px-2 py-0.5 ml-auto font-semibold tracking-tight shadow
                        ${m.role?.toLowerCase() === "leader" ||
                          m.role?.toLowerCase() === "owner"
                          ? "bg-yellow-200/90 text-black"
                          : "bg-zinc-700/90 text-white"
                        }
                      `}
                    >
                      {m.role}
                    </span>
                  </li>
                )
            }
            )
            }
          </ul>

        </div>
        {/* Tabs */}
        <div className="mt-5 ">
          <Tabs defaultValue="files" className="w-full">
            <TabsList className="grid grid-cols-2 mb-2">
              <TabsTrigger value="files">Files</TabsTrigger>
              <TabsTrigger value="links">Links</TabsTrigger>
            </TabsList>
            <TabsContent value="files">
              <div className="space-y-2">
                {files && files.length > 0 ? (
                  files.map((f) => (
                    <a
                      key={f.id}
                      href={f.url}
                      className="block px-3 py-2 rounded-xl bg-zinc-800/70 hover:bg-blue-900/60 transition-colors text-sm text-zinc-200 truncate"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {f.name}
                    </a>
                  ))
                ) : (
                  <div className="text-zinc-400 italic text-sm">No files</div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="links">
              <div className="space-y-2">
                {links && links.length > 0 ? (
                  links.map((l) => (
                    <a
                      key={l.id}
                      href={l.url}
                      className="block px-3 py-2 rounded-xl bg-zinc-800/70 hover:bg-blue-900/60 transition-colors text-sm text-blue-400 truncate"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {l.label}
                    </a>
                  ))
                ) : (
                  <div className="text-zinc-400 italic text-sm">No links</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </aside>
    </div>
  );
};
