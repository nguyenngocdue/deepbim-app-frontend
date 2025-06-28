import * as THREE from 'three';
import { useImperativeHandle, forwardRef } from "react";
import { useThree } from '@react-three/fiber';
import { SelectedElementInfo } from '@/context/ifc/types';

/**
 * Adjusts camera and controls to frame a given object in the scene.
 * @param {THREE.PerspectiveCamera} camera - The camera to position.
 * @param {THREE.Object3D} object - The object to frame.
 * @param {OrbitControls} [controls] - Optional orbit controls to update target.
 */
export function fitCameraToObject(camera, object, controls) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxDim = Math.max(size.x, size.y, size.z);
  const fov = camera.fov * (Math.PI / 180);
  const cameraZ = Math.abs(maxDim / Math.tan(fov / 2));

  camera.position.set(center.x, center.y, center.z + cameraZ * 1.2);
  camera.lookAt(center);

  if (controls) {
    controls.target.copy(center);
    controls.update();
  }

  camera.updateProjectionMatrix();
}

export function centerObjectAtOrigin(object) {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  object.position.sub(center); // dịch ngược lại về (0,0,0)
}

/**
 * Adds a grid helper to the scene, optionally sized based on an object or a numeric value.
 * Allows customizing divisions and line colors.
 *
 * @param scene - The THREE.Scene to which the grid will be added.
 * @param objectOrSize - Either a 3D object to fit the grid to, or a fixed numeric size.
 * @param divisions - Number of grid divisions (default is 100).
 * @param colorMajor - Color for the main (center) grid lines.
 * @param colorMinor - Color for the minor grid lines.
 * @returns The created THREE.GridHelper instance.
 */
export function addGrid(
  scene: THREE.Scene,
  objectOrSize: THREE.Object3D | number = 1000,
  divisions: number = 100,
  colorMajor: THREE.ColorRepresentation = 0x888888,
  colorMinor: THREE.ColorRepresentation = 0x444444
): THREE.GridHelper {
  let gridSize = 1000;

  if (typeof objectOrSize === "number") {
    gridSize = objectOrSize;
  } else if (objectOrSize) {
    const box = new THREE.Box3().setFromObject(objectOrSize);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z, 100); // Ensure a minimum size
    gridSize = Math.ceil(maxDim * 4); // Extend grid to cover a larger area
    divisions = Math.ceil(gridSize / 10); // Adjust divisions for visual clarity
  }

  // ✅ Create grid with custom colors
  const grid = new THREE.GridHelper(gridSize, divisions, colorMajor, colorMinor);
  grid.name = "SceneGrid";

  // ✅ Set grid transparency
  if (grid.material instanceof THREE.Material) {
    grid.material.opacity = 0.5;
    grid.material.transparent = true;
  }

  scene.add(grid);
  return grid;
}

/**
 * Thêm ánh sáng mặc định vào scene giúp mô hình sáng và có chiều sâu.
 * @param scene - THREE.Scene cần thêm ánh sáng.
 */
export function setOtherLighting(scene: THREE.Scene) {
  // Clear old lights if needed
  scene.children
    .filter((obj) => obj.type === 'DirectionalLight' || obj.type === 'AmbientLight')
    .forEach((light) => scene.remove(light));

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // ánh sáng dịu
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 0.8); // ánh sáng chính
  dirLight.position.set(10, 20, 10);
  dirLight.castShadow = false;
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 0.3); // ánh sáng phụ ngược
  fillLight.position.set(-10, 10, -10);
  scene.add(fillLight);
}



export interface CameraControllerRef {
  camera: THREE.Camera;
  gl: THREE.WebGLRenderer;
  set: (state: Partial<{ camera: THREE.Camera }>) => void;
}

