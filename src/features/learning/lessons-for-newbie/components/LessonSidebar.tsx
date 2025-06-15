import { useEffect, useState } from "react";
import { Lesson, LessonSection } from "./Type";
import NoLessonFound from "./NoLessonFound";
import { LoadingState } from "@/components/common/LoadingState";
import LessonSectionList from "@/components/courses/LessonSectionList";

interface LessonSidebarProps {
  sections: LessonSection;
  onLessonSelect: (lesson: Lesson) => void;
  lessonId: number;
}

export default function LessonSidebar({
  sections,
  onLessonSelect,
  lessonId,
}: LessonSidebarProps) {
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setActiveLessonId(lessonId);
  }, [lessonId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-gray-900 to-black shadow-xl max-h-[calc(100vh-80px)]">
      {/* Fixed Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
        <h2 className="text-lg font-semibold text-white tracking-tight sm:text-xl md:text-lg lg:text-xl">
          Nội dung khóa học
        </h2>
      </div>

      {/* Scrollable Section List */}
      <aside className="flex-1 max-h-[calc(100vh-80px)] overflow-y-auto px-2 py-4 space-y-3">
        {isLoading ? (
          <LoadingState message="Đang tải nội dung khóa học..." />
        ) : sections.length === 0 ? (
          <NoLessonFound />
        ) : (
          <LessonSectionList
            sections={sections}
            activeLessonId={activeLessonId}
            onLessonSelect={(lesson) => {
            setActiveLessonId(lesson.id);
            onLessonSelect(lesson);
            }}
          />
        )}
      </aside>
    </div>
  );
}
