import WebglClippingBVH from '@/components/bim-viewer/webgl-clipping-v2'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/bim-viewer-ut/webgl-clipping-v2',
)({
  component: WebglClippingBVH,
})

