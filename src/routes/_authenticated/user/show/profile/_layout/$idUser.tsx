import ShowProfile from '@/features/settings/profile/show/ShowProfile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/user/show/profile/_layout/$idUser',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div><ShowProfile/></div>
  )
}
