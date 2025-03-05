import WebglClipping from '@/components/bim-viewer/webgl-clipping'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/bim-viewer-ut/webgl-clipping',
)({
  component: WebglClipping,
})

