import { useEffect, useRef, useState } from "react"
import {
  Viewer,
  XKTLoaderPlugin,
  FastNavPlugin,
  NavCubePlugin,
} from "@xeokit/xeokit-sdk"
import { initFastNav } from "../../components/plugins"

export default function XktDtxAPHS() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const navCubeRef = useRef<HTMLCanvasElement>(null)
  const [loadTime, setLoadTime] = useState<string>("Loading model...")

  useEffect(() => {
    if (!canvasRef.current || !navCubeRef.current) return

    const viewer = new Viewer({
      canvasId: canvasRef.current.id,
      transparent: true,
      dtxEnabled: true,
      saoEnabled: true,
    })

    viewer.camera.eye = [-23.68, 96.85, 30.65]
    viewer.camera.look = [60.59, 42.37, -25.39]
    viewer.camera.up = [0.39, 0.88, -0.26]

    // new NavCubePlugin(viewer, {
    //   canvasId: navCubeRef.current.id,
    //   visible: true,
    //   size: 250,
    //   alignment: "bottomRight",
    //   bottomMargin: 100,
    //   rightMargin: 10,
    // })

    initFastNav(viewer);
    const xktLoader = new XKTLoaderPlugin(viewer)

    const t0 = performance.now()

    const sceneModel = xktLoader.load({
      id: "132",
      src: "/ifc/APHS.xkt", // Đảm bảo file này đúng path
      edges: true,
      saoEnabled: false,
    })

    // sceneModel.on("loaded", () => {
    //   const t1 = performance.now()
    //   const seconds = ((t1 - t0) / 1000).toFixed(2)
    //   setLoadTime(`Model loaded in ${seconds} seconds. Objects: ${sceneModel.numEntities}`)
    // })

    return () => {
      viewer.destroy()
    }
  }, [])

  return (
    <div className="relative w-full h-screen">
      <canvas
        id="myCanvas"
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-0"
      />
      <canvas
        id="myNavCubeCanvas"
        ref={navCubeRef}
        className="absolute bottom-24 right-2 w-[250px] h-[250px] z-10"
      />
      <div className="absolute bottom-2 left-2 text-white bg-black bg-opacity-50 p-2 rounded">
        {loadTime}
      </div>
    </div>
  )
}
