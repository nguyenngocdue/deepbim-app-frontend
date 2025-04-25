import ManagementPage from '@/pages/ManagementPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/managements/me')({
  component: ManagementPage,
})

