import MainPageViewer from '@/features/bim-viewer2/main-page/MainPageViewer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/managements/_layout/model-previews',
)({
  component: MainPageViewer,
})
