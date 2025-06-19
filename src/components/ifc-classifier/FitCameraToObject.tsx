import * as THREE from 'three';

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

export function addGrid(scene, size = 1000, divisions = 100) {
  const grid = new THREE.GridHelper(size, divisions);
  grid.name = 'SceneGrid';
  grid.material.opacity = 0.25;
  grid.material.transparent = true;
  scene.add(grid);
}


export function addDefaultLights(scene) {
  const ambient = new THREE.AmbientLight(0xffffff, 0.5); // ánh sáng môi trường nhẹ
  const directional = new THREE.DirectionalLight(0xffffff, 1); // ánh sáng mặt trời
  directional.position.set(10, 10, 10);
  directional.castShadow = true;

  scene.add(ambient);
  scene.add(directional);
}

