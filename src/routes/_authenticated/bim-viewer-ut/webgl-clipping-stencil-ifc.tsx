// import WebglClippingStencilIfc from '@/components/bim-viewer/webgl-clipping-stencil-ifc'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/bim-viewer-ut/webgl-clipping-stencil-ifc',
)({
  component: WebglClippingStencilIfcPage,
})

function WebglClippingStencilIfcPage() {}

