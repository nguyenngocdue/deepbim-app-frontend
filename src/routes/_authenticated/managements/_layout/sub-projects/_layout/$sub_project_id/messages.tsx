import { TeamMessagePage } from '@/features/bim-viewer/modals/managements/team-chat'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/managements/_layout/sub-projects/_layout/$sub_project_id/messages',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
     <TeamMessagePage/> 
    </>
  )
}
