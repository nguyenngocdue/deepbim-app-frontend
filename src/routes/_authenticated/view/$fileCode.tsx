import MainViewer from '@/components/bim-viewer/MainViewer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/view/$fileCode')({
  component: MainViewer,
})
