import * as OBC from "@thatopen/components";
import React from "react";
import * as THREE from 'three'

interface GridsProps {
  haveGrids: boolean;
  componentRef: React.RefObject<OBC.Components | null>;
  worldRef: React.RefObject<OBC.World | null>;
  ifcContainerRef: React.RefObject<HTMLDivElement | null>;
  modelRef: React.RefObject<THREE.Object3D | null>;
}

export function userGrids({
  haveGrids,
  componentRef,
  worldRef,
  ifcContainerRef,
  modelRef,
}: GridsProps): void {
  const components = componentRef.current;
  const world = worldRef.current;
  const container = ifcContainerRef.current;
  const model = modelRef.current;

  if (!components || !world || !container || !model) return;

  if (haveGrids) {
    const grids = components.get(OBC.Grids);
    const grid = grids.create(world);
  }
}
