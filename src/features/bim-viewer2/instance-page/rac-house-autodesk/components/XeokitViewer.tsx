import { useEffect } from "react";
import {
  Viewer,
  XKTLoaderPlugin,
  NavCubePlugin,
  FastNavPlugin,
  TreeViewPlugin
} from "@xeokit/xeokit-sdk";

interface XeokitViewerProps {
  src: string;
}

export function XeokitViewer({ src }: XeokitViewerProps) {
  useEffect(() => {
    const viewer = new Viewer({
      canvasId: "myCanvas",
      transparent: true,
      saoEnabled: true,
    });

    viewer.scene.camera.eye = [-37.13, 13.01, 58.51];
    viewer.scene.camera.look = [-21.93, 1.35, 29.45];
    viewer.scene.camera.up = [0.15, 0.94, -0.29];

    new NavCubePlugin(viewer, {
      canvasId: "myNavCubeCanvas",
      visible: true,
      size: 250,
      alignment: "bottomRight",
      bottomMargin: 100,
      rightMargin: 10,
    });

    new FastNavPlugin(viewer, {
      hideEdges: true,
      hideSAO: true,
      scaleCanvasResolution: false,
      scaleCanvasResolutionFactor: 0.5,
      delayBeforeRestore: true,
      delayBeforeRestoreSeconds: 0.4,
    });

    const treeContainer = document.getElementById("treeViewContainer");
    if (treeContainer) {
      new TreeViewPlugin(viewer, {
        containerElement: treeContainer,
        hierarchy: "types",
        autoExpandDepth: 1,
      });
    }

    const loader = new XKTLoaderPlugin(viewer);
    const model = loader.load({
      id: "model",
      src,
      saoEnabled: true,
      dtxEnabled: true,
    });

    const t0 = performance.now();
    const timeEl = document.getElementById("time");
    if (timeEl) timeEl.innerHTML = "Loading model...";

    model.on("loaded", () => {
      const t1 = performance.now();
      if (timeEl) {
        timeEl.innerHTML = `Model loaded in ${((t1 - t0) / 1000).toFixed(2)}s<br>Objects: ${model.numEntities}`;
      }
    });

    return () => {
      viewer.clear();
      viewer.scene.clear();
    };
  }, [src]);

  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <canvas id="myCanvas" style={{ width: "100%", height: "100%" }} />
      <canvas
        id="myNavCubeCanvas"
        style={{
          position: "absolute",
          bottom: "100px",
          right: "10px",
          width: "250px",
          height: "250px",
          pointerEvents: "none",
        }}
      />
      <div
        id="treeViewContainer"
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          width: "300px",
          height: "500px",
          overflow: "auto",
          background: "white",
          zIndex: 10,
        }}
      />
      <div
        id="time"
        style={{
          position: "absolute",
          bottom: "10px",
          left: "10px",
          color: "white",
          background: "rgba(0,0,0,0.6)",
          padding: "5px 10px",
          zIndex: 10,
        }}
      />
    </div>
  );
}
