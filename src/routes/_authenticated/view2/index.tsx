import MainPageViewer from '@/features/bim-viewer2/main-page/MainPageViewer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/view2/')({
  component: MainPageViewer,
})
