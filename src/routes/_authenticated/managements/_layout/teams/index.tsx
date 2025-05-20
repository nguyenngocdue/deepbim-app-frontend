import TeamPage from '@/features/bim-viewer/modals/managements/teams'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/managements/_layout/teams/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <TeamPage/>
  </div>
}
