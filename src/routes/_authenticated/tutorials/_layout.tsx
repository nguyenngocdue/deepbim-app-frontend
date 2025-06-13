import { TutorialFooter } from "@/features/tutorials/components/TutorialFooter";
import { TutorialSidebar } from "@/features/tutorials/components/TutorialSidebar";
import { createFileRoute, createRootRoute, Outlet } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";

export const Route = createRootRoute({
  component: () => {
    const [isSidebarOpen, setSidebarOpen] = useState(() => {
      const saved = localStorage.getItem("tutorial-sidebar-open");
      return saved === null ? true : saved === "true";
    });

    const contentRef = useRef<HTMLDivElement>(null);

    const handleSidebarToggle = (open: boolean) => {
      setSidebarOpen(open);
    };

    // Update CSS custom property for dynamic width adjustment
    useEffect(() => {
      if (contentRef.current) {
        contentRef.current.style.setProperty(
          "--sidebar-width",
          isSidebarOpen ? "16rem" : "4rem"
        );
      }
    }, [isSidebarOpen]);


    return (
      <div className="max-h-screen ">
        <TutorialSidebar
          isOpen={isSidebarOpen}
          onToggle={handleSidebarToggle}
        />
        <div
          ref={contentRef}
          className="mt-24 min-h-screen transition-all duration-300 ease-in-out md:ml-[--sidebar-width]"
        >
          <Outlet />
        </div>
        <TutorialFooter />
      </div>
    );
  },
});