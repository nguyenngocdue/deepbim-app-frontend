import { useState } from "react";
import LessonSectionList from "@/components/courses/LessonSectionList";
import { Lesson } from "@/components/courses/Types";

interface LessonCollapsibleSidebarProps {
  sections: Section[];
  onLessonSelect: (lesson: Lesson) => void;
}

export default function LessonCollapsibleSidebar({
  sections,
  onLessonSelect,
}: LessonCollapsibleSidebarProps) {
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [openSections, setOpenSections] = useState<Set<number>>(
    new Set([sections[0]?.id])
  );

  const handleLessonSelect = (lesson: Lesson) => {
    console.log(lesson)
    setActiveLessonId(lesson.id);
    onLessonSelect(lesson);
  };

  const toggleSection = (sectionId: number) => {
    setOpenSections((prev) => {
      const newSet = new Set(prev);
      newSet.has(sectionId) ? newSet.delete(sectionId) : newSet.add(sectionId);
      return newSet;
    });
  };

  const toggleExpandAll = () => {
    setOpenSections((prev) =>
      prev.size === sections.length
        ? new Set()
        : new Set(sections.map((s) => s.id))
    );
  };

  return (
    <div className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-md">
      <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 flex justify-between items-center rounded-t-xl border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Chương trình học</h2>
        <button
          onClick={toggleExpandAll}
          className="text-xs px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-700 transition"
        >
          {openSections.size === sections.length ? "Thu nhỏ tất cả" : "Mở rộng tất cả"}
        </button>
      </div>
      <div className="p-4">
        <LessonSectionList
          sections={sections}
          onLessonSelect={handleLessonSelect}
          activeLessonId={activeLessonId}
          openSections={openSections}
          toggleSection={toggleSection}
        />
      </div>
    </div>
  );
}