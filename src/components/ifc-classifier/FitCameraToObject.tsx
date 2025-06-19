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
