import SubProjectLayout from '@/features/sub-projects/components/SubProjectLayout';
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/managements/_layout/sub-projects/_layout',
)({
  component: RouteComponent,
})

function RouteComponent() {
     const { sub_project_id } = Route.useParams();
  return (
    <>
      <SubProjectLayout subProjectId={Number(sub_project_id)}/>
    </>
  )
}