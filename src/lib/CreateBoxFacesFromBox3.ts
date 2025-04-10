import * as THREE from 'three';

/**
 * Create 6 PlaneGeometry faces from a Box3.
 * Each face is an independent THREE.Mesh, used for interaction, raycasting, or highlighting.
 * @param box3 - The bounding box (Box3) to create faces from
 * @returns An array of 6 THREE.Mesh objects (named face_0 to face_5)
 */
export function createBoxFacesFromBox3(box3: THREE.Box3): THREE.Mesh[] {
  const size = new THREE.Vector3();
  const center = new THREE.Vector3();
  box3.getSize(size); // Get the dimensions of the bounding box
  box3.getCenter(center); // Get the center of the bounding box

  const faces: THREE.Mesh[] = [];

  const materials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, transparent: true, opacity: 0.3 }), // front
    new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, transparent: true, opacity: 0.3 }), // back
    new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide, transparent: true, opacity: 0.3 }), // top
    new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide, transparent: true, opacity: 0.3 }), // bottom
    new THREE.MeshBasicMaterial({ color: 0xff00ff, side: THREE.DoubleSide, transparent: true, opacity: 0.3 }), // left
    new THREE.MeshBasicMaterial({ color: 0x00ffff, side: THREE.DoubleSide, transparent: true, opacity: 0.3 }), // right
  ];

  const geometries = [
    new THREE.PlaneGeometry(size.x, size.y), // front/back
    new THREE.PlaneGeometry(size.x, size.y),
    new THREE.PlaneGeometry(size.x, size.z), // top/bottom
    new THREE.PlaneGeometry(size.x, size.z),
    new THREE.PlaneGeometry(size.z, size.y), // left/right
    new THREE.PlaneGeometry(size.z, size.y),
  ];

  const offsets: [number, number, number][] = [
    [0, 0, size.z / 2],   // front
    [0, 0, -size.z / 2],  // back
    [0, size.y / 2, 0],   // top
    [0, -size.y / 2, 0],  // bottom
    [-size.x / 2, 0, 0],  // left
    [size.x / 2, 0, 0],   // right
  ];

  const rotations: [number, number, number][] = [
    [0, 0, 0],                     // front
    [0, Math.PI, 0],              // back
    [-Math.PI / 2, 0, 0],         // top
    [Math.PI / 2, 0, 0],          // bottom
    [0, Math.PI / 2, 0],          // left
    [0, -Math.PI / 2, 0],         // right
  ];

  for (let i = 0; i < 6; i++) {
    const mesh = new THREE.Mesh(geometries[i], materials[i]);
    mesh.position.set(
      center.x + offsets[i][0],
      center.y + offsets[i][1],
      center.z + offsets[i][2]
    );
    mesh.rotation.set(rotations[i][0], rotations[i][1], rotations[i][2]);
    mesh.name = `face_${i}`;
    faces.push(mesh);
  }

  return faces;
}