import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/tutorials/_layout/admin/members',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/tutorials/_layout/admin/members"!</div>
}
