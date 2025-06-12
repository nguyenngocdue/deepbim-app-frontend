import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@radix-ui/react-collapsible";
import { ChevronRight } from "lucide-react";

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
  return (
    <aside className="w-full sm:w-80 bg-gradient-to-br from-gray-900 to-zinc-800 h-full overflow-y-auto rounded-xl shadow-xl">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-800 to-indigo-900 p-4 rounded-t-xl shadow-md mb-4">
        <h2 className="text-xl font-bold text-white">Nội dung khóa học</h2>
      </div>

      {/* Lesson Sections */}
      <div className="p-4 space-y-3">
        {sections.map((section, i) => (
          <Collapsible key={i} className="border border-zinc-700 rounded-lg">
            <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-zinc-800 hover:bg-zinc-700 transition-colors duration-200 text-white font-semibold rounded-lg">
              <span>{section.title}</span>
              <ChevronRight className="h-5 w-5 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2">
              {section.lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="p-3 bg-zinc-700/50 hover:bg-zinc-600/70 transition-colors duration-200 text-sm text-gray-200 rounded cursor-pointer"
                >
                  {lesson.title} <span className="text-gray-400">({lesson.duration})</span>
                </div>
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </aside>
  );
}