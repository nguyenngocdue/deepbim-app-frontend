import SubProjectsManagement from '@/features/bim-viewer/modals/managements/sub-projects'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/managements/_layout/sub-projects/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <SubProjectsManagement/>
}
