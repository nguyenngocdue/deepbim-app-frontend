import AdminCoursesPage from '@/features/tutorials/admin/courses/AdminCoursesPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/tutorials/_layout/admin/courses')(
  {
    component: RouteComponent,
  },
)

function RouteComponent() {
  return <>
    <AdminCoursesPage/>
  </>
}
