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
    <div className="text-white p-6 bg-gray-900/80 rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-bold text-green-400 tracking-tight">Chương Trình Đào Tạo</h2>
      <div className="grid grid-cols-12 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-12">
          <LessonCollapsibleSidebar sections={sections} onLessonSelect={handleLessonSelect} />
        </div>
      </div>
    </div>
  );
}