import PersonalCV from '@/features/settings/profile/show/personal-cv/PersonalCV'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/user/show/cv/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div><PersonalCV/></div>
  )
}
