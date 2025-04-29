import ManagenentHome from '@/features/bim-viewer/management-home'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/managements/_layout/home',
)({
  component: ManagenentHome,
})

