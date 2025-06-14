import { useState } from "react";
import { Users, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { RegisterPopup } from "./RegisterPopup"; // Component mới
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
          "relative bg-white rounded-2xl shadow-lg shadow-slate-800 dark:shadow-slate-800 border border-slate-200 dark:border-slate-600 transition-all duration-300 overflow-hidden w-72 sm:w-80 flex flex-col cursor-pointer group hover:shadow-[0_0_25px_4px_rgba(34,197,94,0.4)] hover:-translate-y-1"
        )}
      >
        {/* Status Badge */}
        {statusLabel && statusClassName && (
          <Badge
            className={cn(
              "absolute top-2 right-2 z-10 text-xs px-2 py-0.5 rounded-full",
              statusClassName
            )}
          >
            {statusLabel}
          </Badge>
        )}

        {/* Cover Image */}
        <a href={url || "#"} target="_blank" rel="noopener noreferrer">
          <img
            src={image}
            alt={title}
            className="w-full h-40 object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        </a>

        {/* Author avatar */}
        <div className="flex justify-center -mt-5 z-50">
          <img
            src={avatar}
            alt={author}
            className="w-10 h-10 rounded-full border-4 border-slate-300 object-cover"
          />
        </div>

        {/* Course info */}
        <div className="text-center px-4 mt-2">
          <div className="text-sm font-medium text-gray-700">{author}</div>
          <div className="text-base font-semibold text-gray-900 mt-1 leading-tight">
            {title}
          </div>
          {description && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
              {description}
            </p>
          )}
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-6 mt-4 text-gray-500 text-sm">
          <div className="flex items-center gap-1">
            <Users size={14} /> {students}
          </div>
          <div className="flex items-center gap-1">
            <Eye size={14} /> {views}
          </div>
        </div>

        {/* Pricing */}
        <div className="flex justify-center gap-2 my-4">
          <span className="line-through text-gray-400 text-sm">{oldPrice}</span>
          <span className="text-green-600 font-bold">{newPrice}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-3 mb-4">
          <Link to={`/tutorials/learning/lessons-for-newbies/?course_id=${courseId}`} rel="noopener noreferrer">
            <Badge
              className={cn(
                "text-xs px-3 py-1 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
              )}
            >
              Học ngay
            </Badge>
            </Link>
          <Link to={`/tutorials/introduction-course/?course_id=${courseId}`} rel="noopener noreferrer">
            <Badge
              className={cn(
                "text-xs px-3 py-1 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-200"
              )}
            >
              Tìm Hiểu
            </Badge>
          </Link>
          <button
            onClick={() => setIsPopupOpen(true)}
            className={cn(
              "text-xs px-3 py-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200"
            )}
          >
            Đăng ký ngay
          </button>
        </div>
      </div>

        <RegisterPopup courseId={courseId} title={title} onClose={() => setIsPopupOpen(false)} open={isPopupOpen}/>
    </>
  );
}