import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/managements/_layout/spaces',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/managements/_layout/spaces"!</div>
}
