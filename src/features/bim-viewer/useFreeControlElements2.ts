import { ThreeHighlighter } from "@/lib/effects/HighlightElement";
import { drawTrianglesFromFaces } from "@/lib/Face";
import * as OBC from "@thatopen/components";
import { useEffect } from "react";
import * as THREE from 'three';

interface FreeControlElements2Props {
  isFreeControlElements2: boolean;
  componentRef: React.RefObject<OBC.Components | null>;
  worldRef: React.RefObject<OBC.World | null>;
  ifcContainerRef: React.RefObject<HTMLDivElement | null>;
  modelRef: React.RefObject<THREE.Object3D | null>;
}


export function useFreeControlElements2({
  isFreeControlElements2,
  componentRef,
  worldRef,
  ifcContainerRef,
  modelRef,
}: FreeControlElements2Props) {

  useEffect(() => {
    if (!isFreeControlElements2) return;

    const components = componentRef.current;
    const world = worldRef.current;
    const container = ifcContainerRef.current;
    const model = modelRef.current;

    if (!components || !world || !container || !model) {
      console.error("Invalid references");
      return;
    }

    const camera = world.camera.three;
    const scene = world.scene.three;

    world.camera.enabled = false;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    let triangleLines: THREE.LineSegments | null = null;

    function onMouseMove(event: MouseEvent) {
      const rect = container.getBoundingClientRect();

      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      const intersects = raycaster.intersectObject(model, true);
      if (intersects.length > 0) {
        const intersect = intersects[0];

        if (intersect.object instanceof THREE.Mesh && intersect.face) {
          const realMesh = intersect.object;
          const { a, b, c } = intersect.face;
          const geometry = realMesh.geometry;

          if (!geometry.isBufferGeometry) {
            console.error("Geometry is not a BufferGeometry");
            return;
          }

          const vertices = geometry.attributes.position;

          // Lấy tọa độ local
          const vertexA_local = new THREE.Vector3().fromBufferAttribute(vertices, a);
          const vertexB_local = new THREE.Vector3().fromBufferAttribute(vertices, b);
          const vertexC_local = new THREE.Vector3().fromBufferAttribute(vertices, c);

          // Cập nhật ma trận world
          scene.updateMatrixWorld(true);
          realMesh.updateMatrixWorld(true);

          // Chuyển đổi sang tọa độ world
          const vertexA_world = realMesh.localToWorld(vertexA_local);
          const vertexB_world = realMesh.localToWorld(vertexB_local);
          const vertexC_world = realMesh.localToWorld(vertexC_local);

          console.log("World coordinates:", vertexA_world, vertexB_world, vertexC_world);

          // Tạo hình học cho tam giác
          const triangleGeometry = new THREE.BufferGeometry().setFromPoints([
            vertexA_world,
            vertexB_world,
            vertexC_world,
            vertexA_world // Đóng vòng
          ]);
          const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

          // Xóa tam giác cũ (nếu có)
          if (triangleLines) scene.remove(triangleLines);

          // Thêm tam giác mới
          triangleLines = new THREE.Line(triangleGeometry, lineMaterial);
          scene.add(triangleLines);
        }
      }
      else if (triangleLines) {
        scene.remove(triangleLines);
        triangleLines = null;
      }
    }

    container.addEventListener("mousemove", onMouseMove);

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      if (triangleLines) scene.remove(triangleLines);
      world.camera.enabled = true;
    };
  }, [
    isFreeControlElements2,
    componentRef,
    worldRef,
    ifcContainerRef,
    modelRef,
  ]);

}