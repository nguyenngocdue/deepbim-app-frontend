import { CLASS_NAME_DEFAULT } from "@/utils/class";
import { Sidebar } from "../components/Sidebar";
import { Outlet } from "@tanstack/react-router";

type SubProjectLayoutProps = {
  subProjectId: number;
};

export default function SubProjectLayout({ subProjectId }: SubProjectLayoutProps) {
  return (
    <div className="flex h-full bg-background dark:border-gray-600 dark:shadow-zinc-500 shadow-zinc-950 shadow-md text-foreground border border-gray-400 overflow-hidden">
      <Sidebar subProjectId={subProjectId} />
      <main className={`
        flex-1 p-4 space-y-6 overflow-y-auto bg-muted/40
        ${CLASS_NAME_DEFAULT.CLASS_SCROLLBAR}
        `}>
        <Outlet />
      </main>
    </div>
  );
}