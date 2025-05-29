import { CLASS_NAME_DEFAULT } from "@/utils/class";
import { Sidebar } from "../components/Sidebar";
import { Outlet } from "@tanstack/react-router";
import { getSubProject } from "@/apis/sub-project-api";
import { useEffect, useState } from "react";

type SubProjectLayoutProps = {
  subProjectId: number;
};

export default function SubProjectLayout({ subProjectId }: SubProjectLayoutProps) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (subProjectId) {
      getSubProject(subProjectId).then(({ data }) => setData(data));
    }
  }, [subProjectId]);


  return (
    <div className="flex h-full bg-background dark:border-gray-600 dark:shadow-zinc-500 shadow-zinc-950 shadow-md text-foreground border border-gray-400 overflow-hidden">
      {data && <Sidebar subProject={data} />}
      <main
        className={`
        flex-1 p-4 space-y-6 overflow-y-auto bg-muted/40
        ${CLASS_NAME_DEFAULT.CLASS_SCROLLBAR}
        `}
      >
        <Outlet />
      </main>
    </div>
  );
}
