import IfcViewerSelectionFamily from '@/components/bim-viewer/ifc-viewer-selection-family'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute(
  '/_authenticated/bim-viewer-ut/ifc-viewer-selection-family',
)({
  component: IfcViewerSelectionFamily,
})

