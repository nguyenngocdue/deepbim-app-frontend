import { useEffect, useState } from "react";
import LessonSidebar from "./components/LessonSidebar";
import Player from "./components/Player";
import LessonContent from "./components/LessonContent";
import { getLesson } from "@/apis/lesson-api";
import { useLocation } from "@tanstack/react-router";
import { useLessonData } from "@/features/courses/hooks/useLessonData";
import { toast } from "sonner";
import { WelcomeLessonMessage } from "./components/WelcomeLessonMessage";
import { BookOpen } from "lucide-react";
import { useSelector } from "react-redux";
import { PromptCard } from "./components/PromptCard";
import AppButton2 from "@/components/bim-viewer/common/AppButton2";
import { RootState } from "@/store";
import AuthGate from "@/features/auth/AuthGate";

export default function LessonForNewbies() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseId = searchParams.get("course_id");
  const lessonId = searchParams.get("lesson_id");
  const [videoUrl, setVideoUrl] = useState("");

  const { lessons, selectedLesson, setSelectedLesson, course } = useLessonData(courseId);
  const [lessonContent, setLessonContent] = useState(null);

  const { user: currentUser } = useSelector((state: RootState) => state.auth);


  // Fetch lesson by ID from URL if needed
  useEffect(() => {
    if (lessonId && !selectedLesson) {
      getLesson(Number(lessonId))
        .then((res) => {
          setSelectedLesson(res.data);
        })
        .catch((err) => {
          const errorMessage = err instanceof Error ? err.message : String(err);
          toast.error(`Failed to fetch lesson: ${errorMessage}`);
        });
    }
    if (selectedLesson && selectedLesson.content) {
      try {
        const parsed = JSON.parse(selectedLesson.content);
        setLessonContent(parsed);
      } catch (error) {
        setLessonContent(null);
      }
    }

  }, [lessonId, selectedLesson, setSelectedLesson]);


  // Handle lesson selection from sidebar
  const handleLessonSelect = (lesson: any) => {
    setSelectedLesson(lesson);
    lesson.is_locked ? setVideoUrl("") : setVideoUrl(lesson.video_url);
    const url = new URL(window.location.href);
    url.searchParams.set("lesson_id", lesson.id.toString());
    window.history.pushState({}, "", url);
  };

  return (
    <>
     <AuthGate fallback={null}>
    <div className="min-h-screen w-full bg-background relative">
      <main className="flex flex-col gap-4 p-2 sm:p-4 md:p-6 lg:grid lg:grid-cols-12 lg:gap-4 h-[calc(100vh-4rem)] overflow-hidden">
        {/* Player + Content */}
        <div className="lg:col-span-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <span className="flex items-center gap-2 py-3 px-4 sm:px-6 text-lg sm:text-xl font-semibold text-indigo-600 dark:text-indigo-400">
            <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500 dark:text-indigo-300" />
            Khóa học: {course?.title ?? ''}
          </span>
          <div className="flex flex-col h-full">
            <div className="w-full aspect-video rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl mb-4 sm:mb-6 bg-background">
              <Player videoUrl={videoUrl} selectedLesson={selectedLesson} />
            </div>
            <div className="flex-1 pb-16 sm:pb-20 px-2 sm:px-4">
              {lessonContent ? (
                <LessonContent contents={lessonContent} selectedLesson={selectedLesson} />
              ) : (
                <WelcomeLessonMessage />
              )}
            </div>
          </div>
        </div>
        {/* Sidebar */}
        <div className="lg:col-span-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <LessonSidebar
            sections={lessons}
            onLessonSelect={handleLessonSelect}
            lessonId={lessonId}
          />
        </div>
      </main>
      {!currentUser && (
        <div className="fixed inset-0 z-[9999] bg-background/50 backdrop-blur-[2px] flex items-center justify-center p-4">
          <PromptCard
            title="Bạn cần đăng nhập"
            description="Vui lòng đăng nhập để học tập nhé."
            imageUrl="https://minio.deepbim.net:9000/deepbim-fe/1750073553293-login.gif"
            action={
              <AppButton2
                btnType="move"
                isLoading={false}
                onClick={() => (window.location.href = '/sign-in')}
                falseName="Đăng nhập nhé"
              />
            }
          />
        </div>
      )}
    </div>
    </AuthGate>
    </>
  );

}
