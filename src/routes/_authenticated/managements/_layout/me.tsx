import UserProjectsPage from '@/features/bim-viewer/me'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/managements/_layout/me')({
  component: UserProjectsPage,
})

