import ConnectorPage from '@/pages/ConnectorPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/connectors')({
  component: ConnectorPage,
})
