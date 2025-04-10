import * as THREE from 'three';


export function findClosestVertex(mesh: THREE.Object3D, intersectionPoint: THREE.Vector3): THREE.Vector3 | null {
    if (!(mesh instanceof THREE.Mesh)) return null;

    const positionAttribute = mesh.geometry.getAttribute('position');
    if (!positionAttribute) return null;

    let closestVertex: THREE.Vector3 | null = null;
    let minDistance = Infinity;

    for (let i = 0; i < positionAttribute.count; i++) {
        const vertex = new THREE.Vector3();
        vertex.fromBufferAttribute(positionAttribute, i);

        // Chuyển vertex từ local space sang world space
        mesh.localToWorld(vertex);

        // Tính khoảng cách từ điểm va chạm đến vertex
        const distance = vertex.distanceTo(intersectionPoint);
        if (distance < minDistance) {
            minDistance = distance;
            closestVertex = vertex;
        }
    }
    return closestVertex;
}

export function  findClosestVertexWithBVH(mesh: THREE.Mesh, intersectionPoint: THREE.Vector3): THREE.Vector3 | null {
    const positionAttribute = mesh.geometry.getAttribute('position');
    if (!positionAttribute) return null;
  
    let closestVertex: THREE.Vector3 | null = null;
    let minDistance = Infinity;
  
    // Duyệt qua tất cả các đỉnh trong geometry
    for (let i = 0; i < positionAttribute.count; i++) {
      const vertex = new THREE.Vector3().fromBufferAttribute(positionAttribute, i);
      mesh.localToWorld(vertex);
  
      const distance = vertex.distanceTo(intersectionPoint);
      if (distance < minDistance) {
        minDistance = distance;
        closestVertex = vertex;
      }
    }
  
    return closestVertex;
  }

