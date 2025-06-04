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
    CxConverterIFCLoaderPlugin,
} from "@xeokit/xeokit-sdk"

import Toolbar from "./Toolbar"
import { initNavCube } from "./plugins/initNavCube"
import { initSectionPlanes } from "./plugins/initSectionPlanes"
import { createSectionFromClick } from "@/lib/viewer-tools/CreateSectionFromClick"
import { initFastNav } from "./plugins"

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

            viewerRef.current = viewer;
            // Attach custom property to viewer for tracking viewId
            (viewer as any).viewId = viewId;
            initNavCube(viewer);
            initFastNav(viewer)

            const ext = modelConfig.src?.split(".").pop()?.toLowerCase()

            if (ext === "xkt") {
                const xktLoader = new XKTLoaderPlugin(viewer)
                const model = xktLoader.load(modelConfig)

                model.on("loaded", () => {
                    viewer.cameraFlight.jumpTo(model)
                })



                
            } else if (ext === "ifc") {
                const loadViewer = async () => {
                    const loader = new CxConverterIFCLoaderPlugin(viewer);
                    loader.load({
                        src: modelConfig.src,
                        progressCallback: (p) => {
                            const el = document.getElementById("progressPercentage");
                            if (el) el.innerText = p.toFixed(1) + "%";
                        },
                        progressTextCallback: (txt) => {
                            const el = document.getElementById("progressText");
                            if (el) el.innerText = txt;
                        }
                    }).then((model) => {
                        model.on("loaded", () => {
                            viewer.cameraFlight.flyTo();
                        });
                    });
                }
                loadViewer();
            } else {
                console.warn("⚠️ Unsupported file format:", ext)
            }
            const { sectionPlanes, planeId } = initSectionPlanes(viewer)
            sectionPlanesRef.current = sectionPlanes
            sectionPlaneIdRef.current = planeId

            return () => {
                viewer.destroy();
            };
        }, [modelConfig])


        const handleToggleSection = () => {
            const viewer = viewerRef.current
            if (!viewer) return
            createSectionFromClick(viewer)
        }
        const handleResetView = () => {
            const viewer = viewerRef.current
            if (!viewer) return
            viewer.cameraFlight.flyTo({
                aabb: viewer.scene.aabb,
            })
        }


        return (
            <>
                <canvas id={safeId} className="fixed inset-0 w-screen h-screen z-0" />
                <canvas id={`cube-${viewId}`} className="fixed top-4 right-4 w-[200px] h-[200px] z-50" />
                {/* <Toolbar
                    onToggleSection={handleToggleSection}
                    onResetView={handleResetView}
                /> */}
            </>
        )
    }
)

export default ViewerCanvas
