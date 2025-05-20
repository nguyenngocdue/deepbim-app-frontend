import { TeamMessagePage } from '@/features/bim-viewer/modals/managements/team-chat'
import { createFileRoute, useParams } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/managements/_layout/teams/$team_id',
)({
  component: RouteComponent,
})

function RouteComponent() {
   const { team_id } = Route.useParams();
  return (
    <>
      <TeamMessagePage  teamId={team_id}/>
    </>
  )
}
