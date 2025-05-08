import ProjectsManagement from '@/features/bim-viewer/modals/managements/projects'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/managements/_layout/projects',
)({
  component: ProjectsManagement,
})

