import SubProjectLayout from '@/features/sub-projects/components/SubProjectLayout';
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/managements/_layout/sub-projects/$id',
)({
  component: RouteComponent,
})

function RouteComponent() {
     const { id } = Route.useParams();
  return (
    <>
      <SubProjectLayout subProjectId={Number(id)}/>
    </>
  )
}