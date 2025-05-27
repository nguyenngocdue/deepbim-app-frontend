import { SubProjectDashboard } from '@/features/sub-projects';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/managements/_layout/sub-projects/_layout/$sub_project_id/dashboard',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { sub_project_id } = Route.useParams();
  return (
    <>
      <SubProjectDashboard subProjectId={Number(sub_project_id)}/>
    </>
  )
}
