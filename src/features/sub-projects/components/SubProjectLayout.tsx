import { Sidebar } from "../components/Sidebar";
import { Outlet } from "@tanstack/react-router";

type SubProjectLayoutProps = {
  subProjectId: number;
};

export default function SubProjectLayout({ subProjectId }: SubProjectLayoutProps) {
  return (
    <div className="flex h-full bg-accent">
      <Sidebar subProjectId={subProjectId}/>
      <main className="flex-1 space-y-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
