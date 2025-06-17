import { TutorialHeader } from "@/features/tutorials/components/TutorialHeader";
import { TutorialSidebar } from "@/features/tutorials/components/TutorialSidebar";
import Footer from "@/sections/Footer";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";




export const Route = createFileRoute('/_authenticated/tutorials/_layout')({
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
          className=" min-h-screen transition-all duration-300 ease-in-out md:ml-[--sidebar-width]"
        >
          <TutorialHeader />
          <Outlet />
        </div>
          <Footer/>
      </div>
    );
  },
});

