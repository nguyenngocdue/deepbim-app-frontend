import { UserManagementTabs } from '@/features/auth/user-manager/UserManagementTabs'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/admin/_layout/users',
)({
  component: UserManagementTabs,
})


