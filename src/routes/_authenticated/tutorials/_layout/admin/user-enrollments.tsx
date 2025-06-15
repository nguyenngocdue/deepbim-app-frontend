import UserEnrollmentsPage from '@/features/tutorials/admin/user-enrollments/UserEnrollmentsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/tutorials/_layout/admin/user-enrollments',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <UserEnrollmentsPage/>
  )
}
