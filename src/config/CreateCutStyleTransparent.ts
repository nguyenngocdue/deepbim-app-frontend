import * as THREE from "three";
import * as OBC from "@thatopen/components";

/**
 * Tạo style cắt với mô hình trong suốt, chỉ phần cắt có màu rõ ràng
 */
export function CreateCutStyleTransparent(
  name: string,
  object: THREE.Object3D,
  world: OBC.World,
  edges: OBC.Edges
) {
  // 1. Luôn để toàn bộ mô hình trong suốt
  object.traverse((child) => {
    if (child instanceof THREE.Mesh && child.material) {
      const mat = child.material as THREE.Material | THREE.Material[];
      if (Array.isArray(mat)) {
        mat.forEach((m) => {
          m.transparent = true;
          m.opacity = 0.1;
          (m as any).depthWrite = false;
        });
      } else {
        mat.transparent = true;
        mat.opacity = 0.1;
        (mat as any).depthWrite = false;
      }
    }
  });

  // 2. Đường viền khi cắt (cut line)
  const edgeLine = new THREE.LineBasicMaterial({
    color: "#ff0000", // đỏ tươi cho rõ
    linewidth: 2,
    transparent: true,
    opacity: 1,
    depthTest: false,
    polygonOffset: true,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -4,
  });

  // 3. Mặt bị cắt (cut face)
  const edgeFill = new THREE.MeshBasicMaterial({
    color: "#ff6666", // đỏ nhạt
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
  });

  // 4. Outline nhẹ (nếu muốn)
  const edgeOutline = new THREE.MeshBasicMaterial({
    color: "#ff0000",
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide,
  });

  // 5. Tạo style vào hệ thống edges
  edges.styles.create(
    name,
    new Set([object]),
    world,
    edgeLine,
    edgeFill,
    edgeOutline
  );
}
