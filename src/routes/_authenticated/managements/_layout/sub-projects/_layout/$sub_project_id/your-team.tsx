import UserTeamPage from '@/features/bim-viewer/modals/managements/teams-by-user'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/managements/_layout/sub-projects/_layout/$sub_project_id/your-team',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
     <UserTeamPage/>
    </>
  )
}
