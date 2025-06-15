import { useEffect, useState } from "react";
import LessonSidebar from "./components/LessonSidebar";
import Player from "./components/Player";
import LessonContent from "./components/LessonContent";
import { getLesson } from "@/apis/lesson-api";
import { useLocation } from "@tanstack/react-router";
import { useLessonData } from "@/features/courses/hooks/useLessonData";
import { toast } from "sonner";

export default function LessonForNewbies() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const courseId = searchParams.get("course_id");
  const lessonId = searchParams.get("lesson_id");

  const { lessons, selectedLesson, setSelectedLesson } = useLessonData(courseId);
  const [lessonContent, setLessonContent] = useState(null);

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
    if(selectedLesson  && selectedLesson.content){
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
    const url = new URL(window.location.href);
    url.searchParams.set("lesson_id", lesson.id.toString());
    window.history.pushState({}, "", url);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-900/95 to-black/95 text-white">
      <main className="flex flex-col gap-6 p-4 sm:p-6 lg:grid lg:grid-cols-12 lg:gap-8 max-h-screen overflow-hidden">
        {/* Player + Content */}
        <div className="lg:col-span-8 max-h-screen overflow-y-auto">
          <div className="w-full aspect-video rounded-2xl shadow-2xl mb-6 sm:mb-8 bg-gradient-to-tr from-gray-800 to-gray-900">
            <Player videoUrl={selectedLesson?.video_url ?? ""} />
          </div>
             {lessonContent && <LessonContent contents={lessonContent} selectedLesson={selectedLesson}/> }
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <LessonSidebar sections={lessons} onLessonSelect={handleLessonSelect} lessonId={lessonId}/>
        </div>
      </main>
    </div>
  );
}
