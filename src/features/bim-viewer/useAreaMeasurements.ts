import * as OBCF from "@thatopen/components-front";
import * as OBC from "@thatopen/components";
import React from "react";
import * as THREE from 'three'
import { GetFragmentsGroup } from "@/lib/FragmentUtils";

interface AreaMeasurementProps {
  haveAreaMeasureElements: boolean;
  componentRef: React.RefObject<OBC.Components | null>;
  worldRef: React.RefObject<OBC.World | null>;
  ifcContainerRef: React.RefObject<HTMLDivElement | null>;
  modelRef: React.RefObject<THREE.Object3D | null>;
}

export function useAreaMeasurements({
  haveAreaMeasureElements,
  componentRef,
  worldRef,
  ifcContainerRef,
}: AreaMeasurementProps): void {
  const components = componentRef.current;
  const world = worldRef.current;
  const container = ifcContainerRef.current;

  
  if (!components || !world || !container) return;
  const areaDims = components.get(OBCF.AreaMeasurement);
  areaDims.world = world;
  if (haveAreaMeasureElements) {
    const fragmentsGroup = GetFragmentsGroup(world)
    const highlighter = components.get(OBCF.Highlighter);
    highlighter.enabled = false;
    for (const child of fragmentsGroup!.children) {
      if (child instanceof THREE.Mesh) {
        world.meshes.add(child);
      }
    }
    areaDims.enabled = true;
    container.ondblclick = () => areaDims.create();
    container.oncontextmenu = () => areaDims.endCreation();

    window.onkeydown = (event) => {
      if (event.code === "Delete" || event.code === "Backspace") {
        areaDims.deleteAll();
      }
    };


  } else {
    areaDims.enabled = false;
    areaDims.deleteAll();
  }
}
