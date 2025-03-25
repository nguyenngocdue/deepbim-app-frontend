import * as OBC from "@thatopen/components";
import * as OBCF from "@thatopen/components-front";

export function UpdateCameraType(
    isOrthoPerspective: boolean,
    worldRef: React.RefObject<any>,
    navigationMode: "Orbit" | "FirstPerson" | "Plan" = "Orbit"
  ) {
    if (!worldRef.current || !worldRef.current.camera) return;
  
    const camera = worldRef.current.camera;
  
    // Chuyển đổi giữa Orthographic và Perspective
    if (isOrthoPerspective) {
      camera.projection.set("Orthographic");
      camera.projection.setOrthoCamera(); // Thiết lập thông số Orthographic
    } else {
        const components = new OBC.Components();
        // const world = worldRef.current;
        // world.camera = new OBC.SimpleCamera(components);
      camera.projection.set("Perspective");
      camera.projection.setPerspectiveCamera();
    }
  
    // Cấu hình chế độ điều hướng
    switch (navigationMode) {
      case "Orbit":
        camera.controls.mode = "orbit";
        // camera.controls.minDistance = 1;
        // camera.controls.maxDistance = 1000;
        camera.controls.enableZoom = true;
        break;
  
      case "FirstPerson":
        camera.controls.mode = "firstPerson";
        camera.controls.minDistance = 1;
        camera.controls.maxDistance = 1000;
        camera.controls.enableZoom = true;
        break;
  
      case "Plan":
        camera.controls.minPolarAngle = Math.PI / 2;
        camera.controls.maxPolarAngle = Math.PI / 2;
        camera.controls.enableZoom = false; // Vô hiệu hóa zoom trong chế độ Plan
        break;
  
      default:
        console.warn("Unknown navigation mode:", navigationMode);
    }
  }