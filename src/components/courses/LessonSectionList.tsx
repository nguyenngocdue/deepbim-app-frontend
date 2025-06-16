import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronRight, Lock, Unlock } from "lucide-react";
import { useState } from "react";
import { Lesson, LessonSection } from "./Types";

interface Props {
  sections: LessonSection[];
  onLessonSelect: (lesson: Lesson) => void;
  activeLessonId: number | null;
  openSections?: Set<number>;
  toggleSection?: (id: number) => void;
}

export default function LessonSectionList({
  sections,
  onLessonSelect,
  activeLessonId,
  openSections: externalOpenSections,
  toggleSection: externalToggleSection,
}: Props) {
  // Fallback to local state if openSections prop is not provided
  const [localOpenSections, setLocalOpenSections] = useState<Set<number>>(
    new Set([sections[0]?.id])
  );

  // Use external openSections if provided, otherwise use local state
  const openSections = externalOpenSections ?? localOpenSections;

  const toggleSection = (id: number) => {
    if (externalToggleSection) {
      // Use external toggle if provided
      externalToggleSection(id);
    } else {
      // Update local state
      setLocalOpenSections((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    }
  };

  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <Collapsible
          key={section.id}
          open={openSections.has(section.id)}
          onOpenChange={() => toggleSection(section.id)}
          className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm "
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 sm:p-4 bg-gray-100 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors duration-300 text-gray-900 dark:text-gray-100 font-medium text-sm sm:text-base group">
            <span className="truncate max-w-[85%] font-smooth">{section.title}</span>
            <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400 group-data-[state=open]:rotate-90 transition-transform duration-300" />
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-1 p-2">
            {section.lessons.map((lesson) => (
              <button
                title={`Lesson Id: ${lesson.id}`}
                aria-label={`Chọn bài học: ${lesson.title}`}
                key={lesson.id}
                onClick={() => onLessonSelect(lesson)}
                // disabled={lesson.is_locked}
                className={`w-full flex justify-between items-center p-2 sm:p-3 rounded-md transition-all duration-300 font-smooth ${
                  Number(lesson.id) === Number(activeLessonId)
                    ? "bg-blue-50 dark:bg-gray-700 text-blue-600 dark:text-emerald-400 border-l-4 border-blue-500"
                    : "bg-white dark:bg-gray-900 hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                } ${lesson.is_locked ? "//cursor-not-allowed //opacity-75" : ""}`}
              >
                <div className="flex items-center gap-2 truncate max-w-[75%]">
                  <span className="truncate">{lesson.title}</span>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <span>{lesson.duration || "N/A"}</span>
                  {lesson.is_locked ? (
                    <Lock className="w-4 h-4 text-red-500" />
                  ) : (
                    <Unlock className="w-4 h-4 text-emerald-400" />
                  )}
                </div>
              </button>
            ))}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  );
}