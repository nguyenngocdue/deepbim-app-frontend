import { useState } from "react";
import CourseHeader from "./components/CourseHeader";
import CourseInfoSidebar from "./components/CourseInfoSidebar";
import TabNavigation from "./components/TabNavigation";
import CurriculumTab from "./components/CurriculumTab";
import MentorTab from "./components/MentorTab";
import CourseOverviewTab from "./components/CourseOverviewTab";
import { useLessonData } from "./hooks/useLessonData";

export default function CoursePage() {
  const [tabIndex, setTabIndex] = useState(0);
  const {lessons, selectedLesson, setSelectedLesson } = useLessonData(1);


  // Giả lập dữ liệu
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


  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8 ">
        {/* Course Header */}
        <CourseHeader />

        {/* Main Content and Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 ">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <TabNavigation onTabChange={setTabIndex} />
            <div className="bg-gray-900/50 rounded-xl p-4 shadow-lg ">
              {tabIndex === 0 && <CourseOverviewTab />}
              {tabIndex === 1 && <CurriculumTab sections={lessons} />}
              {tabIndex === 2 && <MentorTab {...mentor} />}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <CourseInfoSidebar info={courseInfo} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}