import * as OBC from "@thatopen/components";
import React from "react";


export function UpdateCameraType(
  isOrthoPerspective: boolean,
  worldRef: React.RefObject<any>,
  navigationMode: "Orbit" | "FirstPerson" | "Plan" = "Orbit",
  componentRef: React.RefObject<OBC.Components | null>,  
) {
  if (!worldRef.current || !worldRef.current.camera) return;

  const camera = worldRef.current.camera;
  const components = componentRef.current;

  // Chuyển đổi giữa Orthographic và Perspective
  if (camera.projection) {
    if (isOrthoPerspective) {
      // const orthoPerspectiveCamera = new OBC.OrthoPerspectiveCamera(componentRef.current);
      // worldRef.current.camera = orthoPerspectiveCamera;
      // orthoPerspectiveCamera.controls.setLookAt(24, 12, 16, 0, 0, -10);
      // Cấu hình camera
      camera.projection.set("Orthographic");
    } else {
      // camera.projection.set("Perspective");
    }
  }

  // Cấu hình chế độ điều hướng
  // switch (navigationMode) {
  //   case "Orbit":
  //     camera.controls.mode = "orbit";
  //     camera.controls.minDistance = 1;
  //     camera.controls.maxDistance = 1000;
  //     camera.controls.enableZoom = true;
  //     break;

  //   case "FirstPerson":
  //     camera.controls.mode = "firstPerson";
  //     camera.controls.minDistance = 1;
  //     camera.controls.maxDistance = 1000;
  //     camera.controls.enableZoom = true;
  //     break;

  //   case "Plan":
  //     camera.controls.minPolarAngle = Math.PI / 2;
  //     camera.controls.maxPolarAngle = Math.PI / 2;
  //     camera.controls.enableZoom = false; // Vô hiệu hóa zoom trong chế độ Plan
  //     break;

  //   default:
  //     console.warn("Unknown navigation mode:", navigationMode);
  // }
}