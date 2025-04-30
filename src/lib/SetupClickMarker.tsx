import * as THREE from "three";
import * as FRAGS from "@thatopen/fragments";
import * as OBC from "@thatopen/components";
import { NormalizeMouseEvent } from "./NormalizeMouseEvent";

interface SetupClickMarkerOptions {
  container: HTMLElement;
  model: FRAGS.FragmentsModel;
  world: OBC.World;
  sphereColor?: string;
  sphereRadius?: number;
  focusCamera?: boolean; // ✅ Bật chức năng xoay camera tới marker
}

export function SetupClickMarker({
  container,
  model,
  world,
  sphereColor = "#F59492",
  sphereRadius = 0.4,
  focusCamera = true,
}: SetupClickMarkerOptions) {
  const mouse = new THREE.Vector2();

  const sphereGeometry = new THREE.SphereGeometry(sphereRadius);
  const sphereMaterial = new THREE.MeshLambertMaterial({
    color: sphereColor,
    transparent: true,
    opacity: 0.8,
  });

  let marker: THREE.Mesh | null = null;

  const handleMouseDown = async (event: MouseEvent) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    const result = await model.raycast({
      camera: world.camera.three,
      mouse,
      dom: world.renderer!.three.domElement!,
    });

    if (!result) return;

    const { point } = result;

    // Xoá marker cũ nếu có
    if (marker) {
      world.scene.three.remove(marker);
      marker.geometry.dispose();
      (marker.material as THREE.Material).dispose();
    }

    // Tạo marker mới
    marker = new THREE.Mesh(sphereGeometry.clone(), sphereMaterial.clone());
    marker.position.copy(point);
    world.scene.three.add(marker);

    
    // ✅ Camera xoay đến marker
    if (focusCamera) {
       
      }
  };

  const handleMouseUp = () => {
    if (marker) {
      world.scene.three.remove(marker);
      marker.geometry.dispose();
      (marker.material as THREE.Material).dispose();
      marker = null;
    }
  };

  container.addEventListener("mousedown", handleMouseDown);
  container.addEventListener("mouseup", handleMouseUp);

  return () => {
    container.removeEventListener("mousedown", handleMouseDown);
    container.removeEventListener("mouseup", handleMouseUp);
    if (marker) {
      world.scene.three.remove(marker);
      marker.geometry.dispose();
      (marker.material as THREE.Material).dispose();
    }
  };
}
