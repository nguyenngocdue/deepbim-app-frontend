import * as OBCF from "@thatopen/components-front";
import * as OBC from "@thatopen/components";
import React from "react";
import * as THREE from 'three'
import { GetFragmentsGroup } from "@/lib/FragmentUtils";

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
}: AngleMeasurementsProps): void {
  const components = componentRef.current;
  const world = worldRef.current;
  const container = ifcContainerRef.current;

  if (!components || !world || !container) return;

  const angles = components.get(OBCF.AngleMeasurement);
  angles.world = world;
  if (haveAngleMeasurements) {
    const fragmentsGroup = GetFragmentsGroup(world)
    const highlighter = components.get(OBCF.Highlighter);
    highlighter.enabled = false;
    for (const child of fragmentsGroup!.children) {
      if (child instanceof THREE.Mesh) {
        world.meshes.add(child);
      }
    }

    angles.enabled = true;

    container.ondblclick = () => angles.create();
    window.onkeydown = (event) => {
      if (event.code === "Delete" || event.code === "Backspace") {
        angles.deleteAll();
      }
    };


  } else {
    angles.enabled = false;
    angles.deleteAll();
  }
}
