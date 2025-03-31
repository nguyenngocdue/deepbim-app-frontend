import { ThreeHighlighter } from "@/lib/effects/HighlightElement";
import { drawTrianglesFromFaces, highlightFace, highlightFaceBoundary, highlightFaceOutline, highlightRectangleFace, highlightRectangleOnSurface } from "@/lib/Face";
import { addPointsToScene, createKeyPoint } from "@/lib/PointUtils";
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


    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    let highlightMesh: THREE.Mesh | null = null;

    function onMouseMove(event: MouseEvent) {
      const rect = container.getBoundingClientRect();

      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);

      const intersects = raycaster.intersectObject(model, true);
      if (intersects.length > 0) {
        const intersect = intersects[0];
        highlightMesh = highlightRectangleOnSurface(intersect, scene);
      } else if (highlightMesh) {
        scene.remove(highlightMesh);
        highlightMesh = null;
      }
    }

    container.addEventListener("mousemove", onMouseMove);

    return () => {
      container.removeEventListener("mousemove", onMouseMove);
    };
  }, [
    isFreeControlElements2,
    componentRef,
    worldRef,
    ifcContainerRef,
    modelRef,
  ]);

}