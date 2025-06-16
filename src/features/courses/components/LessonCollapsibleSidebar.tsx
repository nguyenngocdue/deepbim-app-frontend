import { useState, useEffect } from "react";
import LessonSectionList from "@/components/courses/LessonSectionList";
import { Lesson } from "@/components/courses/Types";
import { Link } from "@tanstack/react-router";

interface Section {
  id: number;
  title: string;
  description: string;
  lessons: Lesson[];
}

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
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    if (lesson.is_locked) {
      setShowPurchaseModal(true);
      return;
    }
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

  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showPurchaseModal) {
        setShowPurchaseModal(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [showPurchaseModal]);

  console.log(selectedLesson);

  return (
    <>
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

      {/* Purchase Modal */}
      {showPurchaseModal && selectedLesson && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="purchase-modal-title"
        >
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 max-w-sm w-full mx-4 transition-transform duration-300 transform scale-100">
            <h3
              id="purchase-modal-title"
              className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 font-smooth"
            >
              Mở khóa bài học
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
              Bài học này bị khóa. Vui lòng mua khóa học để truy cập toàn bộ nội dung.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowPurchaseModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Đóng
              </button>
              <Link
                to={`/tutorials/purchase-course?course_id=${selectedLesson.course_id}&title=${encodeURIComponent(selectedLesson.course.title)}`}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition focus:ring-2 focus:ring-blue-500"
                aria-label="Mua khóa học để mở khóa bài học"
              >
                Mua Ngay
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}