import { CheckCircle, Circle } from "lucide-react";

interface LessonItemProps {
  title: string;
  duration: string;
  isCompleted?: boolean;
  onClick?: () => void;
}

export default function LessonItem({
  title,
  duration,
  isCompleted = false,
  onClick,
}: LessonItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
        !isCompleted ? "text-orange-500" : "text-green-500"
      }`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
    >
      <div className="flex items-center gap-2">
        {isCompleted ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <Circle className="h-4 w-4 text-orange-500" />
        )}
        <span className="truncate">{title}</span>
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">{duration}</span>
    </div>
  );
}