import { useState } from "react";
import CourseInfoSidebar from "./components/CourseInfoSidebar";
import TabNavigation from "./components/TabNavigation";
import CurriculumTab from "./components/CurriculumTab";
import MentorTab from "./components/MentorTab";
import CourseOverviewTab from "./components/CourseOverviewTab";
import { useLessonData } from "./hooks/useLessonData";
import { CourseHeader } from "./components/CourseHeader";

export default function CoursePage() {
  const [tabIndex, setTabIndex] = useState(0);
  const { lessons, selectedLesson, setSelectedLesson } = useLessonData(1);

  // Mock course data
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
      gradient: "from-emerald-500 to-teal-600",
    },
    {
      title: "Lập trình Dynamo API đỉnh cao",
      desc: "Học cách tích hợp Dynamo API vào dự án Python của bạn. Từ zero đến hero, sẵn sàng chinh phục mọi thử thách lập trình!",
      button: "BẮT ĐẦU HỌC",
      gradient: "from-indigo-500 to-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background  ">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        {/* Course Header */}
        <CourseHeader banners={banners} />
        {/* Main Content and Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 px-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <TabNavigation onTabChange={setTabIndex} />
            <div className="bg-gray-900/70 rounded-xl sm:p-4  shadow-lg backdrop-blur-sm max-w-full">
              {tabIndex === 0 && <CourseOverviewTab />}
              {tabIndex === 1 && <CurriculumTab sections={lessons} />}
              {tabIndex === 2 && <MentorTab {...mentor} />}
            </div>
          </div>

          {/* Sidebar */}
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