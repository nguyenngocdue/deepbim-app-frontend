import { useState } from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import LessonItem from "./LessonItem";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  isCompleted?: boolean;
}

interface LessonSectionProps {
  title: string;
  lessons: Lesson[];
}

export default function LessonSection({ title, lessons }: LessonSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border-b border-gray-200 dark:border-gray-700"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full px-4 py-2 text-base font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <span>{title}</span>
        <ChevronRight
          className={`h-5 w-5 transition-transform ${isOpen ? "rotate-90" : ""}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 py-2 space-y-1">
        {lessons.map((lesson) => (
          <LessonItem
            key={lesson.id}
            title={lesson.title}
            duration={lesson.duration}
            isCompleted={lesson.isCompleted}
            onClick={() => console.log(`Clicked lesson ${lesson.id}`)}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}