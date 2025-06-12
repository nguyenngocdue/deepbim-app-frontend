import TutorialHomePage from '@/features/tutorials/TutorialHomePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/tutorials/_layout/home-page')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>
    <TutorialHomePage/>
  </div>
}
