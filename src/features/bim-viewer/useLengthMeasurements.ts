import * as OBCF from "@thatopen/components-front";
import * as OBC from "@thatopen/components";
import React from "react";
import * as THREE from 'three'
import { GetFragmentsGroup } from "@/lib/FragmentUtils";

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
}: LengthMeasurementsProps): void {
  const components = componentRef.current;
  const world = worldRef.current;
  const container = ifcContainerRef.current;

  if (!components || !world || !container) return;

  const dimensions = components.get(OBCF.LengthMeasurement);
  if (haveLengthMeasurements) {
    const fragmentsGroup = GetFragmentsGroup(world)
    const highlighter = components.get(OBCF.Highlighter);
    highlighter.enabled = false;

    for (const child of fragmentsGroup!.children) {
      if (child instanceof THREE.Mesh) {
        world.meshes.add(child);
      }
    }

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
    dimensions.world = world;
    dimensions.enabled = false;
    dimensions.deleteAll();
  }
}
