import {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  Viewer,
  XKTLoaderPlugin,
  XKTLoaderPluginParams,
  SectionPlanesPlugin,
  CxConverterIFCLoaderPlugin,
} from "@xeokit/xeokit-sdk";

import { initNavCube } from "./plugins/initNavCube";
import { initFastNav } from "./plugins";
import { initSectionPlanes } from "./plugins/initSectionPlanes";
import { createSectionFromClick } from "@/lib/viewer-tools/CreateSectionFromClick";
import Toolbar from "./Toolbar";
// import Toolbar from "./Toolbar";

export interface ViewerCanvasHandle {
  getViewer: () => Viewer | null;
}

interface ViewerCanvasProps {
  modelConfig: XKTLoaderPluginParams;
  viewId: string;
}

const ViewerCanvas = forwardRef<ViewerCanvasHandle, ViewerCanvasProps>(
  ({ modelConfig, viewId }, ref) => {
    const viewerRef = useRef<Viewer | null>(null);
    const sectionPlanesRef = useRef<SectionPlanesPlugin | null>(null);
    const sectionPlaneIdRef = useRef<string | null>(null);

    const canvasId = `canvas-${viewId}`;
    const navCubeId = `cube-${viewId}`;

    useImperativeHandle(ref, () => ({
      getViewer: () => viewerRef.current,
    }));

    useEffect(() => {
      const viewer = new Viewer({
        canvasId,
        transparent: true,
        dtxEnabled: true,
      });

    viewer.camera.eye = [-23.68, 96.85, 30.65]
    viewer.camera.look = [60.59, 42.37, -25.39]
    viewer.camera.up = [0.39, 0.88, -0.26]

      viewerRef.current = viewer;
      (viewer as any).viewId = viewId;



      const ext = modelConfig.src?.split(".").pop()?.toLowerCase();

      if (ext === "xkt") {
        const xktLoader = new XKTLoaderPlugin(viewer);
        const model = xktLoader.load(modelConfig);
        model.on("loaded", () => {
          viewer.cameraFlight.jumpTo(model);
        });
      } else if (ext === "ifc") {
        const loadViewer = async () => {
          const loader = new CxConverterIFCLoaderPlugin(viewer);
          const model = await loader.load({
            src: modelConfig.src,
            progressCallback: (p) => {
              const el = document.getElementById("progressPercentage");
              if (el) el.innerText = p.toFixed(1) + "%";
            },
            progressTextCallback: (txt) => {
              const el = document.getElementById("progressText");
              if (el) el.innerText = txt;
            },
          });

          model.on("loaded", () => {
            viewer.cameraFlight.flyTo();
            const { sectionPlanes, planeId } = initSectionPlanes(viewer);
            sectionPlanesRef.current = sectionPlanes;
            sectionPlaneIdRef.current = planeId;
          });
        };
        loadViewer();
      } else {
        console.warn("⚠️ Unsupported file format:", ext);
      }

            initNavCube(viewer, navCubeId);
      initFastNav(viewer);

      return () => {
        viewer.destroy();
      };
    }, [modelConfig.src, viewId]);

    const handleToggleSection = () => {
      const viewer = viewerRef.current;
      if (!viewer) return;
      createSectionFromClick(viewer);
    };

    const handleResetView = () => {
      const viewer = viewerRef.current;
      if (!viewer) return;
      viewer.cameraFlight.flyTo({
        aabb: viewer.scene.aabb,
      });
    };

    return (
      <>
        <canvas id={canvasId} className="fixed inset-0 w-screen h-screen z-0" />
        <canvas id={navCubeId} className="fixed top-4 right-4 w-[200px] h-[200px] z-50" />
        <Toolbar
          onToggleSection={handleToggleSection}
          onResetView={handleResetView}
        />
      </>
    );
  }
);

export default ViewerCanvas;
