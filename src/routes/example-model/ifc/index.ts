import MainViewer from '@/pages/bim-viewer/MainViewer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/example-model/ifc/')({
  component: MainViewer
})


