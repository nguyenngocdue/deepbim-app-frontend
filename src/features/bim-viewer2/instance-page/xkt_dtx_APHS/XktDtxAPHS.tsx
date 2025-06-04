import ViewerCanvas from "../../components/ViewerCanvas"

export default function XktDtxAPHS() {
  const modelConfig = {
    id: "model_1",
    src: "/ifc/1749021122068-school_str.xkt",
    edges: true,
  }

  return <ViewerCanvas modelConfig={modelConfig} />
}
