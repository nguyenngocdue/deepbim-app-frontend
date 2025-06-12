import { Outlet } from "@tanstack/react-router";
import { useState } from "react";
import CourseHeader from "@/features/learning/lessons-for-newbie/components/CourseHeader";

export default function LessonLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white">
      {/* Fixed header */}
      <CourseHeader
        courseTitle="Kiến Thức Nhập Môn IT"
        progressPercent={0}
        current={0}
        total={12}
        onBack={() => window.history.back()}
      />

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}
