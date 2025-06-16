import LessonLayout from "@/features/learning/lessons-for-newbie/LessonLayout";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/tutorials/learning/lessons-for-newbies/_layout")({
  component: LessonLayout
})