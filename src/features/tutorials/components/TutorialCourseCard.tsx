import { useState } from "react";
import { Users, Eye, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { RegisterPopup } from "./RegisterPopup";
import { CourseCardProps } from "./Type";

export function TutorialCourseCard({
  title,
  author,
  image,
  avatar,
  students,
  views,
  oldPrice,
  newPrice,
  description,
  url,
  statusLabel,
  statusClassName,
  courseId,
}: CourseCardProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
     <div
  className={cn(
    "relative rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-300 w-80 flex flex-col justify-between cursor-pointer group hover:shadow-emerald-500/40 hover:-translate-y-1 hover:scale-[1.02] min-h-[440px]"
  )}
>
  {statusLabel && (
    <Badge className="absolute top-2 right-2 z-10 text-xs px-2 py-0.5 rounded-full text-white font-semibold shadow ring-1 ring-white/30 bg-gradient-to-r from-emerald-500 to-teal-500">
      {statusLabel}
    </Badge>
  )}

  <a href={url || `/tutorials/introduction-course/?course_id=${courseId}`} target="_blank" rel="noopener noreferrer">
    <img
      src={image}
      alt={title}
      className="w-full h-40 object-cover rounded-t-2xl group-hover:scale-[1.06] transition-transform duration-500 ease-in-out"
    />

    <div className="flex justify-center -mt-6 z-50">
      <img
        src={avatar}
        alt={author}
        className="w-14 h-14 rounded-full border-4 border-white dark:border-slate-700 object-cover shadow-md"
      />
    </div>

    <div className="text-center px-4 mt-2">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-300 line-clamp-1">{author}</div>
      <div className="text-lg font-bold text-gray-900 dark:text-white mt-1 leading-snug line-clamp-2">
        {title}
      </div>
      <div className="flex justify-center gap-0.5 mt-1 text-amber-400 text-xs">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={14} fill="currentColor" stroke="none" />
        ))}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5 line-clamp-3 min-h-[3.4em]">
        {description || <span className="opacity-0">empty filler</span>}
      </p>
    </div>

    <div className="flex justify-center gap-4 mt-3 text-gray-500 dark:text-gray-400 text-xs">
      <div className="flex items-center gap-1">
        <Users size={12} /> {students}
      </div>
      <div className="flex items-center gap-1">
        <Eye size={12} /> {views}
      </div>
    </div>

    <div className="flex justify-center gap-2 mt-3 mb-2">
      <span className="line-through text-gray-400 text-xs">{oldPrice}</span>
      <span className="text-emerald-600 dark:text-emerald-400 font-bold text-base">{newPrice}</span>
    </div>
  </a>

  <div className="flex justify-center gap-2 mb-4 px-3 mt-auto">
    <Link
      to={`/tutorials/learning/lessons-for-newbies/?course_id=${courseId}`}
      rel="noopener noreferrer"
      className="flex-1"
    >
      <Badge className="block text-center text-[10px] px-3 py-1.5 w-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 transition-colors duration-200 shadow-sm">
        Học ngay
      </Badge>
    </Link>
    <Link
      to={`/tutorials/introduction-course/?course_id=${courseId}`}
      rel="noopener noreferrer"
      className="flex-1"
    >
      <Badge className="block text-center text-[10px] px-3 py-1.5 w-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 transition-colors duration-200 shadow-sm">
        Tìm hiểu
      </Badge>
    </Link>
    <button
      onClick={() => setIsPopupOpen(true)}
      className="flex-1 text-[10px] px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white hover:from-blue-600 hover:to-indigo-600 transition-colors duration-200 shadow-sm"
    >
      Đăng ký
    </button>
  </div>
</div>

      <RegisterPopup
        courseId={courseId}
        title={title}
        onClose={() => setIsPopupOpen(false)}
        open={isPopupOpen}
      />
    </>
  );
}