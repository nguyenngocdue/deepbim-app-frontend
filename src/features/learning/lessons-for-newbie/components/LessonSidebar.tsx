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
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden max-h-[calc(100vh-80px)] transition-colors duration-300">
      {/* Header */}
      <div className="bg-gray-900 dark:bg-gray-900 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-orange-600 tracking-tight">
          Nội dung khóa học
        </h2>
      </div>

      {/* Scrollable Content */}
      <aside className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
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
