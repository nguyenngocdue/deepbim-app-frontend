// src/components/RacHouseAutodesk.tsx
import { useEffect } from 'react'
import {
  Viewer,
  WebIFCLoaderPlugin,
  NavCubePlugin 
} from '@xeokit/xeokit-sdk'
import * as WebIFC from 'web-ifc'

export default function RacHouseAutodesk() {
  useEffect(() => {
    const loadViewer = async () => {
      const viewer = new Viewer({
        canvasId: 'myCanvas',
        transparent: true,
        dtxEnabled: true,
      })

      viewer.camera.eye = [-3.933, 2.855, 27.018]
      viewer.camera.look = [4.4, 3.724, 8.899]
      viewer.camera.up = [-0.018, 0.999, 0.039]


        new NavCubePlugin(viewer, {
        canvasId: 'myNavCubeCanvas',
        visible: true,
        size: 200,
        alignment: 'topRight',
        bottomMargin: 0,
        rightMargin: 0,
      })

      const IfcAPI = new WebIFC.IfcAPI()
      IfcAPI.SetWasmPath('https://cdn.jsdelivr.net/npm/web-ifc@0.0.68/')
      await IfcAPI.Init()

      const ifcLoader = new WebIFCLoaderPlugin(viewer, {
        WebIFC,
        IfcAPI,
      })

      const sceneModel = ifcLoader.load({
        id: 'myModel',
        src: '/ifc/STEEL_R25.ifc', // Đặt đúng file tại public/ifc/Duplex.ifc
        loadMetadata: true,
        edges: true,
        dtxEnabled: true,
      })

      sceneModel.on('loaded', () => {
        viewer.cameraFlight.jumpTo(sceneModel)
      })
    }

    loadViewer().catch((e) => console.error('Viewer error:', e))
  }, [])

  return (
    <>
      <canvas
        id="myCanvas"
        className="fixed inset-0 w-screen h-screen z-0"
      />
       <canvas
      id="myNavCubeCanvas"
      className="fixed top-0 right-0 w-[200px] h-[200px] z-50"
    />
    </>
  )
}
