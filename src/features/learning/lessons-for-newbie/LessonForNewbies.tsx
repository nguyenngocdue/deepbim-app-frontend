import { useEffect, useState } from "react";
import LessonSidebar from "./components/LessonSidebar";
import Player from "./components/Player";
import LessonContent from "./components/LessonContent";
import { fetchLessonTreeByCourseId } from "@/apis/lesson-api";
import { useLocation } from "@tanstack/react-router";

type Lesson = {
  id: number;
  title: string;
  video_url?: string; // Make video_url optional to match imported type
};


export default function LessonForNewbies() {
  const [lessons, setLessons] = useState([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseId = searchParams.get("course_id");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    if (courseId) {
      fetchLessonTreeByCourseId(Number(courseId))
        .then((res) => {
          setLessons(res.data);
        })
        .catch((err) => {
          console.error("Failed to load lessons:", err);
        });
    }
  }, [courseId]);

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
            <Player videoUrl={selectedLesson?.video_url ?? ""} />
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
          <LessonSidebar sections={lessons} onLessonSelect={(lesson) => setSelectedLesson(lesson)} />
        </div>
      </main>
    </div>
  );
}
