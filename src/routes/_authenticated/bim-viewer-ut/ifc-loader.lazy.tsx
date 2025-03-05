import { createLazyFileRoute } from '@tanstack/react-router'
import IfcLoader from '@/components/bim-viewer/ifc-loader'

export const Route = createLazyFileRoute('/_authenticated/bim-viewer-ut/ifc-loader')({
  component: IfcLoader,
})
