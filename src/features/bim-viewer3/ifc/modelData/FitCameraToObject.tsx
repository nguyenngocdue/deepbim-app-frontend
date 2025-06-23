import * as THREE from "three";


export function addGrid(scene: THREE.Scene, size: number = 1000, divisions: number = 100): void {
  const grid = new THREE.GridHelper(size, divisions, 0xcccccc, 0xeeeeee);
  grid.name = 'SceneGrid';

  // Handle material transparency
  const material = grid.material as THREE.Material | THREE.Material[];
  if (Array.isArray(material)) {
    material.forEach(m => {
      m.transparent = true;
      m.opacity = 0.25;
    });
  } else {
    material.transparent = true;
    material.opacity = 0.25;
  }

  scene.add(grid);
}

// Center an object at the origin (0,0,0)
export function centerObjectAtOrigin(object: THREE.Object3D): void {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  if (isFinite(center.x) && isFinite(center.y) && isFinite(center.z)) {
    object.position.sub(center);
  } else {
    console.warn("Invalid bounding box center, skipping centering");
  }
}

