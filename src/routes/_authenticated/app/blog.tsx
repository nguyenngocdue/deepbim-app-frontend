import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/app/blog')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/app/blog"!</div>
}
