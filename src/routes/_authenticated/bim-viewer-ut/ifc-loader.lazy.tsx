import { createLazyFileRoute } from '@tanstack/react-router'
import IfcLoader from '@/features/bim-viewer/statis/ifc-loader'

export const Route = createLazyFileRoute('/_authenticated/bim-viewer-ut/ifc-loader')({
  component: IfcLoader,
})
