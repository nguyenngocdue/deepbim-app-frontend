import * as OBCF from "@thatopen/components-front";
import * as OBC from "@thatopen/components";
import React from "react";
import * as THREE from 'three'
import { GetFragmentsGroup } from "@/lib/FragmentUtils";

interface FaceMeasurementProps {
  isFaceMeasurement: boolean;
  componentRef: React.RefObject<OBC.Components | null>;
  worldRef: React.RefObject<OBC.World | null>;
  ifcContainerRef: React.RefObject<HTMLDivElement | null>;
}

export function useFaceMeasurement({
  isFaceMeasurement,
  componentRef,
  worldRef,
  ifcContainerRef,
}: FaceMeasurementProps): void {
  const components = componentRef.current;
  const world = worldRef.current;
  const container = ifcContainerRef.current;

  if (!components || !world || !container) return;

  const dimensions = components.get(OBCF.FaceMeasurement);
  dimensions.world = world;

  if (isFaceMeasurement) {
    const fragmentsGroup = GetFragmentsGroup(world)
    const highlighter = components.get(OBCF.Highlighter);
    highlighter.enabled = false;

    for (const child of fragmentsGroup!.children) {
      if (child instanceof THREE.Mesh) {
        world.meshes.add(child);
      }
    }

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
      dimensions.enabled = false;
      dimensions.deleteAll();
  }
}
