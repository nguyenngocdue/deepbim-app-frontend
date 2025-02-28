import { createLazyFileRoute } from '@tanstack/react-router'
import BimViewerUT from '@/pages/bim-viewer/BimViewerUT'

export const Route = createLazyFileRoute('/_authenticated/bim-viewer-ut/')({
  component: BimViewerUT,
})
