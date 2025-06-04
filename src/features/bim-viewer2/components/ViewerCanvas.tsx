import {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react"
import {
  Viewer,
  NavCubePlugin,
  FastNavPlugin,
  XKTLoaderPlugin,
  XKTLoaderPluginParams,
} from "@xeokit/xeokit-sdk"

export interface ViewerCanvasHandle {
  getViewer: () => Viewer | null
}

interface ViewerCanvasProps {
  modelConfig: XKTLoaderPluginParams
}

const ViewerCanvas = forwardRef<ViewerCanvasHandle, ViewerCanvasProps>(
  ({ modelConfig }, ref) => {
    const viewerRef = useRef<Viewer | null>(null)

    useImperativeHandle(ref, () => ({
      getViewer: () => viewerRef.current,
    }))

    useEffect(() => {
      const viewer = new Viewer({
        canvasId: "myCanvas",
        transparent: true,
        dtxEnabled: true,
      })

      viewer.camera.eye = [-3.933, 2.855, 27.018]
      viewer.camera.look = [4.4, 3.724, 8.899]
      viewer.camera.up = [-0.018, 0.999, 0.039]

      viewerRef.current = viewer

      // 🚀 Load model
      const xktLoader = new XKTLoaderPlugin(viewer)
      const model = xktLoader.load(modelConfig)

      model.on("loaded", () => {
        viewer.cameraFlight.jumpTo(model) 
        })

      // 🧭 NavCube Plugin
      const navCube = new NavCubePlugin(viewer, {
        canvasId: "myNavCubeCanvas",
        color: "#D9D9D9",
        hoverColor: "#B0B0B0",
        textColor: "#333333",
        cameraFly: true,
        cameraFitFOV: 45,
        cameraFlyDuration: 0.5,
        visible: true,
      })

  
      // ⚡ FastNav Plugin
      new FastNavPlugin(viewer, {
        hideEdges: true,
        hideSAO: true,
        hideColorTexture: true,
        hidePBR: true,
        hideTransparentObjects: false,
        scaleCanvasResolution: false,
        scaleCanvasResolutionFactor: 0.5,
        delayBeforeRestore: true,
        delayBeforeRestoreSeconds: 0.4,
      })

      
    }, [modelConfig])

    return (
      <>
        <canvas
          id="myCanvas"
          className="fixed inset-0 w-screen h-screen z-0"
        />
        <canvas
          id="myNavCubeCanvas"
          className="fixed top-4 right-4 w-[200px] h-[200px] z-50"
        />
      </>
    )
  }
)

export default ViewerCanvas
