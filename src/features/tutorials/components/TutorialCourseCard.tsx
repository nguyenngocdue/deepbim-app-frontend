import { Users, Eye } from "lucide-react";

export interface CourseCardProps {
  title: string;
  author: string;
  image: string;
  avatar: string;
  students: number;
  views: number;
  oldPrice: string;
  newPrice: string;
}

export function TutorialCourseCard({
  title,
  author,
  image,
  avatar,
  students,
  views,
  oldPrice,
  newPrice,
}: CourseCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-72 sm:w-80 flex flex-col">
      <img src={image} alt={title} className="w-full h-40 object-cover" />

      <div className="flex justify-center -mt-5">
        <img src={avatar} alt={author} className="w-10 h-10 rounded-full border-4 border-white object-cover" />
      </div>

      <div className="text-center px-4 mt-2">
        <div className="text-sm font-medium text-gray-700">{author}</div>
        <div className="text-base font-semibold text-gray-900 mt-1 leading-tight">
          {title}
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-4 text-gray-500 text-sm">
        <div className="flex items-center gap-1">
          <Users size={14} /> {students}
        </div>
        <div className="flex items-center gap-1">
          <Eye size={14} /> {views}
        </div>
      </div>

      <div className="flex justify-center gap-2 my-4">
        <span className="line-through text-gray-400 text-sm">{oldPrice}</span>
        <span className="text-green-600 font-bold">{newPrice}</span>
      </div>
    </div>
  );
}
