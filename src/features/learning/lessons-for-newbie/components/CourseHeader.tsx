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
    <header className="flex items-center justify-between px-4 h-14 bg-zinc-900 text-white dark:text-white border-b border-zinc-800">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="hover:text-orange-500 transition">
          <ChevronLeft size={20} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-500 text-xs font-bold rounded-full flex items-center justify-center">
            F8
          </div>
          <span className="font-semibold text-sm">{courseTitle}</span>
        </div>
      </div>

      {/* Center Progress */}
      <div className="hidden md:flex items-center gap-2 text-xs text-zinc-300">
        <div className="relative">
          <div className="w-6 h-6 rounded-full border border-zinc-500 flex items-center justify-center">
            <span className="text-[10px]">{progress}%</span>
          </div>
        </div>
        <span>
          {current}/{total} bài học
        </span>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-4 text-xs text-zinc-300">
        <button className="hover:text-white transition flex items-center gap-1">
          <FileText size={14} />
          Ghi chú
        </button>
        <button className="hover:text-white transition flex items-center gap-1">
          <HelpCircle size={14} />
          Hướng dẫn
        </button>
      </div>
    </header>
  );
}
