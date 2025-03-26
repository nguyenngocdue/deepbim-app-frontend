import * as THREE from 'three';

/**
 * Áp dụng clipping cho một mesh dựa trên một mặt phẳng.
 * @param mesh - Đối tượng THREE.Mesh cần áp dụng clipping
 * @param planeNormal - Vector pháp tuyến của mặt phẳng clipping (THREE.Vector3)
 * @param planeConstant - Khoảng cách từ gốc tọa độ đến mặt phẳng (số thực)
 */
export function applyClipping(
  mesh: THREE.Mesh,
  planeNormal: THREE.Vector3,
  planeConstant: number
): void {
  // Tạo một mặt phẳng clipping
  const clippingPlane = new THREE.Plane(planeNormal, planeConstant);

  // Đảm bảo material hỗ trợ clipping
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  materials.forEach((material) => {
    if (!material.clippingPlanes) {
      material.clippingPlanes = [];
    }
    material.clippingPlanes.push(clippingPlane);
    material.needsUpdate = true; // Cập nhật material
  });

  // Kích hoạt chế độ clipping trong renderer
  if (mesh.parent && mesh.parent.parent) {
    const scene = mesh.parent.parent;
    if (scene instanceof THREE.Scene) {
      scene.renderer.localClippingEnabled = true;
    }
  }
}

/**
 * Áp dụng clipping cho tất cả mesh con trong một group.
 * @param group - Đối tượng THREE.Group chứa các mesh con
 * @param planeNormal - Vector pháp tuyến của mặt phẳng clipping (THREE.Vector3)
 * @param planeConstant - Khoảng cách từ gốc tọa độ đến mặt phẳng (số thực)
 */
export function applyClippingToGroup(
  group: THREE.Group,
  planeNormal: THREE.Vector3,
  planeConstant: number
): void {
  // Duyệt qua tất cả mesh con trong group
  group.children.forEach((child) => {
    if (child instanceof THREE.Mesh) {
      // Áp dụng clipping cho mesh con
      applyClipping(child as THREE.Mesh, planeNormal, planeConstant);
    } else if (child instanceof THREE.Group) {
      // Nếu child là một group khác, đệ quy duyệt tiếp
      applyClippingToGroup(child as THREE.Group, planeNormal, planeConstant);
    }
  });
}