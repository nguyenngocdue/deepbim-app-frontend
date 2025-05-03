import MainView from '@/pages/bim-viewer/MainViewer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/view/')({
  component:  MainView,
})


