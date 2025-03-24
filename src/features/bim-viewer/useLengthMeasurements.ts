import * as OBCF from "@thatopen/components-front";
import * as OBC from "@thatopen/components";
import React from "react";
import * as THREE from 'three'

interface LengthMeasurementsProps {
  haveLengthMeasurements: boolean;
  componentRef: React.RefObject<OBC.Components | null>;
  worldRef: React.RefObject<OBC.World | null>;
  ifcContainerRef: React.RefObject<HTMLDivElement | null>;
  modelRef: React.RefObject<THREE.Object3D | null>;
}

export function useLengthMeasurements({
  haveLengthMeasurements,
  componentRef,
  worldRef,
  ifcContainerRef,
  modelRef,
}: LengthMeasurementsProps): void {
  const components = componentRef.current;
  const world = worldRef.current;
  const container = ifcContainerRef.current;
  const model = modelRef.current;

  if (!components || !world || !container || !model) return;

  if (haveLengthMeasurements) {
    for (const child of model.children) {
      if (child instanceof THREE.Mesh) {
        world.meshes.add(child);
      }
    }

    const dimensions = components.get(OBCF.LengthMeasurement);
    dimensions.world = world;
    dimensions.enabled = true;
    dimensions.snapDistance = 1;

    container.ondblclick = () => dimensions.create();
    
    window.onkeydown = (event) => {
      if (event.code === "Delete" || event.code === "Backspace") {
        dimensions.delete();
      }
    };

    
  } else {
    const dimensions = components.get(OBCF.LengthMeasurement);
      dimensions.enabled = false;
      dimensions.deleteAll();
  }
}
