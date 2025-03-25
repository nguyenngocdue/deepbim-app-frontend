import * as OBCF from "@thatopen/components-front";
import * as OBC from "@thatopen/components";
import React from "react";
import * as THREE from 'three'

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
  modelRef,
}: AreaMeasurementProps): void {
  const components = componentRef.current;
  const world = worldRef.current;
  const container = ifcContainerRef.current;
  const model = modelRef.current;

  if (!components || !world || !container || !model) return;

  if (haveAreaMeasureElements) {
    for (const child of model.children) {
      if (child instanceof THREE.Mesh) {
        world.meshes.add(child);
      }
    }

    const areaDims = components.get(OBCF.AreaMeasurement);
    areaDims.world = world;
    areaDims.enabled = true;

    container.ondblclick = () => areaDims.create();
    container.oncontextmenu = () => areaDims.endCreation();

    window.onkeydown = (event) => {
      if (event.code === "Delete" || event.code === "Backspace") {
        areaDims.deleteAll();
      }
    };

    
  } else {
    const areaDims = components.get(OBCF.AreaMeasurement);
    areaDims.enabled = false;
    areaDims.deleteAll();
  }
}
