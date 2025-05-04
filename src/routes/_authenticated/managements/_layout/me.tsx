import UserProjectsPage from '@/features/bim-viewer/modals/managements/management-me'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/managements/_layout/me')({
  component: UserProjectsPage,
})

