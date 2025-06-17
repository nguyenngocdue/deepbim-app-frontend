import { useState, useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { fetchLessonsSectionsByUser } from "@/apis/lesson-api";
import { Lesson } from "@/components/courses/Types";
import { toast } from "sonner";



export function useLessonData(courseId?: string | null) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null | []>([]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = courseId ?? searchParams.get("course_id");

  useEffect(() => {
    const fetchLesson =  async () => {
      const [ lessonsRes ] = await Promise.all([ fetchLessonsSectionsByUser(Number(id))])
      try {
        if(lessonsRes.ok) {
          setLessons(lessonsRes.data);
        }
      } catch(err) {
        if (err instanceof Error) {
          toast.error(`Failed to load user-lesson-accesses: ${err.message}`);
        } else {
          toast.error("Failed to load user-lesson-accesses");
        }
      }
    }
    fetchLesson();
  }, [id])

  return { lessons, selectedLesson, setSelectedLesson };
}