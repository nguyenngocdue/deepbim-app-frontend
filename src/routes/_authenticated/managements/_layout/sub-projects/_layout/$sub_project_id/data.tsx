import CloudManagement from '@/features/cloud'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/managements/_layout/sub-projects/_layout/$sub_project_id/data',
)({
  component: RouteComponent,
})

function RouteComponent() {
       const { sub_project_id } = Route.useParams();
  return (
    <>
      <CloudManagement entityId={Number(sub_project_id)}/>
    </>
  )
}
