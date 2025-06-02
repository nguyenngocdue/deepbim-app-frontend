import * as OBC from "@thatopen/components";
import React from "react";
import { useClippingCube } from "./useClippingCube";
import { worldManager } from "@/services/WorldManager";
import { modelManager } from "@/services/ModelManager";

interface UseClippingEdgesProps {
  isClippingEdges: boolean;
  componentRef: React.RefObject<OBC.Components | null>;
  worldRef: React.RefObject<OBC.World | null>;
  ifcContainerRef: React.RefObject<HTMLDivElement | null>;
  modelRef: React.RefObject<any>;
}

export function useClippingEdges({
  isClippingEdges,
  componentRef,
  worldRef,
  ifcContainerRef,
  modelRef
}: UseClippingEdgesProps): void {
  const component = componentRef.current;
  const world = worldRef.current;
  const container = ifcContainerRef.current;

  useClippingCube({
    scene: world?.scene?.three,
    renderer: world?.renderer?.three,
    camera: world?.camera?.three,
    container: container ?? undefined,
    enabled: isClippingEdges,
  });
}
