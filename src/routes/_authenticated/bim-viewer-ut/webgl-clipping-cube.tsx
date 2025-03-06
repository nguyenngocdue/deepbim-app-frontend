import WebglClippingCube from '@/components/bim-viewer/webgl-clipping-cube'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/bim-viewer-ut/webgl-clipping-cube',
)({
  component: WebglClippingCube,
})


