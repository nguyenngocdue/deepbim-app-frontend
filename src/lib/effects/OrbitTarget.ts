import * as THREE from "three";
import * as OBC from "@thatopen/components";

export function moveOrbitTarget(point: THREE.Vector3, world: OBC.World) {
  const controls = world.camera.controls;
  if (!controls) {
    console.warn("🚨 OrbitControls not found.");
    return;
  }
  controls.setOrbitPoint(point.x, point.y, point.z, true);
  controls.update();
}
