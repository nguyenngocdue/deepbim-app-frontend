import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/managements/_layout/sub-projects/_layout/$sub_project_id/issues',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div>
      Hello
      "/_authenticated/managements/_layout/sub-projects/$sub_project_id/issues"!
    </div>
  )
}
