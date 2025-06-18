import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/app/viewer/viewer')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/app/viewer/viewer"!</div>
}
