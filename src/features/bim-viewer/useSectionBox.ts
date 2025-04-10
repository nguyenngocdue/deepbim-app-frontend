import * as OBCF from "@thatopen/components-front";
import * as OBC from "@thatopen/components";
import React from "react";
import * as THREE from 'three'
import { createBoxFacesFromBox3 } from "@/lib/CreateBoxFacesFromBox3";
import { extractFaceVerticesToWorld } from "@/lib/Face";

interface SectionBoxProps {
  sectionActive: boolean;
  componentRef: React.RefObject<OBC.Components | null>;
  worldRef: React.RefObject<OBC.World | null>;
  ifcContainerRef: React.RefObject<HTMLDivElement | null>;
  modelRef: React.RefObject<THREE.Object3D | null>;
}

export function useSectionBox({
  sectionActive,
  componentRef,
  worldRef,
  ifcContainerRef,
  modelRef,
}: SectionBoxProps): void {
  const components = componentRef.current;
  const world = worldRef.current;
  const container = ifcContainerRef.current;
  const model = modelRef.current;

  if (!components || !world || !container || !model) return;

  if (sectionActive) {
    for (const child of model.children) {
      if (child instanceof THREE.Mesh) {
        world.meshes.add(child);
      }
    }
  }

  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model);
  const faces = createBoxFacesFromBox3(box);
  faces.forEach(face => world!.scene.three.add(face));

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const handleClick =  window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, world.camera.three);

    const intersects = raycaster.intersectObjects(faces);
    if (intersects.length > 0) {
      const face = intersects[0].object;
      const [vertexA, vertexB, vertexC] = extractFaceVerticesToWorld(face);
      console.log(vertexA, vertexB, vertexC)

    }
  });
  window.addEventListener('click', handleClick);

  return () => {
    window.removeEventListener('click', handleClick);
  };

}
