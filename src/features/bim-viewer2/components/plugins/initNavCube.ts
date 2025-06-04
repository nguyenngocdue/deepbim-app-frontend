import { NavCubePlugin, Viewer } from "@xeokit/xeokit-sdk"

/**
 * Khởi tạo plugin NavCube cho viewer
 * @param viewer - Đối tượng viewer
 * @param canvasId - ID của canvas dùng cho NavCube
 */
export const initNavCube = (viewer: Viewer, canvasId: string = "myNavCubeCanvas") => {
  const navCube = new NavCubePlugin(viewer, {
    canvasId,
    color: "#D9D9D9",
    hoverColor: "#B0B0B0",
    textColor: "#333333",
    cameraFly: true,
    cameraFitFOV: 45,
    cameraFlyDuration: 0.5,
    visible: true,
  })

  return navCube
}
