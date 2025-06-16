import AdminLessonsPage from '@/features/tutorials/admin/lessons/AdminLessonsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/tutorials/_layout/admin/lessons',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
      <AdminLessonsPage/>
  </>
}
