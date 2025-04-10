import GeometrySceneViewCube from '@/components/bim-viewer/geometry-scene-viewcube'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/bim-viewer-ut/geometry-scene-viewcube',
)({
  component: GeometrySceneViewCube,
})

