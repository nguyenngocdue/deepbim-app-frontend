import { useState } from "react";
import CourseInfoSidebar from "./components/CourseInfoSidebar";
import TabNavigation from "./components/TabNavigation";
import CurriculumTab from "./components/CurriculumTab";
import MentorTab from "./components/MentorTab";
import CourseOverviewTab from "./components/CourseOverviewTab";
import { useLessonData } from "./hooks/useLessonData";
import { CoursePanel } from "./components/CoursePanel";

export default function CoursePage() {
  const [tabIndex, setTabIndex] = useState(0);
  const { lessons, selectedLesson, setSelectedLesson } = useLessonData(1);

  const courseInfo = {
    totalLessons: 292,
    quizzes: 0,
    duration: "24 tuần",
    level: "Mọi cấp độ",
    language: "Tiếng Việt",
    students: 2,
    certificate: false,
    assessment: true,
  };

  const mentor = {
    name: "Nguyễn Ngọc Duệ",
    avatar: "/assets/avatars/avatar_1.png",
    bio: "Mentor giàu kinh nghiệm chuyên Dynamo và giảng dạy hiệu quả.",
  };

  const banners = [
    {
      title: "Master Dynamo API với Python!",
      desc: "Khóa học từ cơ bản đến nâng cao, giúp bạn xây dựng ứng dụng mạnh mẽ với Dynamo API và Python. Tăng tốc sự nghiệp lập trình ngay hôm nay!",
      button: "ĐĂNG KÝ NGAY",
      gradient: "bg-gradient-to-r from-blue-500 to-emerald-500", // Modern blue-to-emerald gradient
    },
    {
      title: "Lập trình Dynamo API đỉnh cao",
      desc: "Học cách tích hợp Dynamo API vào dự án Python của bạn. Từ zero đến hero, sẵn sàng chinh phục mọi thử thách lập trình!",
      button: "BẮT ĐẦU HỌC",
      gradient: "bg-gradient-to-r from-gray-600 to-gray-800", // Subtle dark gradient
    },
  ];

  return (
    <div className="min-h-screen bg-background  text-gray-900 dark:text-gray-100">
      {/* Updated background for light/dark themes */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        <CoursePanel banners={banners} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 px-2 md:px-4">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <TabNavigation onTabChange={setTabIndex} />
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-2xl sm:p-5 shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700 transition-all">
              {/* Modern card with subtle border and shadow */}
              {tabIndex === 0 && <CourseOverviewTab />}
              {tabIndex === 1 && <CurriculumTab sections={lessons} />}
              {tabIndex === 2 && <MentorTab {...mentor} />}
            </div>
          </div>
          <div className="lg:col-span-1 order-first lg:order-last">
            <div className="lg:sticky lg:top-6 max-w-full lg:max-w-sm">
              <CourseInfoSidebar info={courseInfo} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}