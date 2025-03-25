import * as OBCF from "@thatopen/components-front";
import * as OBC from "@thatopen/components";
import React from "react";
import * as THREE from 'three'

interface WorldSettingsProps {
  haveWorldSettings: boolean;
  componentRef: React.RefObject<OBC.Components | null>;
  worldRef: React.RefObject<OBC.World | null>;
  ifcContainerRef: React.RefObject<HTMLDivElement | null>;
  modelRef: React.RefObject<THREE.Object3D | null>;
}

export function useWorldSettings({
  haveWorldSettings,
  componentRef,
  worldRef,
  ifcContainerRef,
  modelRef,
}: WorldSettingsProps): void {
  const components = componentRef.current;
  const world = worldRef.current;
  const container = ifcContainerRef.current;
  const model = modelRef.current;

  if (!components || !world || !container || !model) return;

  if (haveWorldSettings) {
 
     // configuration
    world.scene.config.backgroundColor="#28d765"
    world.scene.config.directionalLight.intensity=0.5
    world.scene.config.ambientLight.intensity = 5

   console.log(world.renderer)
  }
}
