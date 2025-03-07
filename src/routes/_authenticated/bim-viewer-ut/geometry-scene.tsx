import GeometryScene from '@/components/bim-viewer/geometry-scene'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/bim-viewer-ut/geometry-scene',
)({
  component: GeometryScene,
})

