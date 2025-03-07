import ViewCube from '@/components/bim-viewer/view-cube'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/bim-viewer-ut/view-cube',
)({
  component: ViewCube,
})


