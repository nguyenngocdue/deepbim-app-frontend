import { useEffect } from "react";
import {
  Viewer,
  NavCubePlugin,
  TreeViewPlugin,
  CxConverterIFCLoaderPlugin
} from "@xeokit/xeokit-sdk";

export function TestXeokit() {
  useEffect(() => {
    // ✅ Khởi tạo Viewer bằng canvasId
    const viewer = new Viewer({
      canvasId: "myCanvas",
      transparent: true
    });

    viewer.camera.eye = [-3.933, 2.855, 27.018];
    viewer.camera.look = [4.400, 3.724, 8.899];
    viewer.camera.up = [-0.018, 0.999, 0.039];

    new NavCubePlugin(viewer, {
      canvasId: "myNavCubeCanvas",
      visible: true,
      size: 250,
      alignment: "bottomRight",
      bottomMargin: 100,
      rightMargin: 10,
    });

    new TreeViewPlugin(viewer, {
      containerElement: document.getElementById("treeViewContainer")!,
      autoExpandDepth: 3,
    });

    const loader = new CxConverterIFCLoaderPlugin(viewer);

    loader.load({
      src: "/ifc/road_3.ifc",
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

    return () => {
      viewer.destroy();
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* ✅ Canvas phải có id đúng */}
      <canvas id="myCanvas" style={{ width: "100%", height: "500px", backgroundColor: "#000" }} />
      <canvas
        id="myNavCubeCanvas"
        style={{
          position: "absolute",
          width: 250,
          height: 250,
          bottom: 100,
          right: 10,
        }}
      />
      <div
        id="treeViewContainer"
        style={{ height: 200, overflow: "auto", border: "1px solid gray" }}
      />
      <div>
        <div id="progressPercentage">0%</div>
        <div id="progressText">Loading...</div>
      </div>
    </div>
  );
}
