import EditProfilePage from '@/features/settings/profile/edit/EditProfile'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/user/settings/profile/edit/_layout/$idUser',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div><EditProfilePage/></div>
  )
}
