import { useEffect, useRef, useState } from 'react'
import {
  Viewer,
  NavCubePlugin,
  FastNavPlugin,
  XKTLoaderPlugin,
  DistanceMeasurementsPlugin,
} from '@xeokit/xeokit-sdk'

export default function XktDtxAPHS() {
  const viewerRef = useRef<Viewer | null>(null)
  const distancePluginRef = useRef<DistanceMeasurementsPlugin | null>(null)
  const [measuring, setMeasuring] = useState(false)

  useEffect(() => {
    const loadViewer = async () => {
      const viewer = new Viewer({
        canvasId: 'myCanvas',
        transparent: true,
        dtxEnabled: true,
      })
      viewerRef.current = viewer

      viewer.camera.eye = [-3.933, 2.855, 27.018]
      viewer.camera.look = [4.4, 3.724, 8.899]
      viewer.camera.up = [-0.018, 0.999, 0.039]

      new NavCubePlugin(viewer, {
        canvasId: 'myNavCubeCanvas',
        visible: true,
        size: 250,
        alignment: 'bottomRight',
        bottomMargin: 100,
        rightMargin: 10,
      })

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

      const xktLoader = new XKTLoaderPlugin(viewer)

      const sceneModel = xktLoader.load({
        id: 'myModel',
        src: '/ifc/APHS.xkt',
        edges: true,
        saoEnabled: false,
      })

      const distancePlugin = new DistanceMeasurementsPlugin(viewer, {
        active: false, // Start inactive
      })
      distancePluginRef.current = distancePlugin

      sceneModel.on('loaded', () => {
        viewer.cameraFlight.jumpTo(sceneModel)
      })
    }

    loadViewer().catch((e) => console.error('Viewer error:', e))
  }, [])

  const toggleMeasurement = () => {
    const plugin = distancePluginRef.current
    if (plugin) {
      const newState = !plugin.active
      plugin.setActive(newState)
      setMeasuring(newState)
    }
  }

  return (
    <>
      <canvas id="myCanvas" className="fixed inset-0 w-screen h-screen z-0" />
      <canvas
        id="myNavCubeCanvas"
        className="fixed top-4 right-4 w-[200px] h-[200px] z-50"
      />
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={toggleMeasurement}
          className={`px-4 py-2 rounded shadow ${
            measuring ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
          }`}
        >
          {measuring ? 'Measuring...' : 'Measure'}
        </button>
      </div>
    </>
  )
}
