// src/features/bim-viewer/useClippingEdges.ts
import * as OBCF from "@thatopen/components-front";
import * as OBC from "@thatopen/components";
import React from "react";
import * as THREE from 'three'
import { FragmentsGroup } from "@thatopen/fragments";
import { CreateCutStyleTransparent } from "@/config/CreateCutStyleTransparent";

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
    const fragmentsGroup = world.scene.three.children.find(
      (child): child is FragmentsGroup => child instanceof FragmentsGroup
    );
    if (!fragmentsGroup) {
      console.warn("FragmentsGroup not found");
      return;
    }    

    const highlighter = component.get(OBCF.Highlighter);
    highlighter.zoomToSelection=false;

    const casters = component.get(OBC.Raycasters);
    casters.enabled = true;
    const box3 = new THREE.Box3().setFromObject(fragmentsGroup);
    const size = new THREE.Vector3();
    box3.getSize(size);
    const center = new THREE.Vector3();
    box3.getCenter(center);

    const geometry = new THREE.BoxGeometry(size.x + 0.05, size.y + 0.05, size.z + 0.05);
    geometry.translate(center.x, center.y, center.z);

    const material = new THREE.MeshBasicMaterial({
      color: 0x59F7F7,
      transparent: true,
      opacity: 0.2,
      depthWrite: false,
    });

    const cube = new THREE.Mesh(geometry, material);
    cube.name = "BoundingCube";
    world.scene.three.add(cube);
    world.meshes.add(cube);

    casters.get(world);

    const clipper = component.get(OBC.Clipper);
    clipper.enabled = true;
    clipper.Type = OBCF.EdgesPlane;
    clipper.size = (size.x + size.y + size.z) / 12;

    const edges = component.get(OBCF.ClipEdges);
    edges.enabled = true;
    // CreateCutStyleTransparent("CutEdges", cube, world, edges);

    container.ondblclick = () => {
      if (clipper.enabled) {
        clipper.create(world);
        window.onkeydown = (event) => {
          if (event.code === "Delete" || event.code === "Backspace") {
            if (clipper.enabled) {
              clipper.delete(world);
            }
          }
        };

        container.addEventListener("mousemove", (event) => {
          if (!world?.camera || !world.renderer) return;

          const bounds = container.getBoundingClientRect();
          const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
          const y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;

          const pointer = new THREE.Vector2(x, y);
          const raycaster = new THREE.Raycaster();
          raycaster.setFromCamera(pointer, world.camera.three);

          const intersects = raycaster.intersectObject(cube);
          clipper.visible = intersects.length > 0;
        });
      }
    };
  } else {
    // Cleanup when isClippingEdges is false
    const clipper = component.get(OBC.Clipper);
    clipper.enabled = false;
    clipper.deleteAll()

    const edges = component.get(OBCF.ClipEdges);
    edges.enabled = false;
    

    const cube = world.scene.three.getObjectByName("BoundingCube");
    if (cube) {
      world.scene.three.remove(cube);
      world.meshes.delete(cube as THREE.Mesh);
    }
  }
}
