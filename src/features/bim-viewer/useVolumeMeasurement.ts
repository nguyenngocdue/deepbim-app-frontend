import * as OBCF from "@thatopen/components-front";
import * as OBC from "@thatopen/components";
import React from "react";
import * as THREE from 'three'

interface VolumeMeasurementProps {
  hasVolumeMeasurement: boolean;
  componentRef: React.RefObject<OBC.Components | null>;
  worldRef: React.RefObject<OBC.World | null>;
  ifcContainerRef: React.RefObject<HTMLDivElement | null>;
  modelRef: React.RefObject<THREE.Object3D | null>;
}

export function useVolumeMeasurement({
  hasVolumeMeasurement,
  componentRef,
  worldRef,
  ifcContainerRef,
}: VolumeMeasurementProps): void {
  const components = componentRef.current;
  const world = worldRef.current;
  const container = ifcContainerRef.current;

  if (!components || !world || !container) return;

  const dimensions = components.get(OBCF.VolumeMeasurement);
  if (hasVolumeMeasurement) {
    
    dimensions.world = world;
    dimensions.enabled = true;
    container.ondblclick = () => dimensions.create();

    const highlighter = components.get(OBCF.Highlighter);
    highlighter.zoomToSelection=false;

    highlighter.events.select.onHighlight.add((event) => {
      const volume = dimensions.getVolumeFromFragments(event);
      console.log(volume);
    });
    
    highlighter.events.select.onClear.add(() => {
      dimensions.clear();
    });

    
    
  } else {
      dimensions.world = world;
      dimensions.enabled = false;
      dimensions.deleteAll();
  }
}
