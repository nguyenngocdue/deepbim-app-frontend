import { TeamMessagePage } from '@/features/bim-viewer/modals/managements/team-chat'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/managements/_layout/teams/$teamId',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <TeamMessagePage />
    </>
  )
}
