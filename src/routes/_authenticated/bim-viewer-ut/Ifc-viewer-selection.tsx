import IfcViewerSelection from '@/components/bim-viewer/ifc-viewer-selection'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/bim-viewer-ut/Ifc-viewer-selection',)({
  component: IfcViewerSelection,
})

