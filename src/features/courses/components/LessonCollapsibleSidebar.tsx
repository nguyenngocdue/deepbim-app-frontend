import LessonSectionList from "@/components/courses/LessonSectionList";
import { useState } from "react";

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
    <div className="w-full bg-gray-900 rounded-xl shadow-lg">
      {/* Toolbar */}
      <div className="bg-gray-800 p-2 flex justify-end items-center space-x-2">
        <button
          onClick={toggleExpandAll}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all duration-200"
        >
          {openSections.size === sections.length ? "Thu nhỏ tất cả" : "Mở rộng tất cả"}
        </button>
      </div>

      {/* Section List */}
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
