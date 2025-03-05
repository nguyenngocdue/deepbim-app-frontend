import WebglClippingV1 from '@/components/bim-viewer/webgl-clipping-v1'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/bim-viewer-ut/webgl-clipping-v1',
)({
  component: WebglClippingV1,
})

