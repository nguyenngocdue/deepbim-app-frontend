import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Lesson, LessonSection } from "./Type";
import NoLessonFound from "./NoLessonFound";
import { LoadingState } from "@/components/common/LoadingState";



interface LessonSidebarProps {
  sections: LessonSection; // Giả định LessonSection là LessonSection[]
  onLessonSelect: (lesson: Lesson) => void;
  lessonId: number;
}

export default function LessonSidebar({ sections, onLessonSelect, lessonId }: LessonSidebarProps) {
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cập nhật activeLessonId khi lessonId thay đổi
  useEffect(() => {
    setActiveLessonId(lessonId);
  }, [lessonId]);

  // Thiết lập timeout để chuyển isLoading thành false sau 3 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 giây

    return () => clearTimeout(timer); // Xóa timeout khi component unmount
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
          <LoadingState message=" Đang tải nội dung khóa học..."/>
        ) : sections.length === 0 ? (
          <NoLessonFound />
        ) : (
          sections.map((section, i) => (
            <Collapsible
              key={section.id}
              defaultOpen={i === 0}
              className="border border-gray-700 rounded-xl overflow-hidden shadow-sm p-2"
            >
              <CollapsibleTrigger className="mb-1 flex items-center justify-between w-full p-3 sm:p-4 bg-gray-800/80 hover:bg-gray-700/80 transition-colors duration-300 text-white font-medium text-sm sm:text-base md:text-sm lg:text-base group">
                <span className="truncate max-w-[85%]">{section.title}</span>
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300 group-data-[state=open]:rotate-90 transition-transform duration-300 ease-in-out" />
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-1">
                {section.lessons.map((lesson) => (
                  <button
                    title={`Id: #${lesson.id}`}
                    key={lesson.id}
                    onClick={() => {
                      setActiveLessonId(lesson.id);
                      onLessonSelect(lesson);
                    }}
                    className={`w-full text-left p-3 sm:p-4 text-sm sm:text-base flex justify-between items-center transition-colors duration-300 rounded-lg ${
                      String(activeLessonId) === String(lesson.id)
                        ? "bg-orange-500/30 text-orange-200 border-l-4 border-orange-500"
                        : "bg-gray-800/60 hover:bg-gray-700/90 text-gray-200"
                    }`}
                    aria-label={`Chọn bài học: ${lesson.title}`}
                  >
                    <span className="truncate max-w-[70%] sm:max-w-[75%]">{lesson.title}</span>
                    <span className="text-xs sm:text-sm text-gray-400 flex-shrink-0">
                      {lesson.duration || ""}
                    </span>
                  </button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))
        )}
      </aside>
    </div>
  );
}