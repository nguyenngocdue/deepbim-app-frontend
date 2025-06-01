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
    files?: { id: number; name: string; url: string }[];
    links?: { id: number; label: string; url: string }[];
  };
}

export const TeamInfoSidebar: React.FC<TeamInfoSidebarProps> = ({ team }) => {
  if (!team)
    return (
      <aside className="w-80 min-w-[240px] bg-background border-l border-border border border-gray-200 dark:border-gray-700 p-8 flex flex-col shadow-lg h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground italic select-none">
            Select a team
          </div>
        </div>
      </aside>
    );

  // Normalize members and sort leaders on top
  const normalizedMembers: Member[] =
    team.members?.map((m) => ({
      ...m,
      name: m.user?.user_name || m.name,
      picture: m.user?.picture || m.picture,
      role: m.role || "Member",
    })) || [];

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

  const files =
    team.files || [
      { id: 1, name: "Spec Sheet.pdf", url: "#" },
      { id: 2, name: "Team Notes.docx", url: "#" },
    ];
  const links =
    team.links || [
      { id: 1, label: "Project Board", url: "https://trello.com" },
      { id: 2, label: "Figma Design", url: "https://figma.com" },
    ];

  return (
    <aside className="w-80 min-w-[260px] bg-background border border-gray-200 dark:border-gray-700 p-6 flex flex-col shadow-lg h-full">
      {/* Header */}
      <div className="flex items-center gap-4 pb-4 border-b border-border">
        <span
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600
            text-white text-2xl font-extrabold flex items-center justify-center shadow-md select-none"
        >
          {getInitial(team.name)}
        </span>
        <div className="flex flex-col overflow-hidden">
          <h2
            className="text-xl font-bold text-foreground truncate max-w-[14rem]"
            title={team.name}
          >
            {team.name}
          </h2>
          <p
            className="text-sm text-muted-foreground mt-1 truncate max-w-[14rem]"
            title={team.description}
          >
            {team.description || "--"}
          </p>
        </div>
      </div>

      {/* Info Section */}
      <div className="mt-4 space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">Project:</span>
          <span className="truncate">{team.subProject?.name || "--"}</span>
          {team.subProject?.id && (
            <span className="text-xs text-muted-foreground select-none">
              #{team.subProject.id}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">Manager:</span>
          {team.owner?.picture ? (
            <img
              src={team.owner.picture}
              alt={team.owner.user_name}
              className="w-6 h-6 rounded-full object-cover border border-border"
            />
          ) : (
            <span
              className="inline-flex items-center justify-center w-6 h-6 rounded-full
                bg-blue-700 text-white font-bold text-xs select-none"
              title={team.owner?.user_name}
            >
              {getInitial(team.owner?.user_name)}
            </span>
          )}
          <span className="truncate font-semibold text-foreground">
            {team.owner?.user_name || "--"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">Created:</span>
          <span>{formatDate(team.created_at)}</span>
        </div>
      </div>

      {/* Members List */}
      <div className="mt-6 flex flex-col flex-1 overflow-hidden border-t border-border pt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-foreground tracking-wide select-none">
            Members ({memberCount})
          </h3>
        </div>
        <ul className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent px-1 pr-2">
          {sortedMembers.map((m) => {
            const { user } = m;
            if (!user) return null;
            const userId = user.id;
            const isLeader =
              m.role?.toLowerCase() === "leader" || m.role?.toLowerCase() === "owner";

            return (
              <li
                key={userId}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl border
                  ${
                    isLeader
                      ? "bg-yellow-50/10 border-yellow-400/40 ring-2 ring-yellow-200/30"
                      : "bg-muted border-border"
                  }
                  hover:bg-muted-hover transition select-none
                `}
              >
                {/* Avatar */}
                {m.picture ? (
                  <img
                    src={m.picture}
                    alt={m.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-border"
                  />
                ) : (
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold
                    ${
                      isLeader
                        ? "bg-gradient-to-br from-yellow-200 to-yellow-400 text-black shadow"
                        : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"
                    }`}
                    title={m.name}
                  >
                    {getInitial(m.name)}
                  </span>
                )}
                <span className="font-medium text-foreground truncate">{m.name}</span>
                <span
                  className={`text-xs rounded px-2 py-0.5 ml-auto font-semibold tracking-tight shadow
                    ${
                      isLeader
                        ? "bg-yellow-200/90 text-black"
                        : "bg-muted-light text-muted-foreground"
                    }
                  `}
                >
                  {m.role}
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Tabs for Files and Links */}
      <div className="mt-5">
        <Tabs defaultValue="files" className="w-full">
          <TabsList className="grid grid-cols-2 mb-3">
            <TabsTrigger value="files">Files</TabsTrigger>
            <TabsTrigger value="links">Links</TabsTrigger>
          </TabsList>

          <TabsContent value="files">
            <div className="space-y-2">
              {files.length > 0 ? (
                files.map((f) => (
                  <a
                    key={f.id}
                    href={f.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 rounded-xl bg-muted hover:bg-muted-hover transition-colors text-sm text-foreground truncate"
                    title={f.name}
                  >
                    {f.name}
                  </a>
                ))
              ) : (
                <div className="text-muted-foreground italic text-sm select-none">
                  No files
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="links">
            <div className="space-y-2">
              {links.length > 0 ? (
                links.map((l) => (
                  <a
                    key={l.id}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-3 py-2 rounded-xl bg-muted hover:bg-muted-hover transition-colors text-sm text-primary truncate"
                    title={l.label}
                  >
                    {l.label}
                  </a>
                ))
              ) : (
                <div className="text-muted-foreground italic text-sm select-none">
                  No links
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  );
};
