interface Lesson {
  id: number;
  title: string;
  duration: string;
  isLocked: boolean;
}

interface LessonListItemProps {
  lesson: Lesson;
}

export default function LessonListItem({ lesson }: LessonListItemProps) {
  return (
    <li className="flex justify-between items-center px-4 py-2 bg-zinc-800/60 rounded-lg hover:bg-zinc-700">
      <span className="truncate text-sm">
        {lesson.title}
      </span>
      <span className="text-xs text-zinc-400">{lesson.duration}</span>
    </li>
  );
}
