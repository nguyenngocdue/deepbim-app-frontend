import MainViewer from '@/components/bim-viewer/MainViewer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/viewer/$fileCode')({
  component: MainViewer,
})
