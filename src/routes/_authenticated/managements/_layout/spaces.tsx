import ManagenentSpaces from '@/features/bim-viewer/modals/managements/management-spaces'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/managements/_layout/spaces',
)({
  component: ManagenentSpaces,
})

