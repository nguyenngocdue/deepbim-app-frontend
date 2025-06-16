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
}

export default function LessonSectionList({
  sections,
  onLessonSelect,
  activeLessonId,
}: Props) {
  const [openSections, setOpenSections] = useState<Set<number>>(
    new Set([sections[0]?.id])
  );

  const toggleSection = (id: number) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-3">
      {sections.map((section) => (
        <Collapsible
          key={section.id}
          open={openSections.has(section.id)}
          onOpenChange={() => toggleSection(section.id)}
          className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden shadow-sm"
        >
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 sm:p-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 text-gray-900 dark:text-gray-100 font-medium text-sm sm:text-base group">
            <span className="truncate max-w-[85%]">{section.title}</span>
            <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-300 group-data-[state=open]:rotate-90 transition-transform duration-300" />
          </CollapsibleTrigger>

          <CollapsibleContent className="space-y-1 p-2">
            {section.lessons.map((lesson) => (
              <button
                title={`Lesson Id: ${lesson.id}`}
                key={lesson.id}
                onClick={() => onLessonSelect(lesson)}
                disabled={lesson.isLocked}
                className={`w-full flex justify-between items-center p-2 sm:p-3 rounded-md transition-colors duration-300 ${
                  Number(lesson.id) === Number(activeLessonId)
                    ? "bg-blue-600/10 text-blue-800 dark:text-blue-200 border-l-4 border-blue-600"
                    : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 truncate max-w-[75%]">
                  <span className="truncate">{lesson.title}</span>
                </div>

                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  <span>{lesson.duration || "N/A"}</span>
                  {lesson.is_locked ? (
                    <Lock className="w-4 h-4 text-red-500" />
                  ) : (
                    <Unlock className="w-4 h-4 text-green-500" />
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