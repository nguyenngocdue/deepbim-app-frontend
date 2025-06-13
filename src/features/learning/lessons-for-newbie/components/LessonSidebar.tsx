import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

const sections = [
  {
    title: "1. Khái niệm kỹ thuật cần biết",
    lessons: [
      { id: 1, title: "Mô hình Client - Server là gì?", duration: "11:35" },
      { id: 2, title: "Domain là gì? Tên miền là gì?", duration: "10:24" },
      { id: 3, title: "Mua áo F8 | Đăng ký học Offline", duration: "11:00" },
    ],
  },
  {
    title: "2. Môi trường, con người IT",
    lessons: [
      { id: 4, title: "Học IT cần tố chất gì?", duration: "24:10" },
      { id: 5, title: "Sinh viên IT đi thực tập...", duration: "34:51" },
      { id: 6, title: "Trải nghiệm thực tế...", duration: "47:13" },
    ],
  },
  {
    title: "3. Lập trình cơ bản",
    lessons: [
      { id: 7, title: "Giới thiệu về HTML", duration: "15:30" },
      { id: 8, title: "Cú pháp CSS cơ bản", duration: "20:45" },
      { id: 9, title: "JavaScript cho người mới", duration: "25:10" },
    ],
  },
  {
    title: "4. Phát triển Web",
    lessons: [
      { id: 10, title: "Xây dựng trang web tĩnh", duration: "18:20" },
      { id: 11, title: "Sử dụng React cơ bản", duration: "30:00" },
      { id: 12, title: "Tích hợp API", duration: "22:15" },
    ],
  },
  {
    title: "5. Cơ sở dữ liệu",
    lessons: [
      { id: 13, title: "Giới thiệu về SQL", duration: "19:40" },
      { id: 14, title: "Quản lý dữ liệu với MySQL", duration: "25:50" },
      { id: 15, title: "Tối ưu hóa truy vấn", duration: "17:30" },
    ],
  },
  {
    title: "6. An ninh mạng",
    lessons: [
      { id: 16, title: "Cơ bản về bảo mật", duration: "21:00" },
      { id: 17, title: "Ngăn chặn tấn công DDoS", duration: "28:15" },
      { id: 18, title: "Mã hóa dữ liệu", duration: "23:45" },
    ],
  },
];

export default function LessonSidebar() {
  const [activeLessonId, setActiveLessonId] = useState<number | null>(null);


  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-b from-gray-900 to-black shadow-xl">
      {/* Fixed Header (outside scrollable area) */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-4">
        <h2 className="text-lg font-semibold text-white tracking-tight sm:text-xl md:text-lg lg:text-xl">
          Nội dung khóa học
        </h2>
      </div>

      {/* Scrollable Section List */}
      <aside className="flex-1 overflow-y-auto px-2 py-4 space-y-3">
        {sections.map((section, i) => (
          <Collapsible
            key={i}
            defaultOpen={i === 0}
            className="border border-gray-700 rounded-xl overflow-hidden shadow-sm"
          >
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 sm:p-4 bg-gray-800/80 hover:bg-gray-700/80 transition-colors duration-300 text-white font-medium text-sm sm:text-base md:text-sm lg:text-base group">
              <span className="truncate max-w-[85%]">{section.title}</span>
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-300 group-data-[state=open]:rotate-90 transition-transform duration-300 ease-in-out" />
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-gray-900/60">
              {section.lessons.map((lesson) => (
                 <button
                      key={lesson.id}
                      onClick={() => setActiveLessonId(lesson.id)}
                      className={`w-full text-left p-3 sm:p-4 text-sm sm:text-base flex justify-between items-center transition-colors duration-300 rounded-lg ${
                        activeLessonId === lesson.id
                          ? "bg-orange-500/30 text-orange-200 border-l-4 border-orange-500"
                          : "bg-gray-800/60 hover:bg-gray-700/90 text-gray-200"
                      }`}
                      aria-label={`Chọn bài học: ${lesson.title}`}
                    >
                      <span className="truncate max-w-[70%] sm:max-w-[75%]">{lesson.title}</span>
                      <span className="text-xs sm:text-sm text-gray-400 flex-shrink-0">
                        {lesson.duration}
                      </span>
                    </button>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </aside>
    </div>
  );
}

