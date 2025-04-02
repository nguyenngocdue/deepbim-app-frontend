import * as OBC from "@thatopen/components";
import React from "react";
import * as THREE from 'three'

interface WorldSettingsProps {
  haveWorldSettings: boolean;
  componentRef: React.RefObject<OBC.Components | null>;
  worldRef: React.RefObject<OBC.World | null>;
}

export function useWorldSettings({
  haveWorldSettings,
  componentRef,
  worldRef,
}: WorldSettingsProps): void {
  const components = componentRef.current;
  const world = worldRef.current;

  if (!components || !world) return;

  if (haveWorldSettings) {
    world.scene.three.background = new THREE.Color(0xE4F2DE);
  } else {
    world.scene.three.background = new THREE.Color(0x020817);
  }
  world.renderer?.update();
}
