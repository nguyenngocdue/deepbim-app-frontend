import { useState, useEffect } from "react";
import { fetchLessonTreeByCourseId } from "@/apis/lesson-api";
import { useLocation } from "@tanstack/react-router";

type Lesson = {
  id: number;
  title: string;
  video_url?: string;
};

export function useLessonData(courseId?: string | null) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id = courseId ?? searchParams.get("course_id");

  useEffect(() => {
    if (id) {
      fetchLessonTreeByCourseId(Number(id))
        .then((res) => {
          setLessons(res.data);
        })
        .catch((err) => {
          console.error("Failed to load lessons:", err);
        });
    }
  }, [id]);

  return { lessons, selectedLesson, setSelectedLesson };
}