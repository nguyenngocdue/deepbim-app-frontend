import InstancedMesh from '@/pages/bim-viewer/instanced-mesh'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/bim-viewer-ut/instanced-mesh')({
  component: InstancedMesh,
})
