import { LogoWord } from "@/components/LogoWord";
import { ChevronLeft, HelpCircle, FileText } from "lucide-react";

interface CourseHeaderProps {
  courseTitle: string;
  progressPercent: number;
  current: number;
  total: number;
  onBack?: () => void;
}

export default function CourseHeader({
  courseTitle,
  progressPercent,
  current,
  total,
  onBack,
}: CourseHeaderProps) {
  const progress = Math.min(100, Math.max(0, progressPercent));

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 h-12 bg-gradient-to-r from-gray-800 to-gray-900 text-white shadow-lg">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 rounded-full hover:bg-gray-700/50 transition-colors duration-200"
          aria-label="Go back"
        >
          <ChevronLeft size={24} className="text-gray-200" />
        </button>

        <div className="flex items-center gap-3">
          <LogoWord size="sm"/>
          <h1 className="text-base sm:text-lg font-semibold tracking-tight truncate max-w-[200px] sm:max-w-[300px]">
            {courseTitle}
          </h1>
        </div>
      </div>

      {/* Center Progress */}
      <div className="flex items-center gap-3">
        <div className="relative w-48 sm:w-64 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-xs sm:text-sm text-gray-200 font-medium">
          {current}/{total} lessons
        </span>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-700/50 transition-colors duration-200 text-sm font-medium text-gray-200"
          aria-label="Notes"
        >
          <FileText size={16} />
          <span className="hidden sm:inline">Notes</span>
        </button>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-gray-700/50 transition-colors duration-200 text-sm font-medium text-gray-200"
          aria-label="Guide"
        >
          <HelpCircle size={16} />
          <span className="hidden sm:inline">Guide</span>
        </button>
      </div>
    </header>
  );
}