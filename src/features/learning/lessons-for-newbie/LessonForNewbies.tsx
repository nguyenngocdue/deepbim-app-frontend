import { useState } from "react";
import LessonSidebar from "./components/LessonSidebar";
import Player from "./components/Player";
import LessonContent from "./components/LessonContent";

export default function LessonForNewbies() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const contentData = {
    title: "Mô hình Client - Server là gì?",
    updateDate: "Cập nhật tháng 11 năm 2022",
    description:
      "Tham gia cộng đồng để cùng học hỏi, chia sẻ và 'thấm thía' xem F8 đã cố gắng như thế nào!",
    links: [
      { href: "https://www.facebook.com/f8vnofficial", text: "Fanpage" },
      { href: "https://www.facebook.com/groups/649972919142215", text: "Group" },
      { href: "https://www.youtube.com/F8VNOfficial", text: "Youtube" },
      { href: "https://www.facebook.com/sondnf8", text: "Sơn Đặng" },
    ],
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900/95 to-black/95 text-white">
      <main className="flex flex-col gap-6 p-4 sm:p-6 lg:grid lg:grid-cols-12 lg:gap-8 max-h-screen overflow-hidden">
        {/* Player + Content */}
        <div className="lg:col-span-8 max-h-screen overflow-y-auto">
          <div className="w-full aspect-video rounded-2xl shadow-2xl mb-6 sm:mb-8 bg-gradient-to-tr from-gray-800 to-gray-900">
            <Player videoId="vyiY9eKR4NY" />
          </div>
          <LessonContent
            title={contentData.title}
            updateDate={contentData.updateDate}
            description={contentData.description}
            links={contentData.links}
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <LessonSidebar />
        </div>
      </main>
    </div>
  );
}