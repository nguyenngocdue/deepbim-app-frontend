import EditProfilePage from '@/features/settings/common-information/edit/EditProfilePage'
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
