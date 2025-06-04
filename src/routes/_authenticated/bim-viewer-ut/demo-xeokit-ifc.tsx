import { TestXeokit } from '@/features/xeokit-demo-ifc/TestXeokit'
import { XeokitViewerWrapper } from '@/features/xeokit-demo-ifc/XeokitViewerWrapper'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/bim-viewer-ut/demo-xeokit-ifc',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <TestXeokit/>
}
