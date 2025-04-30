import * as THREE from "three";
import * as OBC from "@thatopen/components";

export function createMarker(radius: number, color: string, point: THREE.Vector3): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(radius);
  const material = new THREE.MeshLambertMaterial({
    color,
    transparent: true,
    opacity: 0.8,
    depthTest: false,
  });

  const marker = new THREE.Mesh(geometry, material);
  marker.position.copy(point);
  return marker;
}

export function removeMarker(marker: THREE.Mesh | null, world: OBC.World) {
  if (!marker) return;
  world.scene.three.remove(marker);
  marker.geometry.dispose();
  marker.material.dispose();
}
