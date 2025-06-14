import AdminEnrollmentsPage from '@/features/tutorials/admin/enrollments/AdminEnrollmentsPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/tutorials/_layout/admin/enrollments',)({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <AdminEnrollmentsPage/> 
  </>
}