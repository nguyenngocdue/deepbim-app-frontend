import CoursePage from '@/features/courses/CoursePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/tutorials/_layout/introduction-course',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
     <CoursePage/>
  )
}
