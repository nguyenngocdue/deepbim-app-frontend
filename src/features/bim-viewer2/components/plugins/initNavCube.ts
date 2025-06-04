import { NavCubePlugin, Viewer } from "@xeokit/xeokit-sdk"

export const initNavCube = (viewer: Viewer) => {
  const navCube = new NavCubePlugin(viewer, {
    canvasId: `cube-${(viewer as any)?.viewId || "default"}`,
    color: "#D9D9D9",
    hoverColor: "#B0B0B0",
    textColor: "#333333",
    cameraFly: true,
    cameraFitFOV: 45,
    cameraFlyDuration: 0.5,
    visible: true,
  })
}
