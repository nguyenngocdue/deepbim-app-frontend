import { useState } from "react";
import LessonCollapsibleSidebar from "./LessonCollapsibleSidebar";

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

interface CurriculumTabProps {
  sections: Section[];
}

export default function CurriculumTab({ sections }: CurriculumTabProps) {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const handleLessonSelect = (lesson: Lesson) => {
    setSelectedLesson(lesson);
    // Add additional logic here if needed
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 overflow-hidden transition-all duration-300 hover:shadow-lg rounded-xl shadow-md space-y-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-emerald-500 bg-clip-text text-transparent tracking-tight">
        Chương Trình Đào Tạo
      </h2>
      <div className="grid grid-cols-12 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <LessonCollapsibleSidebar sections={sections} onLessonSelect={handleLessonSelect} />
        </div>
      </div>
    </div>
  );
}