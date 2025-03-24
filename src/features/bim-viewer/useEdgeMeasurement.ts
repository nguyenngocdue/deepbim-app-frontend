// src/features/bim-viewer/useEdgeMeasurement.ts
import * as OBCF from "@thatopen/components-front";
import * as OBC from "@thatopen/components";
import React from "react";
import * as THREE from "three";

interface useEdgeMeasurementProps {
  isEdgeMeasurement: boolean;
  componentRef: React.RefObject<OBC.Components | null>;
  worldRef: React.RefObject<OBC.World | null>;
  ifcContainerRef: React.RefObject<HTMLDivElement | null>;
  modelRef: React.RefObject<THREE.Object3D | null>;
}

export function useEdgeMeasurement({
  isEdgeMeasurement,
  componentRef,
  worldRef,
  ifcContainerRef,
  modelRef,
}: useEdgeMeasurementProps): void {
  const components = componentRef.current;
  const world = worldRef.current;
  const container = ifcContainerRef.current;
  const model = modelRef.current;

  if (!components || !world || !container || !model) return;

  if (isEdgeMeasurement) {
    const dimensions = components.get(OBCF.EdgeMeasurement);
    dimensions.world = world;
    dimensions.enabled = true;

    // Custom styling

    for (const child of model.children) {
      if (child instanceof THREE.Mesh) {
        world.meshes.add(child);
      }
    }

    let saved: number[][];
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

    container.ondblclick = () => dimensions.create();
  } else {
    const dimensions = components.get(OBCF.EdgeMeasurement);
    dimensions.enabled = false;
    dimensions.deleteAll();
  }
}
