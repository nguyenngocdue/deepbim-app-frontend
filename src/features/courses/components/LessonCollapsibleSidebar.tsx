import { useState } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { ChevronRight, Lock, Unlock, ChevronsUpDown } from "lucide-react";
import { IoChevronDown } from "react-icons/io5";
import { FiChevronDown } from "react-icons/fi";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  isLocked: boolean;
}

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
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([sections[0]?.id]));

  const handleLessonSelect = (lesson: Lesson) => {
    setActiveLessonId(lesson.id);
    onLessonSelect(lesson);
  };

  const toggleSection = (sectionId: number) => {
    setOpenSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };


  const toggleExpandAll = () => {
    setOpenSections((prev) =>
      prev.size === sections.length ? new Set() : new Set(sections.map((s) => s.id))
    );
  };

  return (
    <div className="w-full bg-gray-900 rounded-xl shadow-lg">
      {/* Toolbar with Toggle Button */}
      <div className="bg-gray-800 p-2 flex justify-end items-center space-x-2">
        <button
          onClick={toggleExpandAll}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all duration-200"
          title={
            openSections.size === sections.length
              ? "Thu nhỏ tất cả"
              : "Mở rộng tất cả"
          }
        >
          Toggle All
        </button>
      </div>

      {/* Section List */}
      <div className="p-4 space-y-4">
        {sections.map((section) => (
          <Collapsible
            key={section.id}
            open={openSections.has(section.id)}
            onOpenChange={() => toggleSection(section.id)}
            className="border border-gray-800 rounded-lg overflow-hidden"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full px-5 py-3 bg-gray-800 hover:bg-gray-700/80 transition-all duration-300 text-white font-semibold text-base">
              <span className="truncate">{section.title}</span>

              {
                openSections.size === sections.length ? 
                <FiChevronDown   className="h-5 w-5 text-gray-400 group-data-[state=open]:rotate-90 transition-transform duration-300" />:
                <ChevronRight className="h-5 w-5 text-gray-400 group-data-[state=open]:rotate-90 transition-transform duration-300" /> 
              }
            </CollapsibleTrigger>

            <CollapsibleContent className="p-2 space-y-1.5">
              {section.lessons.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => handleLessonSelect(lesson)}
                  className={`w-full flex justify-between items-center px-4 py-2 rounded-md text-sm transition-all duration-200 ${
                    activeLessonId === lesson.id
                      ? "bg-gradient-to-r from-orange-500/20 to-gray-800 border-l-4 border-orange-500 text-orange-100"
                      : "bg-gray-800/70 hover:bg-gray-700/80 text-gray-200"
                  }`}
                  disabled={lesson.isLocked}
                >
                  <div className="flex items-center gap-3 truncate max-w-[75%]">
                    <span className="truncate font-medium">{lesson.title}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>{lesson.duration || "N/A"}</span>
                    {lesson.isLocked ? (
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
    </div>
  );
}