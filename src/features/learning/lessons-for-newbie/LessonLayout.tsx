import { Outlet } from "@tanstack/react-router";
import CourseHeader from "@/features/learning/lessons-for-newbie/components/CourseHeader";

export default function LessonLayout() {
  return (
    <>
      <div className="flex flex-col h-screen bg-zinc-950 text-white">
        {/* Fixed header */}
        <CourseHeader
          courseTitle=""
          progressPercent={0}
          current={0}
          total={52}
          onBack={() => window.history.back()}
        />

        {/* Main layout */}
        <div className="flex flex-1 overflow-hidden pt-16 bg-background">
          <Outlet />
        </div>
      </div>
    </>
  );
}
