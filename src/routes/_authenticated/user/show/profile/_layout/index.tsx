import ShowProfile from '@/features/settings/common-information/show/profile/ShowProfile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/user/show/profile/_layout/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div><ShowProfile/></div>
}
