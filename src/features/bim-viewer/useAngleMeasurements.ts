import * as OBCF from "@thatopen/components-front";
import * as OBC from "@thatopen/components";
import React from "react";
import * as THREE from 'three'

interface AngleMeasurementsProps {
  haveAngleMeasurements: boolean;
  componentRef: React.RefObject<OBC.Components | null>;
  worldRef: React.RefObject<OBC.World | null>;
  ifcContainerRef: React.RefObject<HTMLDivElement | null>;
  modelRef: React.RefObject<THREE.Object3D | null>;
}

export function useAngleMeasurements({
  haveAngleMeasurements,
  componentRef,
  worldRef,
  ifcContainerRef,
  modelRef,
}: AngleMeasurementsProps): void {
  const components = componentRef.current;
  const world = worldRef.current;
  const container = ifcContainerRef.current;
  const model = modelRef.current;

  if (!components || !world || !container || !model) return;

  if (haveAngleMeasurements) {
    for (const child of model.children) {
      if (child instanceof THREE.Mesh) {
        world.meshes.add(child);
      }
    }

    const angles = components.get(OBCF.AngleMeasurement);
    angles.world = world;
    angles.enabled = true;

    container.ondblclick = () => angles.create();
    window.onkeydown = (event) => {
      if (event.code === "Delete" || event.code === "Backspace") {
        angles.deleteAll();
      }
    };

    
  } else {
    const angles = components.get(OBCF.AngleMeasurement);
    angles.enabled = false;
    angles.deleteAll();
  }
}
