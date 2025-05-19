import PortfolioShowcase from '@/features/settings/common-information/show/portfolio/PortfolioShowcase'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/user/show/portfolio/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <>
      <PortfolioShowcase/>
    </>
  )
}
