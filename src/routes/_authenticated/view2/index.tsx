import MainPageViewer from '@/features/bim-viewer2/main-page/MainViewerPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/view2/')({
  component: MainPageViewer,
})
