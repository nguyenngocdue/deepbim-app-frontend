import MainPageViewer from '@/features/bim-viewer2/main-page/MainViewerPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/examples/bim-viewer/')({
  component: MainPageViewer,
})


