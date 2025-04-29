import ManagenentSpaces from '@/features/bim-viewer/management-spaces'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/managements/_layout/spaces',
)({
  component: ManagenentSpaces,
})

