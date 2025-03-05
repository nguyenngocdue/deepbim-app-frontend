import WebglClippingStencil from '@/components/bim-viewer/webgl-clipping-stencil'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/bim-viewer-ut/webgl-clipping-stencil',
)({
  component: WebglClippingStencil,
})


