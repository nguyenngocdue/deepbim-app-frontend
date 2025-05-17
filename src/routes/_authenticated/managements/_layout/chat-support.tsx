import ChatSupport from '@/features/admin/chat-support'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/managements/_layout/chat-support',
)({
  component: ChatSupport,
})

