// src/features/bim-viewer/useEdgeMeasurement.ts
import * as OBCF from "@thatopen/components-front";
import * as OBC from "@thatopen/components";
import React from "react";
import * as THREE from "three";
import { GetFragmentsGroup } from "@/lib/FragmentUtils";

interface useEdgeMeasurementProps {
  isEdgeMeasurement: boolean;
  componentRef: React.RefObject<OBC.Components | null>;
  worldRef: React.RefObject<OBC.World | null>;
  ifcContainerRef: React.RefObject<HTMLDivElement | null>;
}

export function useEdgeMeasurement({
  isEdgeMeasurement,
  componentRef,
  worldRef,
  ifcContainerRef,
}: useEdgeMeasurementProps): void {
  const components = componentRef.current;
  const world = worldRef.current;
  const container = ifcContainerRef.current;

  if (!components || !world || !container) return;
  
  const dimensions = components.get(OBCF.EdgeMeasurement);
  if (isEdgeMeasurement && world) {
    const fragmentsGroup = GetFragmentsGroup(world)
    const highlighter = components.get(OBCF.Highlighter);
    highlighter.enabled = false;
    dimensions.world = world;
    dimensions.enabled = true;

    for (const child of fragmentsGroup!.children) {
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
    dimensions.world = world;
    dimensions.enabled= false
    dimensions.deleteAll();
  }
}
