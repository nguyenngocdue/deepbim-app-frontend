import ViewerCanvas from "../../components/ViewerCanvas"

export default function XktDtxAPHS({viewId} : {viewId: string}) {
  const modelConfig = {
    id: "model_1",
    src: "/ifc/APHS.xkt",    
     edges: true,
        saoEnabled: false
  }

  return <ViewerCanvas modelConfig={modelConfig} viewId={viewId}/>
}
