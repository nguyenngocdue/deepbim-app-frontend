import { createLazyFileRoute } from '@tanstack/react-router'
import BimViewerLayout from '@/pages/bim-viewer/BimViewerLayout'

export const Route = createLazyFileRoute('/_authenticated/bim-viewer-ut/')({
  component: BimViewerLayout,
})
