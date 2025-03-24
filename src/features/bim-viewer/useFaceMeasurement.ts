import * as OBCF from "@thatopen/components-front";
import * as OBC from "@thatopen/components";
import React from "react";
import * as THREE from 'three'

interface FaceMeasurementProps {
  isFaceMeasurement: boolean;
  componentRef: React.RefObject<OBC.Components | null>;
  worldRef: React.RefObject<OBC.World | null>;
  ifcContainerRef: React.RefObject<HTMLDivElement | null>;
  modelRef: React.RefObject<THREE.Object3D | null>;
}

export function useFaceMeasurement({
  isFaceMeasurement,
  componentRef,
  worldRef,
  ifcContainerRef,
  modelRef,
}: FaceMeasurementProps): void {
  const components = componentRef.current;
  const world = worldRef.current;
  const container = ifcContainerRef.current;
  const model = modelRef.current;

  if (!components || !world || !container || !model) return;

  if (isFaceMeasurement) {
    for (const child of model.children) {
      if (child instanceof THREE.Mesh) {
        world.meshes.add(child);
      }
    }

    const dimensions = components.get(OBCF.FaceMeasurement);
    dimensions.world = world;
    dimensions.enabled = true;
    container.ondblclick = () => dimensions.create();


    let saved: OBCF.SerializedAreaMeasure[];

    window.addEventListener("keydown", (event) => {
      if (event.code === "KeyO") {
        dimensions.delete();
      } else if (event.code === "KeyS") {
        saved = dimensions.get();
        dimensions.deleteAll();
      } else if (event.code === "KeyL") {
        if (saved) {
          dimensions.set(saved);
        }
      }
    });

    
  } else {
    const dimensions = components.get(OBCF.FaceMeasurement);
      dimensions.enabled = false;
      dimensions.deleteAll();
  }
}
