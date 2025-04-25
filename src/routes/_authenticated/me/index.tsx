import ProjectManangementByMe from '@/features/bim-viewer/me'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/me/')({
  component: ProjectManangementByMe,
})

