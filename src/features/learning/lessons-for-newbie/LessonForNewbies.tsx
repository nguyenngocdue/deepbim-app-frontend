import LessonSidebar from "./components/LessonSidebar";
import Player from "./components/Player";
import LessonContent from "./components/LessonContent";

export default function LessonForNewbies() {
  const contentData = {
    title: "Mô hình Client - Server là gì?",
    updateDate: "Cập nhật tháng 11 năm 2022",
    description: "Tham gia cộng đồng để cùng học hỏi, chia sẻ và 'thấm thía' xem F8 đã cố gắng như thế nào!",
    links: [
      { href: "https://www.facebook.com/f8vnofficial", text: "Fanpage" },
      { href: "https://www.facebook.com/groups/649972919142215", text: "Group" },
      { href: "https://www.youtube.com/F8VNOfficial", text: "Youtube" },
      { href: "https://www.facebook.com/sondnf8", text: "Sơn Đặng" },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-gray-900 to-zinc-900 text-white w-full">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] h-[calc(100vh-64px)]">
        <main className="p-6 overflow-y-auto">
          <div className="w-full aspect-video bg-gradient-to-tr from-blue-900 to-zinc-900 rounded-xl overflow-hidden shadow-2xl mb-8">
            <Player videoId="vyiY9eKR4NY" />
          </div>
          <LessonContent
            title={contentData.title}
            updateDate={contentData.updateDate}
            description={contentData.description}
            links={contentData.links}
          />
        </main>
        <aside className="hidden lg:block bg-gradient-to-tr from-zinc-800 to-gray-800 p-4 overflow-y-auto shadow-inner border-l border-zinc-700">
          <LessonSidebar />
        </aside>
      </div>
    </div>
  );
}