import CloudManagerment from '@/features/bim-viewer/modals/managements/cloud'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/managements/_layout/sub-projects/$sub_project_id',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <CloudManagerment />
    </>
  )
}
