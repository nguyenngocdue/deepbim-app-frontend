import LessonLayout from "@/features/learning/lessons-for-newbie/LessonLayout";
import { createFileRoute, createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: LessonLayout
})