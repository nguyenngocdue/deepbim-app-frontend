import {
    useEffect,
    useRef,
    useState,
    forwardRef,
    useImperativeHandle,
} from "react"
import {
    Viewer,
    XKTLoaderPlugin,
    XKTLoaderPluginParams,
    SectionPlanesPlugin,
    WebIFCLoaderPlugin,
} from "@xeokit/xeokit-sdk"

import Toolbar from "./Toolbar"
import { initNavCube } from "./plugins/initNavCube"
import { initFastNav } from "./plugins/initFastNav"
import { initSectionPlanes } from "./plugins/initSectionPlanes"
import { createSectionFromClick } from "@/lib/viewer-tools/CreateSectionFromClick"
import * as WebIFC from 'web-ifc'

export interface ViewerCanvasHandle {
    getViewer: () => Viewer | null
}

interface ViewerCanvasProps {
    modelConfig: XKTLoaderPluginParams
    viewId: string
}

const ViewerCanvas = forwardRef<ViewerCanvasHandle, ViewerCanvasProps>(
    ({ modelConfig, viewId }, ref) => {
        const viewerRef = useRef<Viewer | null>(null)
        const sectionPlanesRef = useRef<SectionPlanesPlugin | null>(null)
        const sectionPlaneIdRef = useRef<string | null>(null)
        const safeId = `canvas-${viewId}`;

        useImperativeHandle(ref, () => ({
            getViewer: () => viewerRef.current,
        }))

        useEffect(() => {
            const viewer = new Viewer({
                canvasId: safeId,
                transparent: true,
                dtxEnabled: true,
            })

            viewer.camera.eye = [-3.933, 2.855, 27.018]
            viewer.camera.look = [4.4, 3.724, 8.899]
            viewer.camera.up = [-0.018, 0.999, 0.039]

            viewerRef.current = viewer

            const ext = modelConfig.src?.split(".").pop()?.toLowerCase()

            if (ext === "xkt") {
                const xktLoader = new XKTLoaderPlugin(viewer)
                const model = xktLoader.load(modelConfig)

                model.on("loaded", () => {
                    viewer.cameraFlight.jumpTo(model)
                })
            } else if (ext === "ifc") {
               const loadViewer = async () => {
                     const IfcAPI = new WebIFC.IfcAPI()
                     IfcAPI.SetWasmPath('https://cdn.jsdelivr.net/npm/web-ifc@0.0.68/')
                     await IfcAPI.Init()
                     const ifcLoader = new WebIFCLoaderPlugin(viewer, {
                       WebIFC,
                       IfcAPI,
                     })
                     const sceneModel = ifcLoader.load(modelConfig)
                     sceneModel.on('loaded', () => {
                       viewer.cameraFlight.jumpTo(sceneModel)
                     })
                   }
                   loadViewer();
            } else {
                console.warn("⚠️ Unsupported file format:", ext)
            }
            initNavCube(viewer)
            initFastNav(viewer)
            const { sectionPlanes, planeId } = initSectionPlanes(viewer)
            sectionPlanesRef.current = sectionPlanes
            sectionPlaneIdRef.current = planeId
        }, [modelConfig])


        const handleToggleSection = () => {
            const viewer = viewerRef.current
            if (!viewer) return
            createSectionFromClick(viewer)
        }
        const handleResetView = () => {
            viewerRef.current?.cameraFlight.flyTo({
                aabb: viewerRef.current.scene.aabb,
            })
        }

        return (
            <>
                <canvas id={safeId} className="fixed inset-0 w-screen h-screen z-0" />
                <canvas id={`myNavCubeCanvas-${safeId}`} className="fixed top-4 right-4 w-[200px] h-[200px] z-50" />
                <Toolbar
                    onToggleSection={handleToggleSection}
                    onResetView={handleResetView}
                />
            </>
        )
    }
)

export default ViewerCanvas
