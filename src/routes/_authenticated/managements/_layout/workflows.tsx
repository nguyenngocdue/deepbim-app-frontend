import Workfolows from '@/features/workfolows/Workfolows'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/managements/_layout/workflows',
)({
  component: Workfolows,
})


