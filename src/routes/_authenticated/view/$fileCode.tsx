import MainViewer from '@/pages/bim-viewer/MainViewer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/view/$fileCode')({
  component: RouteComponent,
})

function RouteComponent() {
  return <>
    <MainViewer/>
  </>
}