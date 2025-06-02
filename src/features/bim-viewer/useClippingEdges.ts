import * as OBC from "@thatopen/components";
import * as THREE from "three";
import React from "react";
import { fragmentManager } from "@/services/FragmentManager";

interface UseClippingEdgesProps {
  isClippingEdges: boolean;
  componentRef: React.RefObject<OBC.Components | null>;
  worldRef: React.RefObject<OBC.World | null>;
  ifcContainerRef: React.RefObject<HTMLDivElement | null>;
}

export function useClippingEdges({
  isClippingEdges,
  componentRef,
  worldRef,
  ifcContainerRef,
}: UseClippingEdgesProps): void {
  const component = componentRef.current;
  const world = worldRef.current;
  const container = ifcContainerRef.current;

  if (!component || !world || !container) return;


  if (isClippingEdges) {
    const model = fragmentManager.getModelByObjectName("example");
    if (!model) {
      console.warn("Không tìm thấy model với tên 'example'");
      return;
    }

    const _bbox = model._bbox;
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    
    _bbox.getSize(size);          // 🔧 QUAN TRỌNG: lấy kích thước
    _bbox.getCenter(center);      // 🔧 lấy tâm
    
    const geometry = new THREE.BoxGeometry(size.x + 0.05, size.y + 0.05, size.z + 0.05);
    geometry.translate(center.x, center.y, center.z);
    
    const material = new THREE.MeshBasicMaterial({
      color: 0x59f7f7,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    });
    
    const cube = new THREE.Mesh(geometry, material);
    cube.name = "BoundingCube";
    world.scene.three.add(cube);
    world.meshes.add(cube);



    container.ondblclick = () => {
   
    };

   

  } else {
 
  }
}

