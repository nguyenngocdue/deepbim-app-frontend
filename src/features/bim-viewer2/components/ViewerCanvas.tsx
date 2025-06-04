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
} from "@xeokit/xeokit-sdk"

import Toolbar from "./Toolbar"
import { initNavCube } from "./plugins/initNavCube"
import { initFastNav } from "./plugins/initFastNav"
import { initSectionPlanes } from "./plugins/initSectionPlanes"
import { createSectionFromClick } from "@/lib/viewer-tools/CreateSectionFromClick"

export interface ViewerCanvasHandle {
    getViewer: () => Viewer | null
}

interface ViewerCanvasProps {
    modelConfig: XKTLoaderPluginParams
}

const ViewerCanvas = forwardRef<ViewerCanvasHandle, ViewerCanvasProps>(
    ({ modelConfig }, ref) => {
        const viewerRef = useRef<Viewer | null>(null)
        const sectionPlanesRef = useRef<SectionPlanesPlugin | null>(null)
        const sectionPlaneIdRef = useRef<string | null>(null)
        const [sectionVisible, setSectionVisible] = useState(false)

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

            const xktLoader = new XKTLoaderPlugin(viewer)
            const model = xktLoader.load(modelConfig)

            model.on("loaded", () => {
                viewer.cameraFlight.jumpTo(model)
            })

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
                <canvas id="myCanvas" className="fixed inset-0 w-screen h-screen z-0" />
                <canvas id="myNavCubeCanvas" className="fixed top-4 right-4 w-[200px] h-[200px] z-50" />
                <Toolbar
                    onToggleSection={handleToggleSection}
                    onResetView={handleResetView}
                />
            </>
        )
    }
)

export default ViewerCanvas
