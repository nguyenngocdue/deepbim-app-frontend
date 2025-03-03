import { createLazyFileRoute } from '@tanstack/react-router'
import IfcLoader from '@/features/bim-viewer/statis/IfcLoader'

export const Route = createLazyFileRoute('/_authenticated/bim-viewer-ifc/')({
  component: IfcLoader,
})
