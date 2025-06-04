import ViewerCanvas from "../../components/ViewerCanvas"

export default function XktDtxAPHS() {
  const modelConfig = {
    id: "model_1",
    src: "/ifc/Duplex.ifc.xkt",
    edges: true,
  }

  return <ViewerCanvas modelConfig={modelConfig} />
}
