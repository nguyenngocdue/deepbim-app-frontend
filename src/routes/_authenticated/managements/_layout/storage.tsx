import CloudManagerment from '@/features/bim-viewer/modals/managements/cloud'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/managements/_layout/storage',
)({
  component: CloudManagerment,
})

