import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/blog/_layout/contact')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/blog/_layout/contact"!</div>
}
