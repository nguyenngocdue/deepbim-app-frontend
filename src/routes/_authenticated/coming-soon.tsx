import ComingSoonPage from '@/components/ComingSoonPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/coming-soon')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ComingSoonPage/>
}
