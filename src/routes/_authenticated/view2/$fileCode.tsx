import RacHouseAutodesk from '@/features/bim-viewer2/instance-page/rac-house-autodesk/RacHouseAutodesk';
import XktDtxAPHS from '@/features/bim-viewer2/instance-page/xkt_dtx_APHS/XktDtxAPHS';
import MainPageViewer from '@/features/bim-viewer2/main-page/MainPageViewer';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/view2/$fileCode')({
  component: RouteComponent,
})

function RouteComponent() {
  const { fileCode } = Route.useParams();

  switch (fileCode) {
    case 'rac-house-autodesk':
      return <RacHouseAutodesk/>
    case 'xkt-dtx-APHS':
      return <XktDtxAPHS/>
    default:
      return <MainPageViewer/>      
  }
}
