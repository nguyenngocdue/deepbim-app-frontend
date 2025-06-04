import RacHouseAutodesk from '@/features/bim-viewer2/instance-page/rac-house-autodesk/RacHouseAutodesk';
import ViewerFile from '@/features/bim-viewer2/instance-page/viewer-file/ViewerFile';
import XktDtxAPHS from '@/features/bim-viewer2/instance-page/xkt_dtx_APHS/XktDtxAPHS';
import MainPageViewer from '@/features/bim-viewer2/main-page/MainPageViewer';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/view2/$fileCode')({
  component: RouteComponent,
})

function RouteComponent() {
  const { fileCode } = Route.useParams();
  const search = Route.useSearch() as { v?: string };
  const viewId = search?.v;

  if(viewId) {
    return <ViewerFile viewId={viewId}/>
  } 
  switch (fileCode) {
    case 'rac-house-autodesk':
      return <RacHouseAutodesk/>
    case 'xkt-dtx-APHS':
      return <XktDtxAPHS/>
    default:
      return <MainPageViewer/>      
  }

}
