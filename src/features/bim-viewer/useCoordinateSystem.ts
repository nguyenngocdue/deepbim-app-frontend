import { useEffect, useRef } from "react";
import * as THREE from "three";
import { addAxesWithTextLabelsToScene } from "@/lib/AxesUtils";

interface UseCoordinateSystemProps {
  coordinateSysActive: boolean;
  worldRef: React.RefObject<any>; // World từ OBC
}

export function useCoordinateSystem({
  coordinateSysActive,
  worldRef,
}: UseCoordinateSystemProps): void {
  const axesGroupRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const world = worldRef.current;
    if (!world) return;

    let cancelled = false;

    const setupAxes = async () => {
      if (coordinateSysActive && !axesGroupRef.current) {
        const group = await addAxesWithTextLabelsToScene(world.scene.three, 10, 1.5);
        if (!cancelled) {
          axesGroupRef.current = group;
        }
      } else if (!coordinateSysActive && axesGroupRef.current) {
        world.scene.three.remove(axesGroupRef.current);
        axesGroupRef.current = null;
      }
    };

    setupAxes();

    return () => {
      cancelled = true;
      if (axesGroupRef.current) {
        world.scene.three.remove(axesGroupRef.current);
        axesGroupRef.current = null;
      }
    };
  }, [coordinateSysActive]);
}
