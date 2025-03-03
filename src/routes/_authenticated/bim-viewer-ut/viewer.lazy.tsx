import BimViewerUT from '@/pages/bim-viewer/bim-viewer-ut'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/bim-viewer-ut/viewer')({
  component: BimViewerUT,
})
